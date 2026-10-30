import { cache } from '../lib/cache.js';

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';
const BOOKS_SEARCH_TTL_MS = 5 * 60 * 1000;
const BOOK_DETAILS_TTL_MS = 12 * 60 * 60 * 1000;
const BOOKS_PAGE_SIZE = 20;

type GoogleVolume = {
  id?: unknown;
  volumeInfo?: {
    title?: unknown;
    subtitle?: unknown;
    authors?: unknown;
    description?: unknown;
    publisher?: unknown;
    publishedDate?: unknown;
    pageCount?: unknown;
    imageLinks?: { thumbnail?: unknown; smallThumbnail?: unknown };
    language?: unknown;
    categories?: unknown;
    industryIdentifiers?: Array<{ type?: unknown; identifier?: unknown }>;
  };
};

type GoogleSearchResponse = { totalItems?: unknown; items?: GoogleVolume[] };

export type BookMetadata = {
  googleBooksId: string;
  title: string;
  subtitle: string | null;
  authors: string[];
  description: string;
  publisher: string | null;
  publishedDate: string | null;
  pageCount: number | null;
  coverUrl: string | null;
  language: string | null;
  categories: string[];
  isbn10: string | null;
  isbn13: string | null;
};

export type BookSearchResult = {
  page: number;
  totalPages: number;
  totalResults: number;
  results: BookMetadata[];
};

function text(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null;
  const cleaned = value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return cleaned ? cleaned.slice(0, maxLength) : null;
}

function textList(value: unknown, maxItems: number, maxLength: number): string[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, maxItems).map((item) => text(item, maxLength)).filter((item): item is string => Boolean(item));
}

function normalizeIsbn(value: unknown, expectedLength: 10 | 13): string | null {
  if (typeof value !== 'string') return null;
  const isbn = value.replace(/[^0-9x]/gi, '').toUpperCase();
  if (expectedLength === 10) {
    if (!/^\d{9}[\dX]$/.test(isbn)) return null;
    const sum = [...isbn].reduce((total, digit, index) => total + (digit === 'X' ? 10 : Number(digit)) * (10 - index), 0);
    return sum % 11 === 0 ? isbn : null;
  }
  if (!/^\d{13}$/.test(isbn)) return null;
  const sum = [...isbn.slice(0, 12)].reduce((total, digit, index) => total + Number(digit) * (index % 2 === 0 ? 1 : 3), 0);
  return (10 - (sum % 10)) % 10 === Number(isbn[12]) ? isbn : null;
}

function safeCoverUrl(value: unknown): string | null {
  if (typeof value !== 'string' || value.length > 2048) return null;
  try {
    const url = new URL(value.startsWith('http://') ? `https://${value.slice(7)}` : value);
    const host = url.hostname.toLowerCase();
    if (url.protocol !== 'https:' || !(host === 'google.com' || host.endsWith('.google.com') || host === 'googleusercontent.com' || host.endsWith('.googleusercontent.com'))) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function normalizeGoogleVolume(volume: GoogleVolume): BookMetadata | null {
  const googleBooksId = text(volume.id, 128);
  const info = volume.volumeInfo;
  const title = text(info?.title, 500);
  if (!googleBooksId || !title) return null;

  const identifiers = Array.isArray(info?.industryIdentifiers) ? info.industryIdentifiers : [];
  const isbn10 = identifiers.find((entry) => entry.type === 'ISBN_10');
  const isbn13 = identifiers.find((entry) => entry.type === 'ISBN_13');
  const images = info?.imageLinks;

  return {
    googleBooksId,
    title,
    subtitle: text(info?.subtitle, 500),
    authors: textList(info?.authors, 12, 160),
    description: text(info?.description, 20_000) ?? '',
    publisher: text(info?.publisher, 300),
    publishedDate: text(info?.publishedDate, 32),
    pageCount: typeof info?.pageCount === 'number' && Number.isInteger(info.pageCount) && info.pageCount > 0 && info.pageCount <= 100_000 ? info.pageCount : null,
    coverUrl: safeCoverUrl(images?.thumbnail) ?? safeCoverUrl(images?.smallThumbnail),
    language: text(info?.language, 16),
    categories: textList(info?.categories, 20, 160),
    isbn10: normalizeIsbn(isbn10?.identifier, 10),
    isbn13: normalizeIsbn(isbn13?.identifier, 13),
  };
}

async function requestGoogleBooks<T>(params: Record<string, string>, volumeId?: string): Promise<T> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY?.trim();
  if (!apiKey) throw new Error('BOOKS_NOT_CONFIGURED');

  const url = new URL(volumeId ? `${GOOGLE_BOOKS_API}/${encodeURIComponent(volumeId)}` : GOOGLE_BOOKS_API);
  for (const [key, value] of Object.entries({ ...params, key: apiKey })) url.searchParams.set(key, value);
  let response: Response;
  try {
    response = await fetch(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(8000) });
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') throw error;
    throw new Error('BOOKS_UNAVAILABLE');
  }

  if (response.status === 404) throw new Error('BOOKS_NOT_FOUND');
  if (response.status === 429 || response.status === 403) throw new Error('BOOKS_RATE_LIMITED');
  if (!response.ok) throw new Error('BOOKS_UNAVAILABLE');
  try {
    return await response.json() as T;
  } catch {
    throw new Error('BOOKS_INVALID_RESPONSE');
  }
}

export function searchGoogleBooks(query: string, page: number): Promise<BookSearchResult> {
  const normalizedQuery = query.trim().replace(/\s+/g, ' ');
  const cacheKey = `google-books:search:${page}:${normalizedQuery.toLocaleLowerCase('pt-BR')}`;
  return cache.getOrLoad(cacheKey, BOOKS_SEARCH_TTL_MS, async () => {
    const startIndex = (page - 1) * BOOKS_PAGE_SIZE;
    const data = await requestGoogleBooks<GoogleSearchResponse>({
      q: normalizedQuery,
      printType: 'books',
      projection: 'lite',
      maxResults: String(BOOKS_PAGE_SIZE),
      startIndex: String(startIndex),
    });
    const totalResults = typeof data.totalItems === 'number' && Number.isFinite(data.totalItems) ? Math.max(0, data.totalItems) : 0;
    const results = (Array.isArray(data.items) ? data.items : [])
      .map(normalizeGoogleVolume)
      .filter((book): book is BookMetadata => book !== null)
      .map((book) => ({ ...book, description: '' }));
    return { page, totalPages: Math.ceil(totalResults / BOOKS_PAGE_SIZE), totalResults, results };
  });
}

export function getGoogleBook(volumeId: string): Promise<BookMetadata> {
  return cache.getOrLoad(`google-books:volume:${volumeId}`, BOOK_DETAILS_TTL_MS, async () => {
    const detail = await requestGoogleBooks<GoogleVolume>({}, volumeId);
    const normalized = normalizeGoogleVolume(detail);
    if (!normalized) throw new Error('BOOKS_NOT_FOUND');
    return normalized;
  });
}

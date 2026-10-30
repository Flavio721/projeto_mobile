import type { Response } from 'express';
import { BookReadingStatus } from '../../generated/prisma/enums.js';
import { cache } from '../lib/cache.js';
import { prisma } from '../lib/prisma.js';
import type { AuthRequest } from '../middlewares/authMiddleware.js';
import { getGoogleBook, searchGoogleBooks } from '../services/googleBooksService.js';

const BOOKS_CACHE_TTL_MS = 30 * 1000;
const BOOKS_STATS_TTL_MS = 60 * 1000;
const BOOKS_PAGE_SIZE = 20;
const booksCacheTag = (userId: string) => `user-books:${userId}`;

type PersonalFields = {
  status?: BookReadingStatus;
  isFavorite?: boolean;
  rating?: number | null;
  comment?: string | null;
  startedAt?: string | null;
  finishedAt?: string | null;
};

function providerError(res: Response, error: unknown) {
  const code = error instanceof Error ? error.message : '';
  if (code === 'BOOKS_NOT_CONFIGURED') return res.status(503).json({ error: 'A busca de livros ainda não foi configurada no servidor.' });
  if (code === 'BOOKS_NOT_FOUND') return res.status(404).json({ error: 'Livro não encontrado no Google Books.' });
  if (code === 'BOOKS_RATE_LIMITED') return res.status(503).json({ error: 'O catálogo de livros está temporariamente indisponível. Tente novamente mais tarde.' });
  if (code === 'BOOKS_UNAVAILABLE' || code === 'BOOKS_INVALID_RESPONSE') return res.status(502).json({ error: 'Não foi possível consultar o catálogo de livros.' });
  if (error instanceof Error && error.name === 'TimeoutError') return res.status(504).json({ error: 'A busca de livros demorou demais. Tente novamente.' });
  console.error('Erro na API de livros:', error);
  return res.status(500).json({ error: 'Erro interno ao consultar livros.' });
}

function positiveInteger(value: unknown, fallback: number, max: number): number | null {
  if (value === undefined) return fallback;
  if (typeof value !== 'string' || !/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= 1 && parsed <= max ? parsed : null;
}

function isObjectBody(body: unknown): body is Record<string, unknown> {
  return Boolean(body) && typeof body === 'object' && !Array.isArray(body);
}

function validatePersonalFields(body: Record<string, unknown>, requireAnyField = false): { value?: PersonalFields; error?: string } {
  const allowed = new Set(['status', 'isFavorite', 'rating', 'comment', 'startedAt', 'finishedAt']);
  if (Object.keys(body).some((key) => !allowed.has(key))) return { error: 'O registro contém campos não permitidos.' };
  if (requireAnyField && Object.keys(body).length === 0) return { error: 'Informe ao menos um campo para atualizar.' };
  if (body.status !== undefined && !Object.values(BookReadingStatus).includes(body.status as BookReadingStatus)) {
    return { error: 'Status inválido.' };
  }
  if (body.isFavorite !== undefined && typeof body.isFavorite !== 'boolean') return { error: 'isFavorite deve ser true ou false.' };
  if (body.rating !== undefined && body.rating !== null && (!Number.isInteger(body.rating) || (body.rating as number) < 1 || (body.rating as number) > 5)) {
    return { error: 'A nota deve ser um número inteiro de 1 a 5.' };
  }
  if (body.comment !== undefined && body.comment !== null && (typeof body.comment !== 'string' || body.comment.length > 5000)) {
    return { error: 'O comentário deve ter até 5000 caracteres.' };
  }
  for (const field of ['startedAt', 'finishedAt'] as const) {
    const date = body[field];
    if (date !== undefined && date !== null && (typeof date !== 'string' || Number.isNaN(Date.parse(date)))) {
      return { error: `A data ${field === 'startedAt' ? 'de início' : 'de conclusão'} é inválida.` };
    }
  }
  return { value: body as PersonalFields };
}

function serializeUserBook(entry: {
  id: number;
  status: BookReadingStatus;
  isFavorite: boolean;
  rating: number | null;
  comment: string | null;
  startedAt: Date | null;
  finishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  book: {
    id: number;
    googleBooksId: string;
    title: string;
    subtitle: string | null;
    authors: string[];
    description?: string;
    publisher: string | null;
    publishedDate: string | null;
    isbn10: string | null;
    isbn13: string | null;
    pageCount: number | null;
    coverUrl: string | null;
    language: string | null;
    categories: string[];
  };
}) {
  return {
    ...entry.book,
    description: entry.book.description ?? '',
    libraryId: entry.id,
    status: entry.status,
    isFavorite: entry.isFavorite,
    rating: entry.rating,
    comment: entry.comment,
    startedAt: entry.startedAt?.toISOString() ?? null,
    finishedAt: entry.finishedAt?.toISOString() ?? null,
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  };
}

function catalogMatchConditions(metadata: Awaited<ReturnType<typeof getGoogleBook>>) {
  return [
    { googleBooksId: metadata.googleBooksId },
    ...(metadata.isbn10 ? [{ isbn10: metadata.isbn10 }] : []),
    ...(metadata.isbn13 ? [{ isbn13: metadata.isbn13 }] : []),
  ];
}

async function persistCatalogBook(metadata: Awaited<ReturnType<typeof getGoogleBook>>) {
  const conditions = catalogMatchConditions(metadata);
  const updateCatalogMatch = async (existing: Awaited<ReturnType<typeof prisma.book.findFirst>>) => {
    if (!existing) throw new Error('BOOK_CATALOG_MATCH_MISSING');
    const [isbn10Owner, isbn13Owner] = await Promise.all([
      metadata.isbn10 ? prisma.book.findUnique({ where: { isbn10: metadata.isbn10 }, select: { id: true } }) : null,
      metadata.isbn13 ? prisma.book.findUnique({ where: { isbn13: metadata.isbn13 }, select: { id: true } }) : null,
    ]);
    return prisma.book.update({
      where: { id: existing.id },
      data: {
        ...metadata,
        googleBooksId: existing.googleBooksId,
        isbn10: existing.isbn10 ?? (isbn10Owner && isbn10Owner.id !== existing.id ? null : metadata.isbn10),
        isbn13: existing.isbn13 ?? (isbn13Owner && isbn13Owner.id !== existing.id ? null : metadata.isbn13),
      },
    });
  };
  const existing = await prisma.book.findFirst({ where: { OR: conditions } });
  if (existing) return updateCatalogMatch(existing);
  try {
    return await prisma.book.create({ data: metadata });
  } catch (error) {
    // Two requests can add the same ISBN at the same time. Unique indexes are
    // the source of truth; re-read the winning catalog record after the race.
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      const racedBook = await prisma.book.findFirst({ where: { OR: conditions } });
      if (racedBook) return updateCatalogMatch(racedBook);
    }
    throw error;
  }
}

export async function searchBooks(req: AuthRequest, res: Response) {
  const query = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  const page = positiveInteger(req.query.page, 1, 100);
  if (query.length < 2) return res.status(400).json({ error: 'Digite ao menos 2 caracteres para pesquisar.' });
  if (query.length > 100) return res.status(400).json({ error: 'A pesquisa deve ter até 100 caracteres.' });
  if (page === null) return res.status(400).json({ error: 'Página inválida.' });

  try {
    const result = await searchGoogleBooks(query, page);
    if (result.results.length === 0) return res.json(result);
    const conditions = result.results.flatMap(catalogMatchConditions);
    const existing = await prisma.userBook.findMany({
      where: { userId: req.userId!, book: { OR: conditions } },
      select: { book: { select: { googleBooksId: true, isbn10: true, isbn13: true } } },
    });
    const idsInLibrary = new Set(existing.flatMap(({ book }) => [book.googleBooksId, book.isbn10, book.isbn13].filter((id): id is string => Boolean(id))));
    return res.json({
      ...result,
      results: result.results.map((book) => ({
        ...book,
        inLibrary: idsInLibrary.has(book.googleBooksId) || Boolean(book.isbn10 && idsInLibrary.has(book.isbn10)) || Boolean(book.isbn13 && idsInLibrary.has(book.isbn13)),
      })),
    });
  } catch (error) {
    return providerError(res, error);
  }
}

export async function getBooks(req: AuthRequest, res: Response) {
  const page = positiveInteger(req.query.page, 1, 100_000);
  const pageSize = positiveInteger(req.query.pageSize, BOOKS_PAGE_SIZE, 50);
  const status = req.query.status;
  const isFavorite = req.query.isFavorite;
  if (page === null || pageSize === null) return res.status(400).json({ error: 'Paginação inválida.' });
  if (status !== undefined && (typeof status !== 'string' || !Object.values(BookReadingStatus).includes(status as BookReadingStatus))) {
    return res.status(400).json({ error: 'Status inválido.' });
  }
  if (isFavorite !== undefined && isFavorite !== 'true' && isFavorite !== 'false') return res.status(400).json({ error: 'Filtro de favorito inválido.' });

  const userId = req.userId!;
  const key = `user:${userId}:books:${status ?? 'all'}:${isFavorite ?? 'all'}:${page}:${pageSize}`;
  try {
    const result = await cache.getOrLoad(key, BOOKS_CACHE_TTL_MS, async () => {
      const where = {
        userId,
        ...(status ? { status: status as BookReadingStatus } : {}),
        ...(isFavorite ? { isFavorite: isFavorite === 'true' } : {}),
      };
      const [total, entries] = await Promise.all([
        prisma.userBook.count({ where }),
        prisma.userBook.findMany({
          where,
          select: {
            id: true, status: true, isFavorite: true, rating: true, comment: true,
            startedAt: true, finishedAt: true, createdAt: true, updatedAt: true,
            book: {
              select: {
                id: true, googleBooksId: true, title: true, subtitle: true, authors: true,
                publisher: true, publishedDate: true, isbn10: true, isbn13: true,
                pageCount: true, coverUrl: true, language: true, categories: true,
              },
            },
          },
          orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
      ]);
      return { page, pageSize, total, totalPages: Math.ceil(total / pageSize), results: entries.map(serializeUserBook) };
    }, [booksCacheTag(userId)]);
    return res.json(result);
  } catch (error) {
    console.error('Erro ao carregar biblioteca de livros:', error);
    return res.status(500).json({ error: 'Não foi possível carregar sua biblioteca.' });
  }
}

export async function getBookStats(req: AuthRequest, res: Response) {
  const userId = req.userId!;
  try {
    const result = await cache.getOrLoad(`user:${userId}:books:stats`, BOOKS_STATS_TTL_MS, async () => {
      const groups = await prisma.userBook.groupBy({ by: ['status', 'isFavorite'], where: { userId }, _count: { _all: true } });
      const countFor = (status: BookReadingStatus) => groups.reduce((total, row) => total + (row.status === status ? row._count._all : 0), 0);
      return {
        total: groups.reduce((total, row) => total + row._count._all, 0),
        wantToRead: countFor(BookReadingStatus.WANT_TO_READ),
        reading: countFor(BookReadingStatus.READING),
        read: countFor(BookReadingStatus.READ),
        paused: countFor(BookReadingStatus.PAUSED),
        favorites: groups.reduce((total, row) => total + (row.isFavorite ? row._count._all : 0), 0),
      };
    }, [booksCacheTag(userId)]);
    return res.json(result);
  } catch (error) {
    console.error('Erro ao carregar estatísticas de livros:', error);
    return res.status(500).json({ error: 'Não foi possível carregar as estatísticas da biblioteca.' });
  }
}

export async function addBook(req: AuthRequest, res: Response) {
  const googleBooksId = req.params.googleBooksId;
  if (typeof googleBooksId !== 'string' || !/^[A-Za-z0-9_-]{1,128}$/.test(googleBooksId)) {
    return res.status(400).json({ error: 'Identificador do Google Books inválido.' });
  }
  if (!isObjectBody(req.body)) return res.status(400).json({ error: 'Envie os dados pessoais do livro.' });
  const validation = validatePersonalFields(req.body);
  if (validation.error) return res.status(400).json({ error: validation.error });
  const body = validation.value!;
  const userId = req.userId!;

  try {
    const metadata = await getGoogleBook(googleBooksId);
    if (metadata.googleBooksId !== googleBooksId) return res.status(502).json({ error: 'O catálogo retornou um livro inconsistente.' });
    const book = await persistCatalogBook(metadata);
    const personalData = {
      ...(body.status !== undefined ? { status: body.status } : {}),
      ...(body.isFavorite !== undefined ? { isFavorite: body.isFavorite } : {}),
      ...(body.rating !== undefined ? { rating: body.rating } : {}),
      ...(body.comment !== undefined ? { comment: body.comment?.trim() || null } : {}),
      ...(body.startedAt !== undefined ? { startedAt: body.startedAt ? new Date(body.startedAt) : null } : {}),
      ...(body.finishedAt !== undefined ? { finishedAt: body.finishedAt ? new Date(body.finishedAt) : null } : {}),
    };
    const relation = { userId_bookId: { userId, bookId: book.id } };
    let entry = await prisma.userBook.findUnique({ where: relation, include: { book: true } });
    if (entry) {
      if (Object.keys(personalData).length > 0) {
        entry = await prisma.userBook.update({ where: relation, data: personalData, include: { book: true } });
      }
    } else {
      try {
        entry = await prisma.userBook.create({
          data: { userId, bookId: book.id, status: body.status ?? BookReadingStatus.WANT_TO_READ, ...personalData },
          include: { book: true },
        });
      } catch (error) {
        // Concurrent add requests can race on the user/book unique index.
        if (!(error && typeof error === 'object' && 'code' in error && error.code === 'P2002')) throw error;
        entry = await prisma.userBook.findUnique({ where: relation, include: { book: true } });
        if (!entry) throw error;
        if (Object.keys(personalData).length > 0) {
          entry = await prisma.userBook.update({ where: relation, data: personalData, include: { book: true } });
        }
      }
    }
    if (!entry) throw new Error('BOOK_ENTRY_CREATE_FAILED');
    cache.invalidateTag(booksCacheTag(userId));
    return res.status(200).json(serializeUserBook(entry));
  } catch (error) {
    return providerError(res, error);
  }
}

export async function updateBook(req: AuthRequest, res: Response) {
  const bookId = positiveInteger(req.params.bookId, 0, Number.MAX_SAFE_INTEGER);
  if (bookId === null || bookId < 1) return res.status(400).json({ error: 'Identificador do livro inválido.' });
  if (!isObjectBody(req.body)) return res.status(400).json({ error: 'Envie os campos do registro pessoal.' });
  const validation = validatePersonalFields(req.body, true);
  if (validation.error) return res.status(400).json({ error: validation.error });
  const body = validation.value!;
  const userId = req.userId!;

  try {
    const entry = await prisma.userBook.update({
      where: { userId_bookId: { userId, bookId } },
      data: {
        ...(body.status !== undefined ? { status: body.status } : {}),
        ...(body.isFavorite !== undefined ? { isFavorite: body.isFavorite } : {}),
        ...(body.rating !== undefined ? { rating: body.rating } : {}),
        ...(body.comment !== undefined ? { comment: body.comment?.trim() || null } : {}),
        ...(body.startedAt !== undefined ? { startedAt: body.startedAt ? new Date(body.startedAt) : null } : {}),
        ...(body.finishedAt !== undefined ? { finishedAt: body.finishedAt ? new Date(body.finishedAt) : null } : {}),
      },
      include: { book: true },
    });
    cache.invalidateTag(booksCacheTag(userId));
    return res.json(serializeUserBook(entry));
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return res.status(404).json({ error: 'Esse livro não está na sua biblioteca.' });
    }
    console.error('Erro ao atualizar livro da biblioteca:', error);
    return res.status(500).json({ error: 'Não foi possível atualizar o livro.' });
  }
}

export async function removeBook(req: AuthRequest, res: Response) {
  const bookId = positiveInteger(req.params.bookId, 0, Number.MAX_SAFE_INTEGER);
  if (bookId === null || bookId < 1) return res.status(400).json({ error: 'Identificador do livro inválido.' });
  const userId = req.userId!;
  try {
    await prisma.userBook.deleteMany({ where: { userId, bookId } });
    cache.invalidateTag(booksCacheTag(userId));
    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao remover livro da biblioteca:', error);
    return res.status(500).json({ error: 'Não foi possível remover o livro.' });
  }
}

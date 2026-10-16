const TMDB_API_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export interface TmdbMovie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
  overview?: string;
  vote_average?: number;
  runtime?: number | null;
  genres?: Array<{ id: number; name: string }>;
}

export interface TmdbSearchResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: TmdbMovie[];
}

const movieTranslationCache = new Map<string, { expiresAt: number; movie: TmdbMovie }>();
const movieTranslationRequests = new Map<string, Promise<TmdbMovie>>();
const TRANSLATION_CACHE_TTL_MS = 12 * 60 * 60 * 1000;

export function posterUrl(path: string | null | undefined): string | undefined {
  return path ? `${TMDB_IMAGE_BASE}${path}` : undefined;
}

async function request<T>(path: string): Promise<T> {
  const token = process.env.TMDB_READ_ACCESS_TOKEN;
  if (!token) {
    throw new Error('TMDB_NOT_CONFIGURED');
  }

  const response = await fetch(`${TMDB_API_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    if (response.status === 404) throw new Error('TMDB_NOT_FOUND');
    if (response.status === 429) throw new Error('TMDB_RATE_LIMITED');
    throw new Error('TMDB_UNAVAILABLE');
  }

  return response.json() as Promise<T>;
}

export async function searchTmdbMovies(query: string, page: number, language = 'pt-BR') {
  const params = new URLSearchParams({ query, language, page: String(page) });
  return request<TmdbSearchResponse>(`/search/movie?${params.toString()}`);
}

export async function getPopularTmdbMovies(language: string, page = 1) {
  const params = new URLSearchParams({
    language,
    page: String(page),
    include_adult: 'false',
    include_video: 'false',
    sort_by: 'vote_average.desc',
    'vote_count.gte': '300',
  });
  return request<TmdbSearchResponse>(`/discover/movie?${params.toString()}`);
}

export async function getTmdbMovie(tmdbId: number, language = 'pt-BR') {
  const params = new URLSearchParams({ language });
  return request<TmdbMovie>(`/movie/${tmdbId}?${params.toString()}`);
}

/** Cache localized catalog metadata so library screens do not call TMDB again
 * every time the user switches tabs. The cache is shared across app users on
 * this backend instance, keyed by TMDB id and language. */
export async function getLocalizedTmdbMovie(tmdbId: number, language: string) {
  const key = `${tmdbId}:${language}`;
  const cached = movieTranslationCache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.movie;
  if (cached) movieTranslationCache.delete(key);

  const pending = movieTranslationRequests.get(key);
  if (pending) return pending;

  const requestPromise = getTmdbMovie(tmdbId, language).then((movie) => {
    if (movieTranslationCache.size >= 1000) movieTranslationCache.delete(movieTranslationCache.keys().next().value!);
    movieTranslationCache.set(key, { movie, expiresAt: Date.now() + TRANSLATION_CACHE_TTL_MS });
    return movie;
  }).finally(() => movieTranslationRequests.delete(key));
  movieTranslationRequests.set(key, requestPromise);
  return requestPromise;
}

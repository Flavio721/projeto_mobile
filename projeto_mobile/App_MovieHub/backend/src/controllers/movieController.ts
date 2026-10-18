import type { Response } from 'express';
import { prisma } from '../lib/prisma.js';
import type { AuthRequest } from '../middlewares/authMiddleware.js';
import { MovieStatus } from '../../generated/prisma/enums.js';
import { getLocalizedTmdbMovie, getPopularTmdbMovies, getTmdbMovie, posterUrl, searchTmdbMovies, type TmdbMovie } from '../services/tmdbService.js';

type PersonalFields = {
  status?: MovieStatus;
  isFavorite?: boolean;
  rating?: number | null;
  comment?: string | null;
  watchedAt?: string | null;
};

function tmdbError(res: Response, error: unknown) {
  const code = error instanceof Error ? error.message : '';
  if (code === 'TMDB_NOT_CONFIGURED') return res.status(503).json({ error: 'A busca de filmes ainda não foi configurada no servidor.' });
  if (code === 'TMDB_NOT_FOUND') return res.status(404).json({ error: 'Filme não encontrado no catálogo.' });
  if (code === 'TMDB_RATE_LIMITED') return res.status(503).json({ error: 'O catálogo está recebendo muitas solicitações. Tente novamente em instantes.' });
  if (code === 'TMDB_UNAVAILABLE') return res.status(502).json({ error: 'Não foi possível consultar o catálogo de filmes.' });
  if (error instanceof Error && error.name === 'TimeoutError') return res.status(504).json({ error: 'A busca demorou demais. Tente novamente.' });
  console.error('Erro na API de filmes:', error);
  return res.status(500).json({ error: 'Erro interno ao consultar filmes.' });
}

function tmdbIdFromRequest(value: string | string[] | undefined): number | null {
  if (typeof value !== 'string' || !/^\d+$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function tmdbLanguageFromRequest(value: unknown): string | null {
  const language = value === undefined ? 'pt-BR' : value;
  return typeof language === 'string' && ['pt-BR', 'en-US', 'es-ES'].includes(language) ? language : null;
}

function serializeTmdb(movie: TmdbMovie) {
  return {
    id: String(movie.id),
    tmdbId: movie.id,
    title: movie.title,
    coverUrl: posterUrl(movie.poster_path),
    releaseYear: movie.release_date ? Number(movie.release_date.slice(0, 4)) || null : null,
    duration: movie.runtime ?? null,
    director: undefined,
    description: movie.overview ?? '',
    tmdbRating: movie.vote_average ?? null,
    rating: null,
    status: null,
    isFavorite: false,
    genres: movie.genres?.map((genre) => ({ name: genre.name })) ?? [],
    comment: null,
    watchedAt: null,
    inLibrary: false,
  };
}

function serializeEntry(entry: {
  status: MovieStatus;
  isFavorite: boolean;
  rating: number | null;
  comment: string | null;
  watchedAt: Date | null;
  movie: {
    tmdbId: number;
    title: string;
    posterPath: string | null;
    releaseDate: string | null;
    overview: string;
    runtime: number | null;
    genres: string[];
    voteAverage: number | null;
  };
}, localizedMovie?: TmdbMovie) {
  const movie = entry.movie;
  const title = localizedMovie?.title || movie.title;
  const posterPath = localizedMovie?.poster_path || movie.posterPath;
  const releaseDate = localizedMovie?.release_date || movie.releaseDate;
  const description = localizedMovie?.overview ?? movie.overview;
  const genres = localizedMovie?.genres?.map((genre) => genre.name) ?? movie.genres;
  return {
    id: String(movie.tmdbId),
    tmdbId: movie.tmdbId,
    title,
    coverUrl: posterUrl(posterPath),
    releaseYear: releaseDate ? Number(releaseDate.slice(0, 4)) || null : null,
    duration: localizedMovie?.runtime ?? movie.runtime,
    director: undefined,
    description,
    tmdbRating: localizedMovie?.vote_average ?? movie.voteAverage,
    rating: entry.rating,
    status: entry.status,
    isFavorite: entry.isFavorite,
    genres: genres.map((name) => ({ name })),
    comment: entry.comment,
    watchedAt: entry.watchedAt?.toISOString() ?? null,
    inLibrary: true,
  };
}

async function serializeEntriesInLanguage(entries: Parameters<typeof serializeEntry>[0][], language: string) {
  const results: ReturnType<typeof serializeEntry>[] = new Array(entries.length);
  let nextIndex = 0;
  const workerCount = Math.min(4, entries.length);
  await Promise.all(Array.from({ length: workerCount }, async () => {
    while (nextIndex < entries.length) {
      const index = nextIndex++;
      const entry = entries[index]!;
      try {
        const localizedMovie = await getLocalizedTmdbMovie(entry.movie.tmdbId, language);
        results[index] = serializeEntry(entry, localizedMovie);
      } catch {
        // Preserve access to a user's library when TMDB is temporarily down.
        results[index] = serializeEntry(entry);
      }
    }
  }));
  return results;
}

function validatePersonalFields(body: PersonalFields): string | null {
  if (body.status !== undefined && !Object.values(MovieStatus).includes(body.status)) {
    return 'Status inválido. Use WATCHED ou WATCHLIST.';
  }
  if (body.isFavorite !== undefined && typeof body.isFavorite !== 'boolean') {
    return 'isFavorite deve ser true ou false.';
  }
  if (body.rating !== undefined && body.rating !== null && (!Number.isInteger(body.rating) || body.rating < 1 || body.rating > 5)) {
    return 'A nota deve ser um número inteiro entre 1 e 5.';
  }
  if (body.comment !== undefined && body.comment !== null && (typeof body.comment !== 'string' || body.comment.length > 5000)) {
    return 'O comentário deve ter até 5000 caracteres.';
  }
  if (body.watchedAt !== undefined && body.watchedAt !== null && (typeof body.watchedAt !== 'string' || Number.isNaN(Date.parse(body.watchedAt)))) {
    return 'A data em que assistiu é inválida.';
  }

  const status = body.status;
  const watchedAt = body.watchedAt;
  if (status === MovieStatus.WATCHED && (watchedAt === undefined || watchedAt === null)) {
    return 'Informe a data em que assistiu ao filme.';
  }
  if (status === MovieStatus.WATCHLIST && watchedAt) {
    return 'Um filme na watchlist não pode ter data de exibição.';
  }
  return null;
}

async function cacheTmdbMovie(movie: TmdbMovie) {
  return prisma.movie.upsert({
    where: { tmdbId: movie.id },
    create: {
      tmdbId: movie.id,
      title: movie.title,
      posterPath: movie.poster_path,
      releaseDate: movie.release_date || null,
      overview: movie.overview ?? '',
      runtime: movie.runtime ?? null,
      genres: movie.genres?.map((genre) => genre.name) ?? [],
      voteAverage: movie.vote_average ?? null,
    },
    update: {
      title: movie.title,
      posterPath: movie.poster_path,
      releaseDate: movie.release_date || null,
      overview: movie.overview ?? '',
      runtime: movie.runtime ?? null,
      genres: movie.genres?.map((genre) => genre.name) ?? [],
      voteAverage: movie.vote_average ?? null,
    },
  });
}

export async function searchMovies(req: AuthRequest, res: Response) {
  const query = typeof req.query.query === 'string' ? req.query.query.trim() : '';
  const page = typeof req.query.page === 'string' ? Number(req.query.page) : 1;
  const language = tmdbLanguageFromRequest(req.query.language);
  if (!query) return res.status(400).json({ error: 'Digite o nome de um filme para pesquisar.' });
  if (query.length > 100) return res.status(400).json({ error: 'A pesquisa deve ter até 100 caracteres.' });
  if (!Number.isInteger(page) || page < 1 || page > 500) return res.status(400).json({ error: 'Página inválida.' });
  if (!language) return res.status(400).json({ error: 'Idioma inválido.' });

  try {
    const response = await searchTmdbMovies(query, page, language);
    return res.json({
      page: response.page,
      totalPages: response.total_pages,
      totalResults: response.total_results,
      results: response.results.map(serializeTmdb),
    });
  } catch (error) {
    return tmdbError(res, error);
  }
}

export async function getPopularMovies(req: AuthRequest, res: Response) {
  const language = typeof req.query.language === 'string' ? req.query.language : 'pt-BR';
  if (!['pt-BR', 'en-US', 'es-ES'].includes(language)) {
    return res.status(400).json({ error: 'Idioma inválido.' });
  }
  try {
    const watched = await prisma.userMovie.findMany({
      where: { userId: req.userId!, status: MovieStatus.WATCHED },
      select: { movie: { select: { tmdbId: true } } },
    });
    const watchedIds = new Set(watched.map(({ movie }) => movie.tmdbId));
    const results: TmdbMovie[] = [];
    // Read at most three pages so users with a large watched list still get
    // useful recommendations without turning a Home request into a long scan.
    for (let page = 1; page <= 3 && results.length < 12; page += 1) {
      const response = await getPopularTmdbMovies(language, page);
      results.push(...response.results.filter((movie) => !watchedIds.has(movie.id)));
      if (page >= response.total_pages) break;
    }
    return res.json({ results: results.slice(0, 12).map(serializeTmdb) });
  } catch (error) {
    return tmdbError(res, error);
  }
}

export async function getCatalogMovie(req: AuthRequest, res: Response) {
  const tmdbId = tmdbIdFromRequest(req.params.tmdbId);
  const language = tmdbLanguageFromRequest(req.query.language);
  if (!tmdbId) return res.status(400).json({ error: 'Id TMDB inválido.' });
  if (!language) return res.status(400).json({ error: 'Idioma inválido.' });
  try {
    const [movie, entry] = await Promise.all([
      getTmdbMovie(tmdbId, language),
      prisma.userMovie.findFirst({
        where: { userId: req.userId!, movie: { tmdbId } },
        include: { movie: true },
      }),
    ]);
    const catalog = serializeTmdb(movie);
    return res.json(entry ? serializeEntry(entry, movie) : catalog);
  } catch (error) {
    return tmdbError(res, error);
  }
}

export async function getLibraryEntry(req: AuthRequest, res: Response) {
  const tmdbId = tmdbIdFromRequest(req.params.tmdbId);
  const language = tmdbLanguageFromRequest(req.query.language);
  if (!tmdbId) return res.status(400).json({ error: 'Id TMDB inválido.' });
  if (!language) return res.status(400).json({ error: 'Idioma inválido.' });
  const entry = await prisma.userMovie.findFirst({
    where: { userId: req.userId!, movie: { tmdbId } },
    include: { movie: true },
  });
  if (!entry) return res.status(404).json({ error: 'Este filme ainda não está na sua lista.' });
  try {
    return res.json(serializeEntry(entry, await getLocalizedTmdbMovie(tmdbId, language)));
  } catch {
    return res.json(serializeEntry(entry));
  }
}

export async function getMovies(req: AuthRequest, res: Response) {
  const language = tmdbLanguageFromRequest(req.query.language);
  if (!language) return res.status(400).json({ error: 'Idioma inválido.' });
  const entries = await prisma.userMovie.findMany({
    where: { userId: req.userId! },
    include: { movie: true },
    orderBy: { updatedAt: 'desc' },
  });
  return res.json(await serializeEntriesInLanguage(entries, language));
}

export async function getGenreCounts(req: AuthRequest, res: Response) {
  const language = tmdbLanguageFromRequest(req.query.language);
  if (!language) return res.status(400).json({ error: 'Idioma inválido.' });
  try {
    const entries = await prisma.userMovie.findMany({
      where: { userId: req.userId! },
      select: { movie: { select: { tmdbId: true, genres: true } } },
    });
    const counts = new Map<string, number>();
    let nextIndex = 0;
    const localizedGenres: string[][] = new Array(entries.length);
    const workerCount = Math.min(4, entries.length);
    await Promise.all(Array.from({ length: workerCount }, async () => {
      while (nextIndex < entries.length) {
        const index = nextIndex++;
        const { movie } = entries[index]!;
        try {
          const translated = await getLocalizedTmdbMovie(movie.tmdbId, language);
          localizedGenres[index] = translated.genres?.map(({ name }) => name) ?? movie.genres;
        } catch {
          localizedGenres[index] = movie.genres;
        }
      }
    }));
    for (const genres of localizedGenres) {
      // A movie contributes once to each genre, even if metadata contains a duplicate.
      for (const genre of new Set(genres.map((name) => name.trim()).filter(Boolean))) {
        counts.set(genre, (counts.get(genre) ?? 0) + 1);
      }
    }
    const results = [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    return res.json({ results });
  } catch (error) {
    console.error('Erro ao contar gêneros da biblioteca:', error);
    return res.status(500).json({ error: 'Não foi possível carregar os gêneros da sua lista.' });
  }
}

export async function getStats(req: AuthRequest, res: Response) {
  const userId = req.userId!;
  const groups = await prisma.userMovie.groupBy({
    by: ['status', 'isFavorite'],
    where: { userId },
    _count: { _all: true },
  });
  const total = groups.reduce((sum, group) => sum + group._count._all, 0);
  const assistidos = groups.reduce((sum, group) => sum + (group.status === MovieStatus.WATCHED ? group._count._all : 0), 0);
  const queroAssistir = groups.reduce((sum, group) => sum + (group.status === MovieStatus.WATCHLIST ? group._count._all : 0), 0);
  const favoritos = groups.reduce((sum, group) => sum + (group.isFavorite ? group._count._all : 0), 0);
  return res.json({ total, assistidos, queroAssistir, favoritos });
}

export async function saveLibraryEntry(req: AuthRequest, res: Response) {
  const tmdbId = tmdbIdFromRequest(req.params.tmdbId);
  const language = tmdbLanguageFromRequest(req.query.language);
  if (!tmdbId) return res.status(400).json({ error: 'Id TMDB inválido.' });
  if (!language) return res.status(400).json({ error: 'Idioma inválido.' });
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ error: 'Envie os dados do registro pessoal.' });
  }
  const body = req.body as PersonalFields;
  const validationError = validatePersonalFields(body);
  if (validationError) return res.status(400).json({ error: validationError });
  if (body.status === undefined) return res.status(400).json({ error: 'Informe o status do filme.' });

  try {
    const tmdbMovie = await getTmdbMovie(tmdbId, language);
    const movie = await cacheTmdbMovie(tmdbMovie);
    const entry = await prisma.userMovie.upsert({
      where: { userId_movieId: { userId: req.userId!, movieId: movie.id } },
      create: {
        userId: req.userId!,
        movieId: movie.id,
        status: body.status,
        isFavorite: body.isFavorite ?? false,
        rating: body.rating ?? null,
        comment: body.comment?.trim() || null,
        watchedAt: body.status === MovieStatus.WATCHED ? new Date(body.watchedAt!) : null,
      },
      update: {
        status: body.status,
        isFavorite: body.isFavorite ?? false,
        rating: body.rating ?? null,
        comment: body.comment?.trim() || null,
        watchedAt: body.status === MovieStatus.WATCHED ? new Date(body.watchedAt!) : null,
      },
      include: { movie: true },
    });
    return res.status(200).json(serializeEntry(entry));
  } catch (error) {
    return tmdbError(res, error);
  }
}

export async function setFavorite(req: AuthRequest, res: Response) {
  const tmdbId = tmdbIdFromRequest(req.params.tmdbId);
  const { isFavorite } = req.body as { isFavorite?: boolean };
  if (!tmdbId) return res.status(400).json({ error: 'Id TMDB inválido.' });
  if (typeof isFavorite !== 'boolean') return res.status(400).json({ error: 'isFavorite deve ser true ou false.' });
  const entry = await prisma.userMovie.findFirst({ where: { userId: req.userId!, movie: { tmdbId } } });
  if (!entry) return res.status(404).json({ error: 'Este filme ainda não está na sua lista.' });
  const updated = await prisma.userMovie.update({
    where: { id: entry.id },
    data: { isFavorite },
    include: { movie: true },
  });
  return res.json(serializeEntry(updated));
}

export async function removeLibraryEntry(req: AuthRequest, res: Response) {
  const tmdbId = tmdbIdFromRequest(req.params.tmdbId);
  if (!tmdbId) return res.status(400).json({ error: 'Id TMDB inválido.' });
  // DELETE is idempotent: retrying after a timeout or a double tap still
  // results in the movie being absent from this user's collection.
  await prisma.userMovie.deleteMany({ where: { userId: req.userId!, movie: { tmdbId } } });
  return res.status(204).send();
}

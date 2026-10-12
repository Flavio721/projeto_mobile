import type { Response } from 'express';
import { prisma } from '../lib/prisma.js';
import type { AuthRequest } from '../middlewares/authMiddleware.js';
import { MovieStatus } from '../../generated/prisma/enums.js';
import { getTmdbMovie, posterUrl, searchTmdbMovies, type TmdbMovie } from '../services/tmdbService.js';

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
}) {
  const movie = entry.movie;
  return {
    id: String(movie.tmdbId),
    tmdbId: movie.tmdbId,
    title: movie.title,
    coverUrl: posterUrl(movie.posterPath),
    releaseYear: movie.releaseDate ? Number(movie.releaseDate.slice(0, 4)) || null : null,
    duration: movie.runtime,
    director: undefined,
    description: movie.overview,
    tmdbRating: movie.voteAverage,
    rating: entry.rating,
    status: entry.status,
    isFavorite: entry.isFavorite,
    genres: movie.genres.map((name) => ({ name })),
    comment: entry.comment,
    watchedAt: entry.watchedAt?.toISOString() ?? null,
    inLibrary: true,
  };
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
  if (!query) return res.status(400).json({ error: 'Digite o nome de um filme para pesquisar.' });
  if (query.length > 100) return res.status(400).json({ error: 'A pesquisa deve ter até 100 caracteres.' });
  if (!Number.isInteger(page) || page < 1 || page > 500) return res.status(400).json({ error: 'Página inválida.' });

  try {
    const response = await searchTmdbMovies(query, page);
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

export async function getCatalogMovie(req: AuthRequest, res: Response) {
  const tmdbId = tmdbIdFromRequest(req.params.tmdbId);
  if (!tmdbId) return res.status(400).json({ error: 'Id TMDB inválido.' });
  try {
    const [movie, entry] = await Promise.all([
      getTmdbMovie(tmdbId),
      prisma.userMovie.findFirst({
        where: { userId: req.userId!, movie: { tmdbId } },
        include: { movie: true },
      }),
    ]);
    const catalog = serializeTmdb(movie);
    return res.json(entry ? serializeEntry(entry) : catalog);
  } catch (error) {
    return tmdbError(res, error);
  }
}

export async function getLibraryEntry(req: AuthRequest, res: Response) {
  const tmdbId = tmdbIdFromRequest(req.params.tmdbId);
  if (!tmdbId) return res.status(400).json({ error: 'Id TMDB inválido.' });
  const entry = await prisma.userMovie.findFirst({
    where: { userId: req.userId!, movie: { tmdbId } },
    include: { movie: true },
  });
  if (!entry) return res.status(404).json({ error: 'Este filme ainda não está na sua lista.' });
  return res.json(serializeEntry(entry));
}

export async function getMovies(req: AuthRequest, res: Response) {
  const entries = await prisma.userMovie.findMany({
    where: { userId: req.userId! },
    include: { movie: true },
    orderBy: { updatedAt: 'desc' },
  });
  return res.json(entries.map(serializeEntry));
}

export async function getStats(req: AuthRequest, res: Response) {
  const userId = req.userId!;
  const [total, assistidos, queroAssistir, favoritos] = await Promise.all([
    prisma.userMovie.count({ where: { userId } }),
    prisma.userMovie.count({ where: { userId, status: MovieStatus.WATCHED } }),
    prisma.userMovie.count({ where: { userId, status: MovieStatus.WATCHLIST } }),
    prisma.userMovie.count({ where: { userId, isFavorite: true } }),
  ]);
  return res.json({ total, assistidos, queroAssistir, favoritos });
}

export async function saveLibraryEntry(req: AuthRequest, res: Response) {
  const tmdbId = tmdbIdFromRequest(req.params.tmdbId);
  if (!tmdbId) return res.status(400).json({ error: 'Id TMDB inválido.' });
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ error: 'Envie os dados do registro pessoal.' });
  }
  const body = req.body as PersonalFields;
  const validationError = validatePersonalFields(body);
  if (validationError) return res.status(400).json({ error: validationError });
  if (body.status === undefined) return res.status(400).json({ error: 'Informe o status do filme.' });

  try {
    const tmdbMovie = await getTmdbMovie(tmdbId);
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
  const entry = await prisma.userMovie.findFirst({ where: { userId: req.userId!, movie: { tmdbId } } });
  if (!entry) return res.status(404).json({ error: 'Este filme não está na sua lista.' });
  await prisma.userMovie.delete({ where: { id: entry.id } });
  return res.status(204).send();
}

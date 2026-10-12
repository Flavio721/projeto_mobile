import type { Filme } from '../types/Filme';

type ApiMovie = {
  id: string | number;
  tmdbId?: number;
  title: string;
  coverUrl?: string | null;
  releaseYear?: number | null;
  duration?: number | null;
  director?: string | null;
  description?: string | null;
  tmdbRating?: number | null;
  rating?: number | null;
  status?: 'WATCHED' | 'WATCHLIST' | null;
  isFavorite?: boolean;
  genres?: Array<{ name: string }>;
  comment?: string | null;
  watchedAt?: string | null;
  inLibrary?: boolean;
};

export function mapMovieToFilme(movie: ApiMovie): Filme {
  return {
    id: String(movie.tmdbId ?? movie.id),
    titulo: movie.title,
    posterUri: movie.coverUrl ?? undefined,
    ano: movie.releaseYear ?? 0,
    genero: movie.genres?.map((genre) => genre.name).join(', ') || '—',
    duracaoMin: movie.duration ?? undefined,
    diretor: movie.director ?? undefined,
    descricao: movie.description ?? undefined,
    nota: movie.rating ?? 0,
    tmdbRating: movie.tmdbRating ?? null,
    status: movie.status ?? null,
    comentario: movie.comment ?? null,
    assistidoEm: movie.watchedAt ?? null,
    naLista: movie.inLibrary ?? (movie.status != null),
    trailerUrl: undefined,
    favorito: movie.isFavorite ?? false,
  };
}

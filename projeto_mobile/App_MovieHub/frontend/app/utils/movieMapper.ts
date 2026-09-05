import type { Filme } from '../types/Filme';

export function mapMovieToFilme(movie: any): Filme {
  return {
    id: String(movie.id),
    titulo: movie.title,
    posterUri: movie.coverUrl,
    ano: movie.releaseYear,
    genero: Array.isArray(movie.genres) && movie.genres.length > 0
      ? movie.genres.map((g: any) => g.name).join(", ")
      : "—",
    duracaoMin: movie.duration,
    diretor: movie.director,
    descricao: movie.description,
    nota: Number(movie.rating),
    status: movie.status === "WATCHED" ? "WATCHED" : "WATCHLIST",
    trailerUrl: movie.trailerUrl ?? undefined,
    favorito: movie.isFavorite,
  };
}
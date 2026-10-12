export type StatusFilme = 'WATCHED' | 'WATCHLIST';

export interface Filme {
    id: string;
    tmdbRating?: number | null;
    titulo: string;
    posterUri?: string;
    ano: number;
    genero: string;
    duracaoMin?: number;
    diretor?: string;
    descricao?: string;
    nota: number; // nota pessoal, de 1 a 5; zero significa sem avaliação
    comentario?: string | null;
    assistidoEm?: string | null;
    naLista?: boolean;
    status: StatusFilme | null;
    trailerUrl?: string;
    favorito: boolean;
}

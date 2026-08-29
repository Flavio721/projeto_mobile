export type StatusFilme = 'WATCHED' | 'WATCHLIST';

export interface Filme {
    id: string;
    titulo: string;
    posterUri?: string;
    ano: number;
    genero: string;
    duracaoMin?: number;
    diretor?: string;
    descricao?: string;
    nota: number; // 0 a 5
    status: StatusFilme;
    trailerUrl?: string;
    favorito: boolean;
}
import type { StatusFilme } from './Filme';

export type OrdenarPor = 'recentes' | 'nota' | 'titulo' | 'ano';

export interface Filtros {
  genero: string | null; // null = todos os gêneros
  status: 'todos' | StatusFilme;
  anoMin: string;
  anoMax: string;
  notaMinima: number;
  apenasFavoritos: boolean;
  ordenarPor: OrdenarPor;
}

export const FILTROS_PADRAO: Filtros = {
  genero: null,
  status: 'todos',
  anoMin: '',
  anoMax: '',
  notaMinima: 0,
  apenasFavoritos: false,
  ordenarPor: 'recentes',
};

export function filtrosEstaoAtivos(filtros: Filtros): boolean {
  return (
    filtros.genero !== null ||
    filtros.status !== 'todos' ||
    filtros.anoMin !== '' ||
    filtros.anoMax !== '' ||
    filtros.notaMinima > 0 ||
    filtros.apenasFavoritos ||
    filtros.ordenarPor !== 'recentes'
  );
}
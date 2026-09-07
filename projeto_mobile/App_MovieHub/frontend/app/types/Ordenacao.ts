export type OrdemFilmes =
  | 'titulo_az'
  | 'titulo_za'
  | 'recentes'
  | 'antigos'
  | 'maior_nota'
  | 'menor_nota'
  | 'ano_crescente'
  | 'ano_decrescente';

export const ORDEM_PADRAO: OrdemFilmes = 'recentes';
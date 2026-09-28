export type NomeTema = 'escuro' | 'claro';
export const TEMA_ESCURO = {
  background: '#151327',
  surface: '#1E1B38',
  card: 'rgba(255,255,255,0.06)',
  border: 'rgba(255,255,255,0.12)',
  white: '#FFFFFF',
  text: '#FFFFFF',
  muted: '#9C97B8',
  placeholder: '#6E6A8C',
  gold: '#F4B400',
  onGold: '#241C00',
  danger: '#E5484D',
  success: '#3DDC97',
  info: '#4EA1F3',
  purple: '#9C6ADE',
  posterFallback: '#3B3566',
  heartOn: '#E5484D',
  heartOff: '#6E6A8C',
  overlay: 'rgba(0,0,0,0.55)',
};

export type Paleta = typeof TEMA_ESCURO;

export const TEMA_CLARO: Paleta = {
  background: '#F5F4F8',
  surface: '#FFFFFF',
  card: 'rgba(0,0,0,0.04)',
  border: 'rgba(0,0,0,0.12)',
  white: '#FFFFFF',
  text: '#1A1830',
  muted: '#605C77',
  placeholder: '#8E8AA3',
  gold: '#C98F00',
  onGold: '#FFFFFF',
  danger: '#C92A2F',
  success: '#1B9E63',
  info: '#2571BE',
  purple: '#6E3FB0',
  posterFallback: '#D9D6E6',
  heartOn: '#C92A2F',
  heartOff: '#8E8AA3',
  overlay: 'rgba(0,0,0,0.35)',
};

export const PALETAS: Record<NomeTema, Paleta> = {
  escuro: TEMA_ESCURO,
  claro: TEMA_CLARO,
};
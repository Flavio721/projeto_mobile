import { buscarItem, salvarItem } from './storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

interface UsuarioSincronizado {
  id: string;
  name: string;
  username: string;
  createdAt: string;
  avatarUrl?: string | null;
  stats?: EstatisticasSincronizadas;
}

interface EstatisticasSincronizadas {
  total: number;
  assistidos: number;
  queroAssistir: number;
  favoritos: number;
}

/** Revalida a sessão e atualiza o nome de exibição armazenado no dispositivo. */
export async function sincronizarConta(opcoes: { incluirEstatisticas?: boolean } = {}): Promise<UsuarioSincronizado> {
  const token = await buscarItem('token');
  if (!token) throw new Error('Sessão expirada. Faça login novamente.');

  const headers = { Authorization: `Bearer ${token}` };
  const [usuarioResponse, statsResponse] = await Promise.all([
    fetch(`${API_BASE_URL}/users/me`, { headers }),
    opcoes.incluirEstatisticas ? fetch(`${API_BASE_URL}/movies/stats`, { headers }) : Promise.resolve(null),
  ]);

  if (!usuarioResponse.ok || (statsResponse && !statsResponse.ok)) {
    throw new Error('Não foi possível atualizar seus dados.');
  }
  const usuario = await usuarioResponse.json() as UsuarioSincronizado;
  await salvarItem('userName', usuario.name ?? '');
  await salvarItem('ultimaSincronizacao', new Date().toISOString());

  if (statsResponse) {
    const stats = await statsResponse.json() as EstatisticasSincronizadas;
    return Object.assign(usuario, { stats });
  }
  return usuario;
}

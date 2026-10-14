import { buscarItem, salvarItem } from './storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

/** Revalida a sessão e confere os dados persistidos no servidor. */
export async function sincronizarConta(): Promise<void> {
  const token = await buscarItem('token');
  if (!token) throw new Error('Sessão expirada. Faça login novamente.');

  const headers = { Authorization: `Bearer ${token}` };
  const [usuarioResponse, filmesResponse, statsResponse] = await Promise.all([
    fetch(`${API_BASE_URL}/users/me`, { headers }),
    fetch(`${API_BASE_URL}/movies`, { headers }),
    fetch(`${API_BASE_URL}/movies/stats`, { headers }),
  ]);

  if ([usuarioResponse, filmesResponse, statsResponse].some((response) => !response.ok)) {
    throw new Error('Não foi possível atualizar seus dados.');
  }
  const usuario = await usuarioResponse.json();
  await salvarItem('userName', usuario.name ?? '');
  await salvarItem('ultimaSincronizacao', new Date().toISOString());
}

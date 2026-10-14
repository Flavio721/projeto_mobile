import { Platform } from 'react-native';
import { buscarItem } from './storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

/**
 * Recebe uma URI local (file://, blob:, content://) e devolve a URL pública
 * de verdade do backend. Se a URI já for uma URL http(s) (ex.: o usuário
 * está editando um filme e não trocou a capa), devolve ela mesma sem
 * reenviar nada.
 */
export async function uploadImagem(uriLocal: string): Promise<string> {
  if (uriLocal.startsWith('http://') || uriLocal.startsWith('https://')) {
    return uriLocal;
  }

  const token = await buscarItem('token');
  if (!token) {
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  const formData = new FormData();

  if (Platform.OS === 'web') {
    // No navegador, o FormData da web precisa de um Blob/File de verdade —
    // o formato {uri, name, type} é específico do React Native nativo e não
    // funciona aqui. Buscamos o conteúdo real por trás do blob: primeiro.
    const respostaBlob = await fetch(uriLocal);
    const blob = await respostaBlob.blob();
    const extensao = blob.type.split('/')[1] ?? 'jpg';
    formData.append('imagem', blob, `capa.${extensao}`);
  } else {
    const nomeArquivo = uriLocal.split('/').pop() ?? 'imagem.jpg';
    const extensao = nomeArquivo.split('.').pop()?.toLowerCase();
    const tipoMime = extensao === 'png' ? 'image/png' : 'image/jpeg';
    formData.append('imagem', {
      uri: uriLocal,
      name: nomeArquivo,
      type: tipoMime,
    } as any);
  }

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      // Não definir Content-Type manualmente — o fetch precisa gerar o
      // boundary do multipart/form-data sozinho. Definir na mão quebra o upload.
    },
    body: formData,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error ?? 'Falha ao enviar a imagem.');
  }

  const data = await response.json();
  return data.url;
}
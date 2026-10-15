import { createHash, randomUUID } from 'node:crypto';

const CLOUDINARY_FOLDER = 'moviehub/avatars';

function configuration() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (!cloudName || !apiKey || !apiSecret) return null;
  return { cloudName, apiKey, apiSecret };
}

function assinar(params: Record<string, string>, apiSecret: string) {
  const serialized = Object.entries(params)
    .filter(([, value]) => value !== '')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  return createHash('sha1').update(`${serialized}${apiSecret}`).digest('hex');
}

export function avatarPublicIdValido(publicId: string): boolean {
  return /^[a-f0-9-]{36}$/.test(publicId);
}

export function avatarCloudinaryUrlValida(url: string, publicId: string): boolean {
  const config = configuration();
  if (!config || !avatarPublicIdValido(publicId)) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:'
      && parsed.hostname === 'res.cloudinary.com'
      && parsed.pathname.startsWith(`/${config.cloudName}/image/upload/`)
      && parsed.pathname.includes(`/${publicId}.`);
  } catch {
    return false;
  }
}

export async function uploadAvatar(buffer: Buffer, mimeType: string) {
  const config = configuration();
  if (!config) throw new Error('Cloudinary não está configurado no servidor.');

  const extensionByType: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
  };
  const extension = extensionByType[mimeType];
  if (!extension) throw new Error('Formato de imagem não suportado.');

  const publicId = randomUUID();
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = assinar({ folder: CLOUDINARY_FOLDER, public_id: publicId, timestamp }, config.apiSecret);
  const form = new FormData();
  const bytes = new Uint8Array(buffer.byteLength);
  bytes.set(buffer);
  form.append('file', new Blob([bytes.buffer], { type: mimeType }), `avatar.${extension}`);
  form.append('api_key', config.apiKey);
  form.append('timestamp', timestamp);
  form.append('folder', CLOUDINARY_FOLDER);
  form.append('public_id', publicId);
  form.append('signature', signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(config.cloudName)}/image/upload`, {
    method: 'POST',
    body: form,
  });
  const payload = await response.json() as { secure_url?: string; public_id?: string; error?: { message?: string } };
  if (!response.ok || !payload.secure_url || payload.public_id !== publicId) {
    throw new Error(payload.error?.message || 'Cloudinary não conseguiu salvar a imagem.');
  }
  return { url: payload.secure_url, publicId };
}

export async function deleteAvatar(publicId: string): Promise<void> {
  if (!avatarPublicIdValido(publicId)) return;
  const config = configuration();
  if (!config) throw new Error('Cloudinary não está configurado no servidor.');

  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = assinar({ public_id: publicId, timestamp }, config.apiSecret);
  const form = new FormData();
  form.append('public_id', publicId);
  form.append('api_key', config.apiKey);
  form.append('timestamp', timestamp);
  form.append('signature', signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(config.cloudName)}/image/destroy`, {
    method: 'POST',
    body: form,
  });
  const payload = await response.json() as { result?: string; error?: { message?: string } };
  if (!response.ok || (payload.result !== 'ok' && payload.result !== 'not found')) {
    throw new Error(payload.error?.message || 'Cloudinary não conseguiu remover a imagem antiga.');
  }
}

import { Request, Response } from 'express';
import { uploadAvatar } from '../lib/cloudinary.js';

const uploadImagem = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    // Do not trust multipart Content-Type: clients can freely spoof it.
    const { buffer } = req.file;
    const mimeType = buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))
        ? 'image/jpeg'
        : buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
          ? 'image/png'
          : buffer.subarray(0, 4).toString() === 'GIF8'
            ? 'image/gif'
            : buffer.subarray(0, 4).toString() === 'RIFF' && buffer.subarray(8, 12).toString() === 'WEBP'
              ? 'image/webp'
              : null;
    if (!mimeType) return res.status(400).json({ error: 'O arquivo enviado não é uma imagem suportada.' });

    try {
        const avatar = await uploadAvatar(buffer, mimeType);
        return res.status(201).json(avatar);
    } catch (error) {
        console.error('Erro ao enviar imagem para Cloudinary:', error);
        const message = error instanceof Error ? error.message : 'Falha ao enviar a imagem.';
        const status = message.includes('não está configurado') ? 503 : 502;
        return res.status(status).json({ error: message });
    }
};

export { uploadImagem };

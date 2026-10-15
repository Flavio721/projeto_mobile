import { Request, Response } from 'express';
import { uploadAvatar } from '../lib/cloudinary.js';

const uploadImagem = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    try {
        const avatar = await uploadAvatar(req.file.buffer, req.file.mimetype);
        return res.status(201).json(avatar);
    } catch (error) {
        console.error('Erro ao enviar imagem para Cloudinary:', error);
        const message = error instanceof Error ? error.message : 'Falha ao enviar a imagem.';
        const status = message.includes('não está configurado') ? 503 : 502;
        return res.status(status).json({ error: message });
    }
};

export { uploadImagem };

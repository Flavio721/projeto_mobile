import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { uploadImagem } from '../controllers/uploadController.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const nomeUnico = crypto.randomUUID();
        const extensao = path.extname(file.originalname) || '.jpg';
        cb(null, `${nomeUnico}${extensao}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB — suficiente pra capa de filme
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Apenas arquivos de imagem são permitidos'));
        }
        cb(null, true);
    },
});

const uploadRoutes = Router();

uploadRoutes.post('/', authMiddleware, upload.single('imagem'), uploadImagem);

export default uploadRoutes;
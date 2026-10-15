import { Router } from 'express';
import multer from 'multer';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { uploadImagem } from '../controllers/uploadController.js';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB — suficiente pra capa de filme
    fileFilter: (req, file, cb) => {
        if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype)) {
            return cb(new Error('Envie uma imagem JPEG, PNG, WebP ou GIF.'));
        }
        cb(null, true);
    },
});

const uploadRoutes = Router();

uploadRoutes.post('/', authMiddleware, upload.single('imagem'), uploadImagem);

export default uploadRoutes;

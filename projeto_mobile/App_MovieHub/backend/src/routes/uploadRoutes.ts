import { Router } from 'express';
import multer from 'multer';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { rateLimitMiddleware } from '../middlewares/rateLimitMiddleware.js';
import { uploadImagem } from '../controllers/uploadController.js';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB — suficiente pra capa de filme
    fileFilter: (req, file, cb) => {
        if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype)) {
            return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
        }
        cb(null, true);
    },
});

const uploadRoutes = Router();
const uploadLimiter = rateLimitMiddleware({ limit: 20, windowMs: 60 * 60 * 1000, message: 'Limite de uploads atingido. Tente novamente mais tarde.' });

uploadRoutes.post('/', authMiddleware, uploadLimiter, upload.single('imagem'), uploadImagem);

export default uploadRoutes;

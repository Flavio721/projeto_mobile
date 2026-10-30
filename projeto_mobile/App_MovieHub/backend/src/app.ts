import express from 'express';
import multer from 'multer';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import cinemaRoutes from './routes/cinemaRoutes.js';
import friendRoutes from './routes/friendRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import { uploadDirectory } from './lib/uploadStorage.js';

const app = express();
// Render sits behind a TLS proxy. Trust its forwarded protocol so generated
// upload links use HTTPS and can be loaded by the mobile/web app.
app.set('trust proxy', 1);

app.use(cors());
app.disable('x-powered-by');
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Cache-Control', 'no-store');
  next();
});
app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'MovieHub API rodando' });
});


// ... junto dos outros app.use
app.use('/uploads', express.static(uploadDirectory, { fallthrough: false, maxAge: '1d' }));
app.use('/upload', uploadRoutes);

app.use('/users', userRoutes);
app.use('/movies', movieRoutes);
app.use('/cinemas', cinemaRoutes);
app.use('/friends', friendRoutes);
app.use('/books', bookRoutes);

app.use((_req, res) => res.status(404).json({ error: 'Rota não encontrada.' }));

app.use((error: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (res.headersSent) return next(error);
  if (error instanceof multer.MulterError) {
    const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    return res.status(status).json({ error: status === 413 ? 'O arquivo excede o limite de 5 MB.' : 'Upload inválido.' });
  }
  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({ error: 'JSON inválido.' });
  }
  if (error && typeof error === 'object' && 'status' in error
      && typeof error.status === 'number' && error.status >= 400 && error.status < 500) {
    const status = error.status;
    return res.status(status).json({ error: status === 413 ? 'A requisição excede o limite permitido.' : 'Requisição inválida.' });
  }
  console.error('Erro não tratado pela API:', error);
  return res.status(500).json({ error: 'Erro interno do servidor.' });
});

export default app;

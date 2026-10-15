import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import cinemaRoutes from './routes/cinemaRoutes.js';
import friendRoutes from './routes/friendRoutes.js';
import { uploadDirectory } from './lib/uploadStorage.js';

const app = express();
// Render sits behind a TLS proxy. Trust its forwarded protocol so generated
// upload links use HTTPS and can be loaded by the mobile/web app.
app.set('trust proxy', 1);

app.use(cors());
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

app.use((error: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (res.headersSent) return next(error);
  console.error('Erro não tratado pela API:', error);
  return res.status(500).json({ error: 'Erro interno do servidor.' });
});

export default app;

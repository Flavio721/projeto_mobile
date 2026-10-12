import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import path from 'path';
import uploadRoutes from './routes/uploadRoutes.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'MovieHub API rodando' });
});


// ... junto dos outros app.use
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/upload', uploadRoutes);

app.use('/users', userRoutes);
app.use('/movies', movieRoutes);

app.use((error: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (res.headersSent) return next(error);
  console.error('Erro não tratado pela API:', error);
  return res.status(500).json({ error: 'Erro interno do servidor.' });
});

export default app;

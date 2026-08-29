import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import movieRoutes from './routes/movieRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'MovieHub API rodando' });
});

app.use('/users', userRoutes);
app.use('/movies', movieRoutes);

export default app;
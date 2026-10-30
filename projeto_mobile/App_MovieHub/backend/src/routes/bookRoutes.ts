import { Router } from 'express';
import { addBook, getBookStats, getBooks, removeBook, searchBooks, updateBook } from '../controllers/bookController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { rateLimitMiddleware } from '../middlewares/rateLimitMiddleware.js';

const bookRoutes = Router();
const searchLimiter = rateLimitMiddleware({ limit: 30, windowMs: 15 * 60 * 1000, message: 'Muitas pesquisas de livros. Tente novamente mais tarde.' });
const writeLimiter = rateLimitMiddleware({ limit: 60, windowMs: 60 * 60 * 1000, message: 'Muitas alterações na biblioteca. Tente novamente mais tarde.' });

bookRoutes.use(authMiddleware);
bookRoutes.get('/search', searchLimiter, searchBooks);
bookRoutes.get('/stats', getBookStats);
bookRoutes.get('/', getBooks);
bookRoutes.put('/:googleBooksId/library', writeLimiter, addBook);
bookRoutes.patch('/:bookId/library', writeLimiter, updateBook);
bookRoutes.delete('/:bookId/library', writeLimiter, removeBook);

export default bookRoutes;

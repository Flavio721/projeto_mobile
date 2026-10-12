import { Router } from 'express';
import {
  getCatalogMovie,
  getPopularMovies,
  getLibraryEntry,
  getMovies,
  getStats,
  removeLibraryEntry,
  saveLibraryEntry,
  searchMovies,
  setFavorite,
} from '../controllers/movieController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const movieRoutes = Router();
movieRoutes.use(authMiddleware);

movieRoutes.get('/search', searchMovies);
movieRoutes.get('/popular', getPopularMovies);
movieRoutes.get('/stats', getStats);
movieRoutes.get('/catalog/:tmdbId', getCatalogMovie);
movieRoutes.get('/:tmdbId/library', getLibraryEntry);
movieRoutes.put('/:tmdbId/library', saveLibraryEntry);
movieRoutes.delete('/:tmdbId/library', removeLibraryEntry);
movieRoutes.patch('/:tmdbId/favorite', setFavorite);
movieRoutes.get('/', getMovies);

export default movieRoutes;

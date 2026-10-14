import { Router } from 'express';
import { getNearbyCinemas } from '../controllers/cinemaController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const cinemaRoutes = Router();
cinemaRoutes.get('/nearby', authMiddleware, getNearbyCinemas);

export default cinemaRoutes;

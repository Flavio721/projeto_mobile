import { Router } from 'express';
import {
  acceptFriendRequest,
  getFriendActivity,
  getFriends,
  getPrivacy,
  removeFriendship,
  sendFriendRequest,
  updatePrivacy,
} from '../controllers/friendController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const friendRoutes = Router();
friendRoutes.use(authMiddleware);

friendRoutes.get('/', getFriends);
friendRoutes.post('/requests', sendFriendRequest);
friendRoutes.post('/requests/:id/accept', acceptFriendRequest);
friendRoutes.delete('/requests/:id', removeFriendship);
friendRoutes.get('/privacy', getPrivacy);
friendRoutes.patch('/privacy', updatePrivacy);
friendRoutes.get('/:userId/activity', getFriendActivity);

export default friendRoutes;

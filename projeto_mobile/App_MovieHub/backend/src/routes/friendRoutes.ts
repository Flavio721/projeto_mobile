import { Router } from 'express';
import {
  acceptFriendRequest,
  getFriendProfile,
  getFriends,
  getPrivacy,
  removeFriendship,
  searchUser,
  sendFriendRequest,
  updatePrivacy,
} from '../controllers/friendController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const friendRoutes = Router();
friendRoutes.use(authMiddleware);

friendRoutes.get('/', getFriends);
friendRoutes.get('/search', searchUser);
friendRoutes.post('/requests', sendFriendRequest);
friendRoutes.post('/requests/:id/accept', acceptFriendRequest);
friendRoutes.delete('/requests/:id', removeFriendship);
friendRoutes.get('/privacy', getPrivacy);
friendRoutes.patch('/privacy', updatePrivacy);
friendRoutes.get('/:userId/profile', getFriendProfile);

export default friendRoutes;

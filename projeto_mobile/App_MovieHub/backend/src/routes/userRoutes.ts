import { Router } from 'express';
import { Cadastro, Login } from '../controllers/userController.js';

const userRoutes = Router();

userRoutes.post('/cadastro', Cadastro);
userRoutes.post('/login', Login);

export default userRoutes;
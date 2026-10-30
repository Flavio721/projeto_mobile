import { Router } from "express";
import { Cadastro, Login, LoginGoogle, getMe, updateProfile, changePassword } from '../controllers/userController.js';
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { rateLimitMiddleware } from "../middlewares/rateLimitMiddleware.js";


const userRoutes = Router();
const loginLimiter = rateLimitMiddleware({ limit: 12, windowMs: 15 * 60 * 1000, message: 'Muitas tentativas de login. Aguarde alguns minutos e tente novamente.' });
const cadastroLimiter = rateLimitMiddleware({ limit: 8, windowMs: 60 * 60 * 1000, message: 'Muitas tentativas de cadastro. Tente novamente mais tarde.' });

userRoutes.post("/cadastro", cadastroLimiter, Cadastro);
userRoutes.post("/login", loginLimiter, Login);
userRoutes.post("/google", loginLimiter, LoginGoogle);
userRoutes.get('/me', authMiddleware, getMe);
userRoutes.put('/me', authMiddleware, updateProfile);
userRoutes.patch('/me/password', authMiddleware, changePassword);

export default userRoutes;

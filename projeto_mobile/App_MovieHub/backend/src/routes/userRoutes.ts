import { Router } from "express";
import { Cadastro, Login, getMe, updateProfile, changePassword } from '../controllers/userController.js';
import { authMiddleware } from "../middlewares/authMiddleware.js";


const userRoutes = Router();

userRoutes.post("/cadastro", Cadastro);
userRoutes.post("/login", Login);
userRoutes.get('/me', authMiddleware, getMe);
userRoutes.put('/me', authMiddleware, updateProfile);
userRoutes.patch('/me/password', authMiddleware, changePassword);

export default userRoutes;

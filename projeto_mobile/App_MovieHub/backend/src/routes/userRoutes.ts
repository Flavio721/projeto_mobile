import { Router } from "express";
import { Cadastro, getMe, Login } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const userRoutes = Router();

userRoutes.post("/cadastro", Cadastro);
userRoutes.post("/login", Login);
userRoutes.get('/me', authMiddleware, getMe);

export default userRoutes;

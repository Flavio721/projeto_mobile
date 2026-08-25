import { Router } from "express";
import { Cadastro, Login } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { Stats } from "../controllers/userController.js";

const userRoutes = Router();

userRoutes.post("/cadastro", Cadastro);
userRoutes.post("/login", Login);
userRoutes.get("/stats", authMiddleware, Stats);

export default userRoutes;

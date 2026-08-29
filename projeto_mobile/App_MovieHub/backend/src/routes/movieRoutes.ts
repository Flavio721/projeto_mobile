import { Router } from "express";
import { createFilm } from "../controllers/movieController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const movieRoutes = Router();

movieRoutes.post("/register", authMiddleware, createFilm);

export default movieRoutes;
import { Router } from "express";
import { createFilm, getMovies, getStats, toggleFavorite } from "../controllers/movieController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const movieRoutes = Router();

movieRoutes.post("/register", authMiddleware, createFilm);
movieRoutes.get("/", authMiddleware, getMovies);
movieRoutes.get("/stats", authMiddleware, getStats);
movieRoutes.patch("/:id/favorite", authMiddleware, toggleFavorite);

export default movieRoutes;
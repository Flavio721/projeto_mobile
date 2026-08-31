import { Router } from "express";
import { createFilm, getMovies, getStats, setFavorite } from "../controllers/movieController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const movieRoutes = Router();

movieRoutes.post("/register", authMiddleware, createFilm);
movieRoutes.get("/", authMiddleware, getMovies);
movieRoutes.get("/stats", authMiddleware, getStats);
movieRoutes.patch("/:id/favorite", authMiddleware, setFavorite);

export default movieRoutes;
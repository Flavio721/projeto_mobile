import { Router } from "express";
import { createFilm, getMovies, getStats, setFavorite, getMovieById, updateMovie, deleteMovie } from "../controllers/movieController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const movieRoutes = Router();

movieRoutes.post("/register", authMiddleware, createFilm);
movieRoutes.get("/", authMiddleware, getMovies);
movieRoutes.get("/stats", authMiddleware, getStats);
movieRoutes.get("/:id", authMiddleware, getMovieById);
movieRoutes.put("/:id", authMiddleware, updateMovie);
movieRoutes.delete("/:id", authMiddleware, deleteMovie);
movieRoutes.patch("/:id/favorite", authMiddleware, setFavorite);

export default movieRoutes;
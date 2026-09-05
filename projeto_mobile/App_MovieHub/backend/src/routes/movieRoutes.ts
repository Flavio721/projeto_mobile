import { Router } from "express";
<<<<<<< HEAD
import { createFilm, getMovies, getStats, setFavorite, getMovieById, updateMovie, deleteMovie } from "../controllers/movieController.js";
=======
import { createFilm, getMovies, getStats, setFavorite } from "../controllers/movieController.js";
>>>>>>> f6ceb3456ca8f4318e87720b444c106db1f085ab
import { authMiddleware } from "../middlewares/authMiddleware.js";

const movieRoutes = Router();

movieRoutes.post("/register", authMiddleware, createFilm);
movieRoutes.get("/", authMiddleware, getMovies);
movieRoutes.get("/stats", authMiddleware, getStats);
<<<<<<< HEAD
movieRoutes.get("/:id", authMiddleware, getMovieById);
movieRoutes.put("/:id", authMiddleware, updateMovie);
movieRoutes.delete("/:id", authMiddleware, deleteMovie);
=======
>>>>>>> f6ceb3456ca8f4318e87720b444c106db1f085ab
movieRoutes.patch("/:id/favorite", authMiddleware, setFavorite);

export default movieRoutes;
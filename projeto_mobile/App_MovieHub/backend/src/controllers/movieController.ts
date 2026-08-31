import { Response } from 'express';
import prisma from '../lib/prisma.js';
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { MovieStatus } from '../../generated/prisma/enums.js';

const STATUS_VALIDOS = Object.values(MovieStatus);

interface CreateFilmBody {
    title?: string;
    coverUrl?: string;
    releaseYear?: number;
    durationMovie?: number;
    director?: string;
    description?: string;
    rating?: number;
    status?: MovieStatus;
    trailerUrl?: string;
    genres?: string[];
}

function validarCampos(body: CreateFilmBody): string | null {
    const camposObrigatorios: (keyof CreateFilmBody)[] = [
        'title', 'coverUrl', 'releaseYear', 'durationMovie', 'director', 'description', 'rating',
    ];

    for (const campo of camposObrigatorios) {
        const valor = body[campo];
        if (valor === undefined || valor === null || valor === '') {
            return `Campo obrigatório vazio: ${campo}`;
        }
    }

    if (typeof body.releaseYear !== 'number' || body.releaseYear < 1888 || body.releaseYear > new Date().getFullYear() + 1) {
        return 'Ano de lançamento inválido';
    }

    if (typeof body.durationMovie !== 'number' || body.durationMovie <= 0) {
        return 'Duração inválida';
    }

    if (typeof body.rating !== 'number' || body.rating < 0 || body.rating > 5) {
        return 'Nota deve ser um número entre 0 e 5';
    }

    if (body.status && !STATUS_VALIDOS.includes(body.status)) {
        return `Status inválido. Use um de: ${STATUS_VALIDOS.join(', ')}`;
    }

    if (!body.genres || !Array.isArray(body.genres) || body.genres.length === 0) {
        return 'Selecione ao menos um gênero';
    }

    return null;
}

const createFilm = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ error: "Erro de autenticação" });
        }

        const body = req.body as CreateFilmBody;

        const erroValidacao = validarCampos(body);
        if (erroValidacao) {
            return res.status(400).json({ error: erroValidacao });
        }

        const {
            title, coverUrl, releaseYear, durationMovie, director,
            description, rating, status, trailerUrl, genres,
        } = body;

        const filmeExistente = await prisma.movie.findFirst({
            where: {
                userId,
                title: { equals: title, mode: 'insensitive' },
            },
        });

        if (filmeExistente) {
            return res.status(409).json({ error: "Você já cadastrou um filme com esse título" });
        }

        const novoFilme = await prisma.movie.create({
            data: {
                title: title!,
                coverUrl: coverUrl!,
                releaseYear: releaseYear!,
                duration: durationMovie!,
                director: director!,
                description: description!,
                rating: rating!,
                status: status ?? undefined,
                trailerUrl: trailerUrl || undefined,
                userId,
                genres: {
                    connectOrCreate: genres!.map((nome) => ({
                        where: { name: nome },
                        create: { name: nome },
                    })),
                },
            },
            include: { genres: true },
        });

        return res.status(201).json(novoFilme);

    } catch (error) {
        console.error("Erro: ", error);
        return res.status(500).json({ error: "Erro ao criar filme" });
    }
};

const getMovies = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ error: "Erro de autenticação" });
        }

        const filmes = await prisma.movie.findMany({
            where: { userId },
            include: { genres: true },
            orderBy: { createdAt: 'desc' },
        });

        return res.status(200).json(filmes);
    } catch (error) {
        console.error("Erro: ", error);
        return res.status(500).json({ error: "Erro ao buscar filmes" });
    }
};

const getStats = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ error: "Erro de autenticação" });
        }

        const [total, assistidos, queroAssistir, favoritos] = await Promise.all([
            prisma.movie.count({ where: { userId } }),
            prisma.movie.count({ where: { userId, status: 'WATCHED' } }),
            prisma.movie.count({ where: { userId, status: 'WATCHLIST' } }),
            prisma.movie.count({ where: { userId, isFavorite: true } }),
        ]);

        return res.status(200).json({ total, assistidos, queroAssistir, favoritos });
    } catch (error) {
        console.error("Erro: ", error);
        return res.status(500).json({ error: "Erro ao buscar estatísticas" });
    }
};

const setFavorite = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ error: "Erro de autenticação" });
        }

        const movieId = Number(req.params.id);
        const { isFavorite } = req.body as { isFavorite?: boolean };

        if (!Number.isInteger(movieId)) {
            return res.status(400).json({ error: "Id de filme inválido" });
        }

        if (typeof isFavorite !== 'boolean') {
            return res.status(400).json({ error: "Campo isFavorite deve ser true ou false" });
        }

        const filme = await prisma.movie.findUnique({ where: { id: movieId } });

        if (!filme) {
            return res.status(404).json({ error: "Filme não encontrado" });
        }

        if (filme.userId !== userId) {
            return res.status(403).json({ error: "Esse filme não pertence a você" });
        }

        const filmeAtualizado = await prisma.movie.update({
            where: { id: movieId },
            data: { isFavorite },
            include: { genres: true },
        });

        return res.status(200).json(filmeAtualizado);
    } catch (error) {
        console.error("Erro: ", error);
        return res.status(500).json({ error: "Erro ao favoritar filme" });
    }
};

export { createFilm, getMovies, getStats, setFavorite };
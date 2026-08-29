import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middlewares/authMiddleware.js";

const Cadastro = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Campos obrigatórios vazios!" });
    }

    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return res.status(409).json({ error: "Email já cadastrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const { password: _, ...userSemSenha } = newUser;
    return res.status(201).json(userSemSenha);
  } catch (error) {
    console.error("Erro: ", error);
    return res.status(500).json({ error: "Erro interno ao criar usuário" });
  }
};

const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Campos obrigatórios vazios!" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!existingUser) {
      return res.status(404).json({ error: "Email ou senha incorreta" });
    }

    const comparePassword = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!comparePassword) {
      return res.status(400).json({ error: "Email ou senha incorreta" });
    }
    const token = jwt.sign(
      { userId: existingUser.id },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    const { password: _, ...userSemSenha } = existingUser;
    return res.status(200).json({ user: userSemSenha, token });
  } catch (error) {
    console.error("Erro: ", error);
    return res.status(500).json({ error: "Erro. Tente novamente mais tarde" });
  }
};

const Stats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const [total, assistidos, queroAssistir, favoritos] = await Promise.all([
      prisma.movie.count({ where: { userId } }),
      prisma.movie.count({ where: { userId, status: "WATCHED" } }),
      prisma.movie.count({ where: { userId, status: "WATCHLIST" } }),
      prisma.movie.count({ where: { userId, favorito: true } }),
    ]);

    return res
      .status(200)
      .json({ total, assistidos, queroAssistir, favoritos });
  } catch (error) {
    console.error("Erro:", error);
    return res.status(500).json({ error: "Erro ao buscar estatísticas" });
  }
};

export { Cadastro, Login, Stats };

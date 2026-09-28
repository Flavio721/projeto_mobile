import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middlewares/authMiddleware.js";

interface UpdateProfileBody {
    name?: string;
    avatarUrl?: string | null;
}

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

const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Erro de autenticação" });
    }

    const usuario = await prisma.user.findUnique({ where: { id: userId } });

    if (!usuario) {
      // Token válido, mas o usuário foi excluído do banco depois de gerado.
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    const { password: _, ...usuarioSemSenha } = usuario;
    return res.status(200).json(usuarioSemSenha);
  } catch (error) {
    console.error("Erro: ", error);
    return res.status(500).json({ error: "Erro ao buscar usuário" });
  }
};

const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ error: "Erro de autenticação" });
        }

        const { name, avatarUrl } = req.body as UpdateProfileBody;

        // Nome só é validado se veio na requisição — assim dá pra trocar só a
        // foto sem precisar reenviar o nome, e vice-versa.
        if (name !== undefined) {
            if (typeof name !== 'string' || name.trim().length < 2) {
                return res.status(400).json({ error: "Nome precisa ter ao menos 2 caracteres" });
            }
        }

        // E-mail não entra aqui de propósito: trocar e-mail é o identificador
        // de login, exige confirmação por e-mail pra não perder a conta.
        const usuarioAtualizado = await prisma.user.update({
            where: { id: userId },
            data: {
                name: name?.trim() ?? undefined,
                // null explícito = remover a foto; undefined = não mexer.
                avatarUrl: avatarUrl === undefined ? undefined : avatarUrl,
            },
        });

        const { password: _, ...usuarioSemSenha } = usuarioAtualizado;
        return res.status(200).json(usuarioSemSenha);
    } catch (error) {
        console.error("Erro: ", error);
        return res.status(500).json({ error: "Erro ao atualizar perfil" });
    }
};

const changePassword = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ error: "Erro de autenticação" });
        }

        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: "Informe a senha atual e a nova senha" });
        }

        if (typeof newPassword !== 'string' || newPassword.length < 6) {
            return res.status(400).json({ error: "A nova senha precisa ter ao menos 6 caracteres" });
        }

        if (currentPassword === newPassword) {
            return res.status(400).json({ error: "A nova senha precisa ser diferente da atual" });
        }

        const usuario = await prisma.user.findUnique({ where: { id: userId } });

        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        // Exigir a senha atual é o que impede alguém com o celular destravado
        // (ou um token roubado) de simplesmente trocar a senha e tomar a conta.
        const senhaConfere = await bcrypt.compare(currentPassword, usuario.password);

        if (!senhaConfere) {
            return res.status(401).json({ error: "Senha atual incorreta" });
        }

        const novaSenhaHash = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: userId },
            data: { password: novaSenhaHash },
        });

        return res.status(200).json({ message: "Senha alterada com sucesso" });
    } catch (error) {
        console.error("Erro: ", error);
        return res.status(500).json({ error: "Erro ao alterar senha" });
    }
};

export { Cadastro, Login, getMe, updateProfile, changePassword };
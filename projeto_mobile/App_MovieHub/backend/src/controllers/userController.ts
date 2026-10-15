import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { randomBytes } from 'node:crypto';

const googleOAuthClient = new OAuth2Client();

function emitirToken(userId: string): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "7d" });
}

function usuarioPublico<T extends { password: string | null; googleSub: string | null }>(usuario: T) {
  const { password: _password, googleSub: _googleSub, ...dados } = usuario;
  return dados;
}

interface UpdateProfileBody {
    name?: string;
    username?: string;
    avatarUrl?: string | null;
}

function normalizarUsername(value: unknown): string {
    return typeof value === 'string' ? value.trim().replace(/^@/, '').toLowerCase() : '';
}

function usernameValido(username: string): boolean {
    return /^[a-z0-9_]{3,24}$/.test(username);
}

async function gerarUsernameAutomatico(email: string, googleSub: string): Promise<string> {
    const base = email.split('@')[0]
        .toLowerCase()
        .replace(/[^a-z0-9_]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 15) || 'cinefilo';
    const googleSuffix = googleSub.replace(/[^a-z0-9]/gi, '').slice(-7).toLowerCase() || randomBytes(4).toString('hex');
    let candidate = `${base}_${googleSuffix}`.slice(0, 24);

    while (await prisma.user.findUnique({ where: { username: candidate }, select: { id: true } })) {
        candidate = `${base.slice(0, 14)}_${randomBytes(4).toString('hex')}`;
    }
    return candidate;
}

const Cadastro = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const username = normalizarUsername(req.body?.username);

    if (!name || !email || !password || !username) {
      return res.status(400).json({ error: "Campos obrigatórios vazios!" });
    }
    if (!usernameValido(username)) {
      return res.status(400).json({ error: 'O username deve ter de 3 a 24 caracteres: letras, números ou _.' });
    }

    const emailNormalizado = String(email).trim().toLowerCase();
    const existingEmail = await prisma.user.findUnique({
      where: { email: emailNormalizado },
    });

    if (existingEmail) {
      return res.status(409).json({ error: "Email já cadastrado" });
    }
    if (await prisma.user.findUnique({ where: { username }, select: { id: true } })) {
      return res.status(409).json({ error: 'Esse username já está em uso.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        email: emailNormalizado,
        password: hashedPassword,
      },
    });

    const userSemSenha = usuarioPublico(newUser);
    return res.status(201).json(userSemSenha);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return res.status(409).json({ error: 'Esse username já está em uso.' });
    }
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

    const emailNormalizado = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const existingUser = await prisma.user.findUnique({
      where: { email: emailNormalizado },
    });

    if (!existingUser?.password) {
      return res.status(401).json({ error: "Conta ou senha incorreta. Se você criou a conta com Google, use essa opção para entrar." });
    }

    const comparePassword = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!comparePassword) {
      return res.status(400).json({ error: "Email ou senha incorreta" });
    }
    const token = emitirToken(existingUser.id);

    const userSemSenha = usuarioPublico(existingUser);
    return res.status(200).json({ user: userSemSenha, token });
  } catch (error) {
    console.error("Erro: ", error);
    return res.status(500).json({ error: "Erro. Tente novamente mais tarde" });
  }
};

const LoginGoogle = async (req: Request, res: Response) => {
  try {
    const idToken = req.body?.idToken;
    if (typeof idToken !== 'string' || idToken.length < 100 || idToken.length > 12000) {
      return res.status(400).json({ error: 'Credencial Google inválida.' });
    }

    const audiences = (process.env.GOOGLE_OAUTH_CLIENT_IDS ?? '')
      .split(',')
      .map((clientId) => clientId.trim())
      .filter(Boolean);
    if (audiences.length === 0) {
      return res.status(503).json({ error: 'Login Google ainda não foi configurado no servidor.' });
    }

    let payload: { sub?: string; email?: string; email_verified?: boolean; name?: string; picture?: string } | undefined;
    try {
      const ticket = await googleOAuthClient.verifyIdToken({ idToken, audience: audiences });
      payload = ticket.getPayload();
    } catch (error) {
      console.warn('Token Google inválido:', error);
      return res.status(401).json({ error: 'Não foi possível autenticar com Google.' });
    }
    if (!payload?.sub || !payload.email || payload.email_verified !== true) {
      return res.status(401).json({ error: 'Não foi possível validar a conta Google.' });
    }

    const email = payload.email.trim().toLowerCase();
    let usuario = await prisma.user.findUnique({ where: { googleSub: payload.sub } });

    if (usuario) {
      if (usuario.email !== email) {
        const contaComEmail = await prisma.user.findUnique({ where: { email } });
        if (contaComEmail && contaComEmail.id !== usuario.id) {
          return res.status(409).json({ error: 'Este e-mail já está associado a outra conta MovieHub.' });
        }
        usuario = await prisma.user.update({ where: { id: usuario.id }, data: { email } });
      }
    } else {
      const contaExistente = await prisma.user.findUnique({ where: { email } });
      if (contaExistente?.googleSub && contaExistente.googleSub !== payload.sub) {
        return res.status(409).json({ error: 'Este e-mail já está associado a outra conta Google.' });
      }

      // A Google account proves control of this verified email, so it can be
      // linked to an existing password account without replacing its data.
      usuario = contaExistente
        ? await prisma.user.update({
            where: { id: contaExistente.id },
            data: { googleSub: payload.sub },
          })
        : await prisma.user.create({
              data: {
              email,
              name: payload.name?.trim() || email.split('@')[0],
                username: await gerarUsernameAutomatico(email, payload.sub),
              password: null,
              googleSub: payload.sub,
              avatarUrl: payload.picture ?? null,
            },
          });
    }

    return res.status(200).json({ user: usuarioPublico(usuario), token: emitirToken(usuario.id) });
  } catch (error) {
    console.error('Erro no login Google:', error);
    return res.status(500).json({ error: 'Erro interno durante o login com Google.' });
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

    const usuarioSemSenha = usuarioPublico(usuario);
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
        const username = req.body?.username === undefined ? undefined : normalizarUsername(req.body.username);

        // Nome só é validado se veio na requisição — assim dá pra trocar só a
        // foto sem precisar reenviar o nome, e vice-versa.
        if (name !== undefined) {
            if (typeof name !== 'string' || name.trim().length < 2) {
                return res.status(400).json({ error: "Nome precisa ter ao menos 2 caracteres" });
            }
        }

        if (username !== undefined && !usernameValido(username)) {
            return res.status(400).json({ error: 'O username deve ter de 3 a 24 caracteres: letras, números ou _.' });
        }

        if (avatarUrl !== undefined && avatarUrl !== null
            && (typeof avatarUrl !== 'string' || avatarUrl.length > 2048)) {
            return res.status(400).json({ error: "A URL da foto é inválida" });
        }

        // E-mail não entra aqui de propósito: trocar e-mail é o identificador
        // de login, exige confirmação por e-mail pra não perder a conta.
        const usuarioAtualizado = await prisma.user.update({
            where: { id: userId },
            data: {
                name: name?.trim() ?? undefined,
                username,
                // null explícito = remover a foto; undefined = não mexer.
                avatarUrl: avatarUrl === undefined ? undefined : avatarUrl,
            },
        });

        const usuarioSemSenha = usuarioPublico(usuarioAtualizado);
        return res.status(200).json(usuarioSemSenha);
    } catch (error) {
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
            return res.status(409).json({ error: 'Esse username já está em uso.' });
        }
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
        if (!usuario.password) {
            return res.status(400).json({ error: "Esta conta não possui senha local configurada." });
        }

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

export { Cadastro, Login, LoginGoogle, getMe, updateProfile, changePassword };

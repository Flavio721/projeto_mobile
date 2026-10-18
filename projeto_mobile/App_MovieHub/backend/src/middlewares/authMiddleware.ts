import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não enviado" });
  }

  const match = /^Bearer ([^\s]+)$/i.exec(authHeader);
  if (!match) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(503).json({ error: "Autenticação indisponível." });
    const payload = jwt.verify(match[1]!, secret, { algorithms: ["HS256"] });
    if (typeof payload === "string" || typeof payload.userId !== "string") {
      return res.status(401).json({ error: "Token inválido ou expirado" });
    }
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}

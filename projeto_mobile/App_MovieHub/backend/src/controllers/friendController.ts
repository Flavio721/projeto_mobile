import type { Response } from 'express';
import { FriendshipStatus, MovieStatus } from '../../generated/prisma/enums.js';
import { prisma } from '../lib/prisma.js';
import type { AuthRequest } from '../middlewares/authMiddleware.js';

const contactSelect = { id: true, name: true, email: true, avatarUrl: true } as const;
const privacyKeys = ['shareWatched', 'shareWatchlist', 'shareFavorites', 'shareReviews', 'shareRecent'] as const;

function currentUserId(req: AuthRequest, res: Response): string | null {
  if (!req.userId) {
    res.status(401).json({ error: 'Erro de autenticação.' });
    return null;
  }
  return req.userId;
}

const getFriends = async (req: AuthRequest, res: Response) => {
  const userId = currentUserId(req, res);
  if (!userId) return;

  try {
    const relations = await prisma.friendship.findMany({
      where: {
        OR: [{ requesterId: userId }, { addresseeId: userId }],
      },
      include: {
        requester: { select: contactSelect },
        addressee: { select: contactSelect },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const friends = relations
      .filter((relation) => relation.status === FriendshipStatus.ACCEPTED)
      .map((relation) => ({
        id: relation.id,
        user: relation.requesterId === userId ? relation.addressee : relation.requester,
        createdAt: relation.updatedAt,
      }));
    const incomingRequests = relations
      .filter((relation) => relation.status === FriendshipStatus.PENDING && relation.addresseeId === userId)
      .map((relation) => ({ id: relation.id, user: relation.requester, createdAt: relation.createdAt }));
    const outgoingRequests = relations
      .filter((relation) => relation.status === FriendshipStatus.PENDING && relation.requesterId === userId)
      .map((relation) => ({ id: relation.id, user: relation.addressee, createdAt: relation.createdAt }));

    return res.json({ friends, incomingRequests, outgoingRequests });
  } catch (error) {
    console.error('Erro ao carregar amizades:', error);
    return res.status(500).json({ error: 'Não foi possível carregar seus amigos.' });
  }
};

const sendFriendRequest = async (req: AuthRequest, res: Response) => {
  const userId = currentUserId(req, res);
  if (!userId) return;

  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Informe um e-mail válido.' });
  }

  try {
    const target = await prisma.user.findUnique({ where: { email }, select: contactSelect });
    if (!target) return res.status(404).json({ error: 'Não encontramos uma conta com esse e-mail.' });
    if (target.id === userId) return res.status(400).json({ error: 'Você não pode adicionar a si mesmo.' });

    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: userId, addresseeId: target.id },
          { requesterId: target.id, addresseeId: userId },
        ],
      },
    });
    if (existing?.status === FriendshipStatus.ACCEPTED) {
      return res.status(409).json({ error: 'Vocês já são amigos.' });
    }
    if (existing?.status === FriendshipStatus.PENDING) {
      return res.status(409).json({
        error: existing.requesterId === userId
          ? 'Você já enviou uma solicitação para essa pessoa.'
          : 'Essa pessoa já enviou uma solicitação. Confira suas solicitações recebidas.',
      });
    }

    const request = await prisma.friendship.create({
      data: { requesterId: userId, addresseeId: target.id },
    });
    return res.status(201).json({ id: request.id, user: target, createdAt: request.createdAt });
  } catch (error) {
    console.error('Erro ao enviar solicitação de amizade:', error);
    return res.status(500).json({ error: 'Não foi possível enviar a solicitação.' });
  }
};

const acceptFriendRequest = async (req: AuthRequest, res: Response) => {
  const userId = currentUserId(req, res);
  if (!userId) return;
  const rawId = req.params.id;
  const id = Number(Array.isArray(rawId) ? rawId[0] : rawId);
  if (!Number.isSafeInteger(id) || id <= 0) return res.status(400).json({ error: 'Solicitação inválida.' });

  try {
    const result = await prisma.friendship.updateMany({
      where: { id, addresseeId: userId, status: FriendshipStatus.PENDING },
      data: { status: FriendshipStatus.ACCEPTED },
    });
    if (result.count === 0) return res.status(404).json({ error: 'Solicitação não encontrada.' });

    const accepted = await prisma.friendship.findUnique({
      where: { id },
      include: { requester: { select: contactSelect } },
    });
    return res.json({ id, user: accepted?.requester, status: FriendshipStatus.ACCEPTED });
  } catch (error) {
    console.error('Erro ao aceitar solicitação de amizade:', error);
    return res.status(500).json({ error: 'Não foi possível aceitar a solicitação.' });
  }
};

const removeFriendship = async (req: AuthRequest, res: Response) => {
  const userId = currentUserId(req, res);
  if (!userId) return;
  const rawId = req.params.id;
  const id = Number(Array.isArray(rawId) ? rawId[0] : rawId);
  if (!Number.isSafeInteger(id) || id <= 0) return res.status(400).json({ error: 'Amizade inválida.' });

  try {
    const result = await prisma.friendship.deleteMany({
      where: { id, OR: [{ requesterId: userId }, { addresseeId: userId }] },
    });
    if (result.count === 0) return res.status(404).json({ error: 'Solicitação ou amizade não encontrada.' });
    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao remover amizade:', error);
    return res.status(500).json({ error: 'Não foi possível remover a amizade.' });
  }
};

const getPrivacy = async (req: AuthRequest, res: Response) => {
  const userId = currentUserId(req, res);
  if (!userId) return;
  try {
    const privacy = await prisma.user.findUnique({
      where: { id: userId },
      select: { shareWatched: true, shareWatchlist: true, shareFavorites: true, shareReviews: true, shareRecent: true },
    });
    if (!privacy) return res.status(404).json({ error: 'Usuário não encontrado.' });
    return res.json(privacy);
  } catch (error) {
    console.error('Erro ao carregar privacidade:', error);
    return res.status(500).json({ error: 'Não foi possível carregar suas preferências.' });
  }
};

const updatePrivacy = async (req: AuthRequest, res: Response) => {
  const userId = currentUserId(req, res);
  if (!userId) return;
  const body = req.body && typeof req.body === 'object' ? req.body as Record<string, unknown> : {};
  const updates: Partial<Record<(typeof privacyKeys)[number], boolean>> = {};

  for (const key of privacyKeys) {
    if (body[key] !== undefined) {
      if (typeof body[key] !== 'boolean') return res.status(400).json({ error: 'As opções de privacidade devem ser booleanas.' });
      updates[key] = body[key];
    }
  }
  if (Object.keys(updates).length === 0) return res.status(400).json({ error: 'Informe ao menos uma preferência de privacidade.' });

  try {
    const privacy = await prisma.user.update({
      where: { id: userId },
      data: updates,
      select: { shareWatched: true, shareWatchlist: true, shareFavorites: true, shareReviews: true, shareRecent: true },
    });
    return res.json(privacy);
  } catch (error) {
    console.error('Erro ao atualizar privacidade:', error);
    return res.status(500).json({ error: 'Não foi possível salvar suas preferências.' });
  }
};

const getFriendActivity = async (req: AuthRequest, res: Response) => {
  const userId = currentUserId(req, res);
  if (!userId) return;
  const rawFriendId = req.params.userId;
  const friendId = Array.isArray(rawFriendId) ? rawFriendId[0] : rawFriendId;
  if (!friendId || friendId === userId) return res.status(400).json({ error: 'Amigo inválido.' });

  try {
    const relation = await prisma.friendship.findFirst({
      where: {
        status: FriendshipStatus.ACCEPTED,
        OR: [
          { requesterId: userId, addresseeId: friendId },
          { requesterId: friendId, addresseeId: userId },
        ],
      },
    });
    if (!relation) return res.status(403).json({ error: 'A atividade só está disponível entre amigos.' });

    const friend = await prisma.user.findUnique({
      where: { id: friendId },
      select: {
        ...contactSelect,
        shareWatched: true,
        shareWatchlist: true,
        shareFavorites: true,
        shareReviews: true,
        shareRecent: true,
      },
    });
    if (!friend) return res.status(404).json({ error: 'Amigo não encontrado.' });

    const visibleStatuses: MovieStatus[] = [];
    if (friend.shareWatched) visibleStatuses.push(MovieStatus.WATCHED);
    if (friend.shareWatchlist) visibleStatuses.push(MovieStatus.WATCHLIST);
    const entries = visibleStatuses.length
      ? await prisma.userMovie.findMany({
          where: { userId: friendId, status: { in: visibleStatuses } },
          include: { movie: true },
          orderBy: friend.shareRecent ? [{ updatedAt: 'desc' }, { id: 'desc' }] : [{ id: 'asc' }],
        })
      : null;

    const activities = (entries ?? []).map((entry) => ({
      tmdbId: entry.movie.tmdbId,
      title: entry.movie.title,
      posterPath: entry.movie.posterPath,
      releaseDate: entry.movie.releaseDate,
      status: entry.status,
      isFavorite: friend.shareFavorites && entry.isFavorite,
      rating: friend.shareReviews ? entry.rating : null,
      comment: friend.shareReviews ? entry.comment : null,
      watchedAt: friend.shareRecent ? entry.watchedAt : null,
      updatedAt: friend.shareRecent ? entry.updatedAt : null,
    }));

    return res.json({
      user: { id: friend.id, name: friend.name, avatarUrl: friend.avatarUrl },
      privacy: {
        watched: friend.shareWatched,
        watchlist: friend.shareWatchlist,
        favorites: friend.shareFavorites,
        reviews: friend.shareReviews,
        recent: friend.shareRecent,
      },
      movies: activities,
      recentActivity: friend.shareRecent ? activities.slice(0, 10) : [],
    });
  } catch (error) {
    console.error('Erro ao carregar atividade do amigo:', error);
    return res.status(500).json({ error: 'Não foi possível carregar a atividade deste amigo.' });
  }
};

export { getFriends, sendFriendRequest, acceptFriendRequest, removeFriendship, getPrivacy, updatePrivacy, getFriendActivity };

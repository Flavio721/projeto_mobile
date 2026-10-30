import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Text from '../components/TextoLocalizado';
import FilmeCard from '../components/FilmeCards/FilmeCard';
import type { Filme } from '../../types/Filme';
import { useTema, useStyles } from '../../contexts/TemaContext';
import { useIdioma } from '../../contexts/IdiomaContext';
import { useToast } from '../../contexts/ToastContext';
import { buscarItem } from '../../lib/storage';
import type { MainStackParamList } from '../../navigation/MainStack';
import criarStyles from './styles';
import { normalizarUrlImagem } from '../../lib/uploadImagem';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w185';

type ProfileMovie = {
  tmdbId: number;
  title: string;
  posterPath?: string | null;
  releaseDate?: string | null;
  genres: string[];
  voteAverage?: number | null;
  rating?: number | null;
  comment?: string | null;
  watchedAt?: string | null;
};
type ProfileBook = {
  googleBooksId: string;
  title: string;
  authors: string[];
  coverUrl?: string | null;
  publishedDate?: string | null;
  pageCount?: number | null;
  categories: string[];
  status: 'WANT_TO_READ' | 'READING' | 'READ' | 'PAUSED';
  rating?: number | null;
  comment?: string | null;
};
type ProfileData = {
  user: { name: string; username: string; avatarUrl?: string | null };
  privacy: { watched: boolean; favorites: boolean; reviews: boolean; books?: boolean };
  // The field may be absent while the backend deployment is still on an older version.
  tree?: { visible: boolean; watchedCount: number | null };
  latestWatched: ProfileMovie[];
  favorites: ProfileMovie[];
  books?: ProfileBook[];
};

const MARCOS_ARVORE = [0, 1, 3, 5, 10, 20, 35, 50];

function paraFilme(movie: ProfileMovie): Filme {
  return {
    id: String(movie.tmdbId),
    titulo: movie.title,
    posterUri: movie.posterPath ? `${IMAGE_BASE}${movie.posterPath}` : undefined,
    ano: movie.releaseDate ? Number(movie.releaseDate.slice(0, 4)) || 0 : 0,
    genero: movie.genres.join(', ') || '—',
    nota: movie.rating ?? 0,
    tmdbRating: movie.voteAverage ?? null,
    comentario: null,
    assistidoEm: movie.watchedAt ?? null,
    naLista: false,
    status: 'WATCHED',
    favorito: false,
  };
}

export default function AmigoAtividadeScreen() {
  const styles = useStyles(criarStyles);
  const { cores } = useTema();
  const { traduzir, idiomaTmdb } = useIdioma();
  const { showError } = useToast();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const route = useRoute<RouteProp<MainStackParamList, 'AmigoAtividade'>>();
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [avatarComErro, setAvatarComErro] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const token = await buscarItem('token');
      if (!token) throw new Error('Sessão expirada. Faça login novamente.');
      const response = await fetch(`${API_BASE_URL}/friends/${encodeURIComponent(route.params.userId)}/profile?language=${idiomaTmdb}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Não foi possível carregar o perfil deste usuário.');
      setData(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível carregar o perfil deste usuário.';
      setLoadError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  }, [route.params.userId, showError, idiomaTmdb]);

  useFocusEffect(useCallback(() => { void load(); }, [load]));

  const renderMovieList = (title: string, movies: ProfileMovie[], visible: boolean) => (
    <View style={styles.profileSection}>
      <Text style={[styles.sectionHeading, { color: cores.text }]}>{traduzir(title)}</Text>
      {!visible ? (
        <Text style={[styles.empty, { color: cores.muted }]}>{traduzir('Esta lista está oculta pelas configurações de privacidade.')}</Text>
      ) : movies.length ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.movieList}>
          {movies.map((item) => {
            const filme = paraFilme(item);
            return <FilmeCard
              key={item.tmdbId}
              filme={filme}
              showFavoriteButton={false}
              onToggleFavorito={() => undefined}
              onPress={() => navigation.navigate('AmigoResenha', {
                kind: 'movie',
                title: item.title,
                creator: item.releaseDate?.slice(0, 4) ?? '',
                coverUrl: item.posterPath ? `${IMAGE_BASE}${item.posterPath}` : null,
                rating: data?.privacy.reviews ? item.rating : null,
                comment: data?.privacy.reviews ? item.comment : null,
                reviewerName: data?.user.name ?? '',
                reviewsVisible: data?.privacy.reviews ?? false,
              })}
            />;
          })}
        </ScrollView>
      ) : (
        <Text style={[styles.empty, { color: cores.muted }]}>{traduzir('Nenhum filme nesta lista ainda.')}</Text>
      )}
    </View>
  );

  const renderBooks = (books: ProfileBook[], visible: boolean) => (
    <View style={styles.profileSection}>
      <Text style={[styles.sectionHeading, { color: cores.text }]}>{traduzir('Biblioteca de livros')}</Text>
      {!visible ? (
        <Text style={[styles.empty, { color: cores.muted }]}>{traduzir('Esta lista está oculta pelas configurações de privacidade.')}</Text>
      ) : books.length ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bookCarousel}>
          {books.map((book) => (
            <TouchableOpacity
              key={book.googleBooksId}
              accessibilityRole="button"
              accessibilityLabel={`${traduzir('Resenha de livro')}: ${book.title}`}
              onPress={() => navigation.navigate('AmigoResenha', {
                kind: 'book',
                title: book.title,
                creator: book.authors?.join(', ') || traduzir('Autor não informado'),
                coverUrl: book.coverUrl,
                rating: data?.privacy.reviews ? book.rating : null,
                comment: data?.privacy.reviews ? book.comment : null,
                reviewerName: data?.user.name ?? '',
                reviewsVisible: data?.privacy.reviews ?? false,
              })}
              style={[styles.bookTile, { backgroundColor: cores.surface, borderColor: cores.border }]}
            >
              {book.coverUrl ? <Image source={{ uri: book.coverUrl }} style={styles.bookCover} /> : (
                <View style={[styles.bookCover, styles.bookCoverFallback, { backgroundColor: cores.card }]}><Ionicons name="book-outline" size={26} color={cores.muted} /></View>
              )}
              <Text style={[styles.bookTitle, { color: cores.text }]} numberOfLines={2}>{book.title}</Text>
              <Text style={[styles.bookAuthor, { color: cores.muted }]} numberOfLines={1}>{book.authors?.join(', ') || traduzir('Autor não informado')}</Text>
              <Text style={[styles.bookStatus, { color: cores.gold }]}>{traduzir(({ WANT_TO_READ: 'Quero ler', READING: 'Lendo', READ: 'Lido', PAUSED: 'Pausado' } as const)[book.status])}</Text>
              {typeof book.rating === 'number' ? (
                <View style={styles.bookRatingRow}>
                  <Ionicons name="star" size={13} color={cores.gold} />
                  <Text style={[styles.bookReview, { color: cores.text }]}>{book.rating}/5</Text>
                </View>
              ) : null}
              {book.comment ? <Text style={[styles.bookReview, { color: cores.muted }]} numberOfLines={4}>{book.comment}</Text> : null}
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <Text style={[styles.empty, { color: cores.muted }]}>{traduzir('Nenhum livro nesta lista ainda.')}</Text>
      )}
    </View>
  );

  const renderFriendTree = () => {
    if (!data) return null;
    const arvoreVisivel = data.tree?.visible ?? data.privacy.watched;
    const countFromApi = data.tree?.watchedCount;
    const countIsValid = typeof countFromApi === 'number' && Number.isFinite(countFromApi) && countFromApi >= 0;
    const filmesRecentes = Array.isArray(data.latestWatched) ? data.latestWatched : [];

    if (!arvoreVisivel) {
      return (
        <View style={[styles.treeCard, { backgroundColor: cores.surface, borderColor: cores.border }]}>
          <View style={styles.treeHeadingRow}>
            <Ionicons name="leaf-outline" size={20} color={cores.success} />
            <Text style={[styles.treeHeading, { color: cores.text }]}>{traduzir('Árvore de filmes')}</Text>
          </View>
          <Text style={[styles.empty, { color: cores.muted }]}>{traduzir('A árvore está oculta pelas configurações de privacidade.')}</Text>
        </View>
      );
    }

    // A profile response from an older backend may not include the exact total.
    // In that case use the visible recent list as a lower bound; it is capped at 10.
    const contagemParcial = !countIsValid;
    const assistidos = countIsValid ? countFromApi : filmesRecentes.length;
    const marcoAtual = [...MARCOS_ARVORE].reverse().find((marco) => assistidos >= marco) ?? 0;
    const proximoMarco = MARCOS_ARVORE.find((marco) => marco > assistidos);
    const percentual = proximoMarco === undefined ? 1 : (assistidos - marcoAtual) / (proximoMarco - marcoAtual);
    const emojiArvore = assistidos === 0 ? '🌱' : assistidos < 5 ? '🌿' : '🌳';
    const flores = Math.min(Math.floor(assistidos / 5), 6);

    return (
      <View style={[styles.treeCard, { backgroundColor: cores.surface, borderColor: cores.border }]}>
        <View style={styles.treeHeadingRow}>
          <Ionicons name="leaf-outline" size={20} color={cores.success} />
          <Text style={[styles.treeHeading, { color: cores.text }]}>{traduzir('Árvore de filmes')}</Text>
        </View>
        <View style={[styles.friendTreeScene, { backgroundColor: cores.successSurface }]}>
          <View style={styles.friendTreeHills} />
          <Text style={styles.friendTreeEmoji}>{emojiArvore}</Text>
          {Array.from({ length: flores }, (_, index) => (
            <Text key={index} style={[styles.friendTreeFlower, index % 2 ? styles.friendTreeFlowerRight : styles.friendTreeFlowerLeft]}>{index % 2 ? '🌸' : '🌼'}</Text>
          ))}
        </View>
        <View style={styles.treeCountRow}>
          <Text style={[styles.treeCount, { color: cores.text }]}>{contagemParcial && assistidos === 10 ? '10+' : assistidos}</Text>
          <Text style={[styles.treeCountLabel, { color: cores.muted }]}>{traduzir('Filmes assistidos')}</Text>
        </View>
        <View style={[styles.treeProgressTrack, { backgroundColor: cores.card }]}>
          <View style={[styles.treeProgressFill, { backgroundColor: cores.success, width: `${Math.max(0, Math.min(100, percentual * 100))}%` }]} />
        </View>
        <Text style={[styles.treeProgressLabel, { color: cores.muted }]}>
          {proximoMarco === undefined
            ? traduzir('Árvore completa! Continue registrando filmes para mantê-la florida.')
            : `${traduzir('Próximo marco')}: ${proximoMarco} · ${proximoMarco - assistidos} ${traduzir('Mais filmes para o próximo estágio')}`}
        </Text>
        {contagemParcial ? <Text style={[styles.treeProgressLabel, { color: cores.muted }]}>{traduzir('Contagem baseada nos filmes visíveis do perfil; pode ser parcial.')}</Text> : null}
      </View>
    );
  };

  return <SafeAreaView style={[styles.safeArea, { backgroundColor: cores.background }]}>
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}><Ionicons name="arrow-back" size={21} color={cores.text} /></TouchableOpacity>
        <Text style={[styles.title, { color: cores.text }]}>{traduzir('Perfil')}</Text>
        <View style={styles.headerSpacer} />
      </View>
      {loading ? <ActivityIndicator style={styles.loader} color={cores.gold} /> : data ? <>
        <View style={styles.publicProfileHeader}>
          {data.user.avatarUrl && !avatarComErro ? <Image source={{ uri: normalizarUrlImagem(data.user.avatarUrl) }} style={styles.publicAvatar} onError={() => setAvatarComErro(true)} /> : (
            <View style={[styles.publicAvatar, styles.avatarFallback, { backgroundColor: cores.posterFallback }]}><Ionicons name="person" size={28} color={cores.muted} /></View>
          )}
          <Text style={[styles.publicName, { color: cores.text }]}>{data.user.name}</Text>
          <Text style={[styles.publicUsername, { color: cores.muted }]}>@{data.user.username}</Text>
        </View>
        {renderFriendTree()}
        {renderMovieList('Últimos filmes vistos', data.latestWatched, data.privacy.watched)}
        {renderMovieList('Favoritos', data.favorites, data.privacy.favorites)}
        {renderBooks(Array.isArray(data.books) ? data.books : [], data.privacy.books ?? false)}
      </> : loadError ? (
        <View style={styles.loadErrorCard}>
          <Text style={[styles.empty, { color: cores.muted }]}>{traduzir(loadError)}</Text>
          <TouchableOpacity onPress={() => void load()} style={styles.retryButton} accessibilityRole="button">
            <Text style={[styles.retryText, { color: cores.gold }]}>{traduzir('Tentar novamente')}</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </ScrollView>
  </SafeAreaView>;
}

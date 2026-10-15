import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Text from '../components/TextoLocalizado';
import { useTema, useStyles } from '../../contexts/TemaContext';
import { useIdioma } from '../../contexts/IdiomaContext';
import { useToast } from '../../contexts/ToastContext';
import { buscarItem } from '../../lib/storage';
import type { MainStackParamList } from '../../navigation/MainStack';
import criarStyles from './styles';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
type ActivityMovie = { tmdbId: number; title: string; posterPath?: string | null; status: 'WATCHED' | 'WATCHLIST'; isFavorite: boolean; rating?: number | null; comment?: string | null; watchedAt?: string | null };
type ActivityData = { user: { name: string; avatarUrl?: string | null }; movies: ActivityMovie[] };
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w185';

export default function AmigoAtividadeScreen() {
  const styles = useStyles(criarStyles);
  const { cores } = useTema();
  const { traduzir } = useIdioma();
  const { showError } = useToast();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const route = useRoute<RouteProp<MainStackParamList, 'AmigoAtividade'>>();
  const [data, setData] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const token = await buscarItem('token');
      if (!token) throw new Error('Sessão expirada. Faça login novamente.');
      const response = await fetch(`${API_BASE_URL}/friends/${encodeURIComponent(route.params.userId)}/activity`, { headers: { Authorization: `Bearer ${token}` } });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Não foi possível carregar a atividade deste amigo.');
      setData(result);
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Não foi possível carregar a atividade deste amigo.');
    } finally { setLoading(false); }
  }, [route.params.userId, showError]);
  useFocusEffect(useCallback(() => { void load(); }, [load]));

  return <SafeAreaView style={[styles.safeArea, { backgroundColor: cores.background }]}>
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}><Ionicons name="arrow-back" size={21} color={cores.text} /></TouchableOpacity>
        <Text style={[styles.title, { color: cores.text }]}>{data?.user.name ?? route.params.name}</Text><View style={styles.headerSpacer} />
      </View>
      {loading ? <ActivityIndicator style={styles.loader} color={cores.gold} /> : !data?.movies.length ?
        <Text style={[styles.empty, { color: cores.muted }]}>{traduzir('Ainda não há atividade visível deste amigo.')}</Text> : data.movies.map((movie) => (
          <View key={movie.tmdbId} style={[styles.activityRow, { borderBottomColor: cores.border }]}>
            {movie.posterPath ? <Image source={{ uri: `${IMAGE_BASE}${movie.posterPath}` }} style={styles.poster} /> : <View style={[styles.poster, styles.posterFallback, { backgroundColor: cores.posterFallback }]}><Ionicons name="film-outline" size={22} color={cores.muted} /></View>}
            <View style={styles.activityInfo}>
              <Text style={[styles.movieTitle, { color: cores.text }]}>{movie.title}</Text>
              <View style={[styles.badge, { backgroundColor: cores.card }]}><Text style={[styles.badgeText, { color: cores.muted }]}>{traduzir(movie.status === 'WATCHED' ? 'Assistido' : 'Quero assistir')}</Text></View>
              {movie.isFavorite ? <Text style={[styles.detail, { color: cores.gold }]}>{traduzir('Favorito')}</Text> : null}
              {movie.rating != null ? <Text style={[styles.detail, { color: cores.text }]}>{'★'.repeat(movie.rating)}{'☆'.repeat(5 - movie.rating)}</Text> : null}
              {movie.watchedAt ? <Text style={[styles.detail, { color: cores.muted }]}>{traduzir('Assistido em')} {new Date(movie.watchedAt).toLocaleDateString()}</Text> : null}
              {movie.comment ? <Text style={[styles.comment, { color: cores.muted }]}>{movie.comment}</Text> : null}
            </View>
          </View>
        ))}
    </ScrollView>
  </SafeAreaView>;
}

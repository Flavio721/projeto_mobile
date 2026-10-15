import Text from '../components/TextoLocalizado';
import { useStyles, useTema } from '../../contexts/TemaContext';
import React, { useCallback, useState } from 'react';
import { View, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import criarStyles from './styles';
import LoadingOverlay from '../components/LoadingOverlay';
import { buscarItem } from '../../lib/storage';
import type { MainStackParamList } from '../../navigation/MainStack';
import { useToast } from '../../contexts/ToastContext';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const EMOJI_POR_GENERO: Record<string, string> = {
  'Ação': '⭐',
  'Aventura': '🗺️',
  'Comédia': '😊',
  'Drama': '🎭',
  'Ficção Científica': '🚀',
  'Terror': '💀',
  'Suspense': '👁️',
  'Romance': '❤️',
  'Animação': '🎥',
  'Documentário': '📄',
  'Fantasia': '🧙',
  'Crime': '🕵️',
};
const EMOJI_PADRAO = '🎬';

interface GeneroContagem {
  nome: string;
  quantidade: number;
}

type GenerosNavigationProp = NativeStackNavigationProp<MainStackParamList>;

export default function Generos() {
  const styles = useStyles(criarStyles);
  const { cores } = useTema();
  const { showError } = useToast();
  const navigation = useNavigation<GenerosNavigationProp>();
  const [generos, setGeneros] = useState<GeneroContagem[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarGeneros = useCallback(async () => {
    setCarregando(true);
    try {
      const token = await buscarItem('token');
      if (!token) {
        setGeneros([]);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/movies/genres`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error ?? 'Não foi possível carregar os gêneros da sua lista.');
      }

      const data = await response.json() as { results?: { name: string; count: number }[] };
      setGeneros((data.results ?? []).map(({ name, count }) => ({ nome: name, quantidade: count })));
    } catch (error) {
      console.error('Erro ao carregar gêneros:', error);
      setGeneros([]);
      showError(error instanceof Error ? error.message : 'Não foi possível carregar os gêneros da sua lista.');
    } finally {
      setCarregando(false);
    }
  }, [showError]);

  useFocusEffect(
    useCallback(() => {
      carregarGeneros();
    }, [carregarGeneros]),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <LoadingOverlay visible={carregando} message="Carregando gêneros..." />
      <View style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color={cores.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Gêneros</Text>
          </View>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Pesquisa')}>
            <Ionicons name="search-outline" size={22} color={cores.text} />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Selecione um gênero</Text>

        <FlatList
          data={generos}
          keyExtractor={(item) => item.nome}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.row}
              onPress={() => navigation.navigate('Pesquisa', { generoInicial: item.nome })}
            >
              <View style={styles.emojiCircle}>
                <Text style={styles.emoji}>{EMOJI_POR_GENERO[item.nome] ?? EMOJI_PADRAO}</Text>
              </View>
              <View style={styles.rowInfo}>
                <Text style={styles.rowLabel}>{item.nome}</Text>
                <Text style={styles.rowCount}>
                  {item.quantidade} {item.quantidade === 1 ? 'filme' : 'filmes'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={cores.muted} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            !carregando ? (
              <View style={styles.emptyBox}>
                <Ionicons name="film-outline" size={24} color={cores.placeholder} />
                <Text style={styles.emptyText}>Adicione filmes à sua lista para ver as contagens por gênero.</Text>
              </View>
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
}

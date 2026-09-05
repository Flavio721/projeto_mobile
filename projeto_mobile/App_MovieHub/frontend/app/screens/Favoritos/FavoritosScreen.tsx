import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styles, { COLORS } from './styles';
import FilmeCard from '../../components/FilmeCards/FilmeCard';
import LoadingOverlay from '../components/LoadingOverlay';
import { buscarItem } from '../../lib/storage';
import { mapMovieToFilme } from '../../utils/movieMapper';
import type { Filme } from '../../types/Filme';
import type { MainStackParamList } from '../../navigation/MainStack';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

type FavoritosNavigationProp = NativeStackNavigationProp<MainStackParamList>;

export default function FavoritosScreen() {
  const navigation = useNavigation<FavoritosNavigationProp>();
  const [favoritos, setFavoritos] = useState<Filme[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarFavoritos = useCallback(async () => {
    setCarregando(true);
    try {
      const token = await buscarItem('token');
      if (!token) {
        setFavoritos([]);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/movies`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        setFavoritos([]);
        return;
      }

      const data = await response.json();
      const todos: Filme[] = data.map(mapMovieToFilme);
      setFavoritos(todos.filter((f) => f.favorito));
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      setFavoritos([]);
    } finally {
      setCarregando(false);
    }
  }, []);

  // Recarrega toda vez que a aba ganha foco — assim, desfavoritar em
  // qualquer outra tela (Home, Detalhes) já reflete aqui na volta.
  useFocusEffect(
    useCallback(() => {
      carregarFavoritos();
    }, [carregarFavoritos]),
  );

  const handleToggleFavorito = async (id: string) => {
    // Nesta tela, desfavoritar remove o item da lista na hora (é o
    // comportamento esperado de uma tela de "Favoritos").
    setFavoritos((prev) => prev.filter((f) => f.id !== id));

    try {
      const token = await buscarItem('token');
      if (!token) return;
      await fetch(`${API_BASE_URL}/movies/${id}/favorite`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isFavorite: false }),
      });
    } catch (error) {
      console.error('Erro ao desfavoritar:', error);
      // Não recoloca o item de volta automaticamente — na próxima vez que
      // a tela focar, carregarFavoritos() corrige o estado com o servidor.
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LoadingOverlay visible={carregando} message="Carregando favoritos..." />
      <View style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.titleRow}>
            <Ionicons name="heart" size={20} color={COLORS.danger} />
            <Text style={styles.title}>Favoritos</Text>
          </View>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Pesquisa')}>
            <Ionicons name="search-outline" size={22} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>
          {favoritos.length} {favoritos.length === 1 ? 'filme favorito' : 'filmes favoritos'}
        </Text>

        <FlatList
          data={favoritos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.cardSpacing}>
              <FilmeCard
                filme={item}
                onToggleFavorito={handleToggleFavorito}
                onPress={(filme : any) => navigation.navigate('Detalhes', { filmeId: filme.id })}
              />
            </View>
          )}
          ListEmptyComponent={
            !carregando ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyEmoji}>💔</Text>
                <Text style={styles.emptyText}>Você ainda não tem filmes favoritos</Text>
              </View>
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
}
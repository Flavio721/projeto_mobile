import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styles, { COLORS } from './styles';
import LoadingOverlay from '../components/LoadingOverlay';
import { buscarItem } from '../../lib/storage';
import { mapMovieToFilme } from '../../utils/movieMapper';
import type { MainStackParamList } from '../../navigation/MainStack';

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

      const response = await fetch(`${API_BASE_URL}/movies`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        setGeneros([]);
        return;
      }

      const data = await response.json();
      const filmes = data.map(mapMovieToFilme);

      const contagem: Record<string, number> = {};
      filmes.forEach((filme: { genero: string }) => {
        filme.genero.split(',').forEach((nomeCru: string) => {
          const nome = nomeCru.trim();
          if (!nome || nome === '—') return;
          contagem[nome] = (contagem[nome] ?? 0) + 1;
        });
      });

      const lista = Object.entries(contagem)
        .map(([nome, quantidade]) => ({ nome, quantidade }))
        .sort((a, b) => b.quantidade - a.quantidade);

      setGeneros(lista);
    } catch (error) {
      console.error('Erro ao carregar gêneros:', error);
      setGeneros([]);
    } finally {
      setCarregando(false);
    }
  }, []);

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
              <Ionicons name="arrow-back" size={22} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.title}>Gêneros</Text>
          </View>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Pesquisa')}>
            <Ionicons name="search-outline" size={22} color={COLORS.white} />
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
              <Ionicons name="chevron-forward" size={18} color={COLORS.muted} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            !carregando ? (
              <View style={styles.emptyBox}>
                <Ionicons name="film-outline" size={24} color={COLORS.placeholder} />
                <Text style={styles.emptyText}>Nenhum gênero ainda — cadastre um filme primeiro</Text>
              </View>
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
}
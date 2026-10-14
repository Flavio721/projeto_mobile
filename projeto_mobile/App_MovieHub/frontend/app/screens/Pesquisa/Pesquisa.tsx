import TextInput from '../components/CampoTextoLocalizado';
import Text from '../components/TextoLocalizado';
import { useStyles, useTema } from '../../contexts/TemaContext';
import React, { useCallback, useState } from 'react';
import { View, TextInput as NativeTextInput, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import criarStyles from './styles';
import { buscarItem, salvarItem } from '../../lib/storage';
import { mapMovieToFilme } from '../../utils/movieMapper';
import type { Filme } from '../../types/Filme';
import type { MainStackParamList } from '../../navigation/MainStack';
import { useToast } from '../../contexts/ToastContext';
import { useIdioma } from '../../contexts/IdiomaContext';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const RECENT_SEARCHES_KEY = 'recentSearches';
const MAX_RECENT_SEARCHES = 6;
type SearchNavigationProp = NativeStackNavigationProp<MainStackParamList>;

export default function Pesquisa() {
  const styles = useStyles(criarStyles);
  const { cores } = useTema();
  const { idiomaTmdb } = useIdioma();
  const navigation = useNavigation<SearchNavigationProp>();
  const { showError } = useToast();
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [results, setResults] = useState<Filme[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useFocusEffect(useCallback(() => {
    buscarItem(RECENT_SEARCHES_KEY).then((saved) => {
      if (!saved) {
        setRecentSearches([]);
        return;
      }
      try {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.every((item) => typeof item === 'string')) setRecentSearches(parsed);
      } catch {
        setRecentSearches([]);
      }
    });
  }, []));

  const saveRecent = useCallback(async (term: string) => {
    const updated = [term, ...recentSearches.filter((item) => item.toLowerCase() !== term.toLowerCase())].slice(0, MAX_RECENT_SEARCHES);
    setRecentSearches(updated);
    await salvarItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  }, [recentSearches]);

  const search = useCallback(async (rawTerm: string) => {
    const term = rawTerm.trim();
    if (!term) return;
    setQuery(term);
    setActiveQuery(term);
    setResults([]);
    setPage(1);
    setTotalPages(1);
    setLoading(true);
    try {
      const token = await buscarItem('token');
      if (!token) throw new Error('Sua sessão expirou. Entre novamente.');
      const response = await fetch(`${API_BASE_URL}/movies/search?query=${encodeURIComponent(term)}&language=${idiomaTmdb}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error ?? 'Não foi possível pesquisar no catálogo.');
      setResults((data.results ?? []).map(mapMovieToFilme));
      setPage(data.page ?? 1);
      setTotalPages(data.totalPages ?? 1);
      await saveRecent(term);
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Falha de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  }, [idiomaTmdb, saveRecent, showError]);

  const loadMore = async () => {
    if (loadingMore || page >= totalPages || !activeQuery) return;
    setLoadingMore(true);
    try {
      const token = await buscarItem('token');
      if (!token) throw new Error('Sua sessão expirou. Entre novamente.');
      const nextPage = page + 1;
      const response = await fetch(`${API_BASE_URL}/movies/search?query=${encodeURIComponent(activeQuery)}&page=${nextPage}&language=${idiomaTmdb}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error ?? 'Não foi possível carregar mais resultados.');
      setResults((current) => [...current, ...(data.results ?? []).map(mapMovieToFilme)]);
      setPage(data.page ?? nextPage);
      setTotalPages(data.totalPages ?? totalPages);
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Falha de conexão com o servidor.');
    } finally {
      setLoadingMore(false);
    }
  };

  const clearRecents = async () => {
    setRecentSearches([]);
    await salvarItem(RECENT_SEARCHES_KEY, '[]');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={cores.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Pesquisar filmes</Text>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchWrapper}>
            <Ionicons name="search-outline" size={18} color={cores.placeholder} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Digite o título de um filme"
              placeholderTextColor={cores.placeholder}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={() => search(query)}
              returnKeyType="search"
              autoFocus
              maxLength={100}
            />
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={() => search(query)} accessibilityLabel="Pesquisar">
            <Ionicons name="search" size={19} color={cores.text} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.emptyBox}><ActivityIndicator color={cores.gold} /><Text style={styles.emptyText}>Pesquisando no TMDB...</Text></View>
        ) : activeQuery ? (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={<Text style={styles.resultadosTitle}>Resultados para “{activeQuery}” ({results.length})</Text>}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.resultRow} onPress={() => navigation.navigate('Detalhes', { filmeId: item.id })}>
                {item.posterUri ? <Image source={{ uri: item.posterUri }} style={styles.poster} /> : <View style={[styles.poster, styles.posterFallback]}><Ionicons name="film-outline" size={18} color={cores.text} /></View>}
                <View style={styles.resultInfo}>
                  <Text style={styles.resultTitulo} numberOfLines={2}>{item.titulo}</Text>
                  <Text style={styles.resultMeta}>{item.ano || 'Ano indisponível'}</Text>
                  <View style={styles.resultRatingRow}><Ionicons name="star" size={12} color={cores.gold} /><Text style={styles.resultRatingText}>{item.tmdbRating?.toFixed(1) ?? '—'} TMDB</Text></View>
                </View>
                <Ionicons name={item.naLista ? 'bookmark' : 'chevron-forward'} size={18} color={item.naLista ? cores.gold : cores.muted} />
              </TouchableOpacity>
            )}
            ListEmptyComponent={<View style={styles.emptyBox}><Ionicons name="search-outline" size={24} color={cores.placeholder} /><Text style={styles.emptyText}>Nenhum resultado encontrado</Text></View>}
            ListFooterComponent={page < totalPages ? <TouchableOpacity onPress={loadMore} disabled={loadingMore} style={{ padding: 16, alignItems: 'center' }}>{loadingMore ? <ActivityIndicator color={cores.gold} /> : <Text style={{ color: cores.gold, fontWeight: '700' }}>Carregar mais resultados</Text>}</TouchableOpacity> : null}
          />
        ) : (
          <FlatList
            data={[]}
            renderItem={null}
            keyExtractor={() => 'empty'}
            ListHeaderComponent={(
              <>
                {recentSearches.length > 0 && <>
                  <View style={styles.sectionRow}><Text style={styles.sectionTitle}>Buscas recentes</Text><TouchableOpacity onPress={clearRecents}><Text style={styles.limparTudoText}>Limpar tudo</Text></TouchableOpacity></View>
                  <View style={styles.tagsRow}>{recentSearches.map((term) => <TouchableOpacity key={term} style={styles.tag} onPress={() => search(term)}><Text style={styles.tagText}>{term}</Text></TouchableOpacity>)}</View>
                </>}
                <View style={styles.hintBox}><Ionicons name="information-circle-outline" size={20} color={cores.gold} /><View style={styles.hintTextWrapper}><Text style={styles.hintTitle}>Catálogo TMDB</Text><Text style={styles.hintText}>Pesquise pelo título para encontrar filmes e adicioná-los à sua lista.</Text></View></View>
              </>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

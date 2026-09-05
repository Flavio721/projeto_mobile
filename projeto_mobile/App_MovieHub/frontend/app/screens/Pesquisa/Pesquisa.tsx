import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styles, { COLORS } from './styles';
import FiltrosModal from '../components/FiltrosModal/FiltrosModal';
import LoadingOverlay from '../components/LoadingOverlay';
import { buscarItem, salvarItem } from '../../lib/storage';
import { mapMovieToFilme } from '../../utils/movieMapper';
import { FILTROS_PADRAO, filtrosEstaoAtivos } from '../../types/Filtros';
import type { Filtros } from '../../types/Filtros';
import type { Filme } from '../../types/Filme';
import type { MainStackParamList } from '../../navigation/MainStack';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const CHAVE_BUSCAS_RECENTES = 'recentSearches';
const MAX_BUSCAS_RECENTES = 6;

type PesquisaNavigationProp = NativeStackNavigationProp<MainStackParamList>;

export default function Pesquisa() {
  const navigation = useNavigation<PesquisaNavigationProp>();

  const [busca, setBusca] = useState('');
  const [termoAtivo, setTermoAtivo] = useState('');
  const [buscasRecentes, setBuscasRecentes] = useState<string[]>([]);
  const [todosFilmes, setTodosFilmes] = useState<Filme[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_PADRAO);
  const [filtrosVisiveis, setFiltrosVisiveis] = useState(false);

  useEffect(() => {
    (async () => {
      setCarregando(true);
      try {
        const [token, recentesSalvas] = await Promise.all([
          buscarItem('token'),
          buscarItem(CHAVE_BUSCAS_RECENTES),
        ]);

        if (recentesSalvas) {
          try {
            setBuscasRecentes(JSON.parse(recentesSalvas));
          } catch {
            setBuscasRecentes([]);
          }
        }

        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/movies`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setTodosFilmes(data.map(mapMovieToFilme));
        }
      } catch (error) {
        console.error('Erro ao carregar filmes pra pesquisa:', error);
      } finally {
        setCarregando(false);
      }
    })();
  }, []);

  const salvarBuscaRecente = useCallback(async (termo: string) => {
    const termoLimpo = termo.trim();
    if (!termoLimpo) return;

    setBuscasRecentes((prev) => {
      const semDuplicata = prev.filter((t) => t.toLowerCase() !== termoLimpo.toLowerCase());
      const atualizado = [termoLimpo, ...semDuplicata].slice(0, MAX_BUSCAS_RECENTES);
      salvarItem(CHAVE_BUSCAS_RECENTES, JSON.stringify(atualizado));
      return atualizado;
    });
  }, []);

  const removerBuscaRecente = useCallback((termo: string) => {
    setBuscasRecentes((prev) => {
      const atualizado = prev.filter((t) => t !== termo);
      salvarItem(CHAVE_BUSCAS_RECENTES, JSON.stringify(atualizado));
      return atualizado;
    });
  }, []);

  const limparBuscasRecentes = useCallback(() => {
    setBuscasRecentes([]);
    salvarItem(CHAVE_BUSCAS_RECENTES, JSON.stringify([]));
  }, []);

  const handleSubmit = () => {
    if (!busca.trim()) return;
    setTermoAtivo(busca.trim());
    salvarBuscaRecente(busca.trim());
  };

  const handleTagPress = (termo: string) => {
    setBusca(termo);
    setTermoAtivo(termo);
  };

  const resultados = useMemo(() => {
    const termo = termoAtivo.trim().toLowerCase();

    let lista = todosFilmes.filter((filme) => {
      if (termo) {
        const bateTexto =
          filme.titulo.toLowerCase().includes(termo) ||
          filme.genero.toLowerCase().includes(termo) ||
          (filme.diretor ?? '').toLowerCase().includes(termo);
        if (!bateTexto) return false;
      }

      if (filtros.genero && !filme.genero.toLowerCase().includes(filtros.genero.toLowerCase())) {
        return false;
      }
      if (filtros.status !== 'todos' && filme.status !== filtros.status) {
        return false;
      }
      if (filtros.anoMin && filme.ano < Number(filtros.anoMin)) {
        return false;
      }
      if (filtros.anoMax && filme.ano > Number(filtros.anoMax)) {
        return false;
      }
      if (filtros.notaMinima > 0 && filme.nota < filtros.notaMinima) {
        return false;
      }
      if (filtros.apenasFavoritos && !filme.favorito) {
        return false;
      }

      return true;
    });

    switch (filtros.ordenarPor) {
      case 'nota':
        lista = [...lista].sort((a, b) => b.nota - a.nota);
        break;
      case 'titulo':
        lista = [...lista].sort((a, b) => a.titulo.localeCompare(b.titulo));
        break;
      case 'ano':
        lista = [...lista].sort((a, b) => b.ano - a.ano);
        break;
      default:
        break; // 'recentes' já é a ordem que veio da API (createdAt desc)
    }

    return lista;
  }, [todosFilmes, termoAtivo, filtros]);

  const mostrandoResultados = termoAtivo.trim().length > 0 || filtrosEstaoAtivos(filtros);

  return (
    <SafeAreaView style={styles.safeArea}>
      <LoadingOverlay visible={carregando} message="Carregando filmes..." />
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.title}>Pesquisar</Text>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchWrapper}>
            <Ionicons name="search-outline" size={18} color={COLORS.placeholder} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar filmes, gêneros ou diretores"
              placeholderTextColor={COLORS.placeholder}
              value={busca}
              onChangeText={setBusca}
              onSubmitEditing={handleSubmit}
              returnKeyType="search"
              autoFocus
            />
          </View>
          <TouchableOpacity
            style={[styles.filterButton, filtrosEstaoAtivos(filtros) && styles.filterButtonActive]}
            onPress={() => setFiltrosVisiveis(true)}
          >
            <Ionicons
              name="funnel-outline"
              size={18}
              color={filtrosEstaoAtivos(filtros) ? '#241C00' : COLORS.white}
            />
          </TouchableOpacity>
        </View>

        {!mostrandoResultados ? (
          <FlatList
            data={[]}
            renderItem={null}
            keyExtractor={() => 'empty'}
            ListHeaderComponent={
              <>
                {buscasRecentes.length > 0 && (
                  <>
                    <View style={styles.sectionRow}>
                      <Text style={styles.sectionTitle}>Buscas recentes</Text>
                      <TouchableOpacity onPress={limparBuscasRecentes}>
                        <Text style={styles.limparTudoText}>Limpar tudo</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.tagsRow}>
                      {buscasRecentes.map((termo) => (
                        <TouchableOpacity
                          key={termo}
                          style={styles.tag}
                          onPress={() => handleTagPress(termo)}
                        >
                          <Text style={styles.tagText}>{termo}</Text>
                          <TouchableOpacity
                            onPress={() => removerBuscaRecente(termo)}
                            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                          >
                            <Ionicons name="close" size={13} color={COLORS.muted} />
                          </TouchableOpacity>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </>
                )}

                <View style={styles.hintBox}>
                  <Ionicons name="bulb-outline" size={20} color={COLORS.gold} />
                  <View style={styles.hintTextWrapper}>
                    <Text style={styles.hintTitle}>Dica</Text>
                    <Text style={styles.hintText}>
                      Utilize os filtros para refinar sua pesquisa por gênero, ano, nota ou status.
                    </Text>
                  </View>
                </View>
              </>
            }
          />
        ) : (
          <FlatList
            data={resultados}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={
              <Text style={styles.resultadosTitle}>
                {termoAtivo
                  ? `Resultados para "${termoAtivo}" (${resultados.length})`
                  : `${resultados.length} filme${resultados.length === 1 ? '' : 's'} encontrado${resultados.length === 1 ? '' : 's'}`}
              </Text>
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultRow}
                onPress={() => navigation.navigate('Detalhes', { filmeId: item.id })}
              >
                {item.posterUri ? (
                  <Image source={{ uri: item.posterUri }} style={styles.poster} />
                ) : (
                  <View style={[styles.poster, styles.posterFallback]}>
                    <Ionicons name="film-outline" size={18} color={COLORS.white} />
                  </View>
                )}
                <View style={styles.resultInfo}>
                  <Text style={styles.resultTitulo} numberOfLines={1}>{item.titulo}</Text>
                  <Text style={styles.resultMeta}>
                    {item.ano} • {item.genero}
                  </Text>
                  <View style={styles.resultRatingRow}>
                    <Ionicons name="star" size={12} color={COLORS.gold} />
                    <Text style={styles.resultRatingText}>{item.nota.toFixed(1)}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={COLORS.muted} />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Ionicons name="search-outline" size={24} color={COLORS.placeholder} />
                <Text style={styles.emptyText}>Nenhum resultado encontrado</Text>
              </View>
            }
          />
        )}
      </View>

      <FiltrosModal
        visible={filtrosVisiveis}
        filtrosAtuais={filtros}
        onClose={() => setFiltrosVisiveis(false)}
        onAplicar={setFiltros}
      />
    </SafeAreaView>
  );
}
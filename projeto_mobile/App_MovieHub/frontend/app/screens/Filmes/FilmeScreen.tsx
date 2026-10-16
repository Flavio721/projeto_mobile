import TextInput from '../components/CampoTextoLocalizado';
import Text from '../components/TextoLocalizado';
import { useStyles, useTema } from '../../contexts/TemaContext';
import { useState, useCallback, useMemo, useRef } from "react";
import { View, TextInput as NativeTextInput, TouchableOpacity, FlatList } from 'react-native';
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import criarStyles from './styles';
import FilmeCard from "../components/FilmeCards/FilmeCard";
import type { MainStackParamList } from "../../navigation/MainStack";
import type { Filme, StatusFilme } from "../../types/Filme";
import { buscarItem } from "../../lib/storage";
import { mapMovieToFilme } from "../../utils/movieMapper";
import { useIdioma } from '../../contexts/IdiomaContext';

type FilmesNavigationProp = NativeStackNavigationProp<MainStackParamList>;

type FiltroTab = 'todos' | StatusFilme;

const TABS: { key: FiltroTab; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'WATCHED', label: 'Assistidos' },
  { key: 'WATCHLIST', label: 'Quero assistir' },
];

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function FilmesScreen() {
  const styles = useStyles(criarStyles);
  const { cores } = useTema();
  const { idiomaTmdb } = useIdioma();
  const navigation = useNavigation<FilmesNavigationProp>();
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [busca, setBusca] = useState("");
  const [tabAtiva, setTabAtiva] = useState<FiltroTab>("todos");
  const [carregando, setCarregando] = useState(true);

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    try {
      const token = await buscarItem("token");
      if (!token) {
        setFilmes([]);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      const [filmesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/movies?language=${idiomaTmdb}`, { headers }),
        fetch(`${API_BASE_URL}/movies/stats`, { headers }),
      ]);

      if (filmesResponse.ok) {
        const filmesData = await filmesResponse.json();
        setFilmes(filmesData.map(mapMovieToFilme));
      } else {
        console.error("Erro ao buscar filmes:", filmesResponse.status);
        setFilmes([]);
      }
    } catch (error) {
      console.error("Falha de conexão ao carregar Home:", error);
      setFilmes([]);
    } finally {
      setCarregando(false);
    }
  }, [idiomaTmdb]);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [carregarDados]),
  );

  const filmesFiltrados = useMemo(() => {
    return filmes.filter((f) => {
      const bateTab = tabAtiva === 'todos' || f.status === tabAtiva;
      const bateBusca = f.titulo.toLowerCase().includes(busca.toLowerCase());
      return bateTab && bateBusca;
    });
  }, [filmes, tabAtiva, busca]);


  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const handleToggleFavorito = (id: string) => {
    let novoValor = false;

    setFilmes((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        novoValor = !f.favorito;
        return { ...f, favorito: novoValor };
      }),
    );

    if (debounceTimers.current[id]) {
      clearTimeout(debounceTimers.current[id]);
    }
    debounceTimers.current[id] = setTimeout(() => {
      enviarFavoritoParaServidor(id, novoValor);
      delete debounceTimers.current[id];
    }, 500);
  };

  const enviarFavoritoParaServidor = useCallback(async (id: string, valor: boolean) => {
    try {
      const token = await buscarItem("token");
      if (!token) return;

      await fetch(`${API_BASE_URL}/movies/${id}/favorite`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isFavorite: valor }),
      });
      // Não precisamos reagir ao resultado aqui: a UI já foi atualizada
      // de forma otimista, e o próximo carregarDados() (ao focar a tela de
      // novo) corrige qualquer divergência, caso a requisição tenha falhado.
    } catch (error) {
      console.error("Erro ao favoritar:", error);
    }
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filmes</Text>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate("Estatisticas")}
          >
            <Ionicons name="funnel-outline" size={22} color={cores.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchInputWrapper}>
            <Ionicons
              name="search-outline"
              size={18}
              color={cores.placeholder}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar filmes..."
              placeholderTextColor={cores.placeholder}
              value={busca}
              onChangeText={setBusca}
            />
          </View>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => navigation.navigate("Generos")}
          >
            <Ionicons name="options-outline" size={18} color={cores.text} />
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          data={TABS}
          keyExtractor={(item) => item.key}
          showsHorizontalScrollIndicator={false}
          style={styles.tabsRow}
          renderItem={({ item }) => {
            const ativa = item.key === tabAtiva;
            return (
              <TouchableOpacity
                style={[styles.tabButton, ativa && styles.tabButtonActive]}
                onPress={() => setTabAtiva(item.key)}
              >
                <Text style={[styles.tabButtonText, ativa && styles.tabButtonTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        <FlatList
          data={filmesFiltrados}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          horizontal
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
            <View style={styles.emptyBox}>
              <Ionicons name="film-outline" size={26} color={cores.placeholder} />
              <Text style={styles.emptyText}>
                {busca ? 'Nenhum filme encontrado para essa busca' : 'Nenhum filme registrado ainda'}
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

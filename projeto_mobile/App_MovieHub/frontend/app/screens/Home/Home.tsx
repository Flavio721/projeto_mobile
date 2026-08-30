import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import styles, { COLORS } from "./styles";
import FilmeCard from "../../components/FilmeCards/FilmeCard";
import { buscarItem } from "../../lib/storage";
import type { MainStackParamList } from "../../navigation/MainStack";
import type { Filme } from "../../types/Filme";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

interface DashboardStats {
  total: number;
  assistidos: number;
  queroAssistir: number;
  favoritos: number;
}

const STATS_VAZIO: DashboardStats = {
  total: 0,
  assistidos: 0,
  queroAssistir: 0,
  favoritos: 0,
};

// Converte o formato que vem do backend (Movie) pro formato que os
// componentes de tela já usam (Filme) — nomes de campo são diferentes
// dos dois lados (title/titulo, releaseYear/ano, genres[]/genero etc.).
function mapMovieToFilme(movie: any): Filme {
  return {
    id: String(movie.id),
    titulo: movie.title,
    posterUri: movie.coverUrl,
    ano: movie.releaseYear,
    genero: Array.isArray(movie.genres) && movie.genres.length > 0
      ? movie.genres.map((g: any) => g.name).join(", ")
      : "—",
    duracaoMin: movie.duration,
    diretor: movie.director,
    descricao: movie.description,
    nota: Number(movie.rating),
    status: movie.status === "WATCHED" ? "WATCHED" : "WATCHLIST",
    trailerUrl: movie.trailerUrl ?? undefined,
    favorito: movie.isFavorite,
  };
}

type HomeNavigationProp = NativeStackNavigationProp<MainStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavigationProp>();
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [busca, setBusca] = useState("");
  const [userName, setUserName] = useState("");
  const [stats, setStats] = useState<DashboardStats>(STATS_VAZIO);
  const [carregando, setCarregando] = useState(true);

  const favoritos = filmes.filter((f) => f.favorito);

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    try {
      const token = await buscarItem("token");
      if (!token) {
        setFilmes([]);
        setStats(STATS_VAZIO);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      const [filmesResponse, statsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/movies`, { headers }),
        fetch(`${API_BASE_URL}/movies/stats`, { headers }),
      ]);

      if (filmesResponse.ok) {
        const filmesData = await filmesResponse.json();
        setFilmes(filmesData.map(mapMovieToFilme));
      } else {
        console.error("Erro ao buscar filmes:", filmesResponse.status);
        setFilmes([]);
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      } else {
        console.error("Erro ao buscar stats:", statsResponse.status);
        setStats(STATS_VAZIO);
      }
    } catch (error) {
      console.error("Falha de conexão ao carregar Home:", error);
      setFilmes([]);
      setStats(STATS_VAZIO);
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
      buscarItem("userName").then((nome) => setUserName(nome ?? ""));
    }, [carregarDados]),
  );

  const handleToggleFavorito = async (id: string) => {
    // Atualiza a UI imediatamente (otimista), depois confirma com o backend.
    setFilmes((prev) =>
      prev.map((f) => (f.id === id ? { ...f, favorito: !f.favorito } : f)),
    );

    try {
      const token = await buscarItem("token");
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/movies/${id}/favorite`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        // Backend recusou — desfaz a mudança otimista pra não ficar dessincronizado.
        setFilmes((prev) =>
          prev.map((f) => (f.id === id ? { ...f, favorito: !f.favorito } : f)),
        );
      }
    } catch (error) {
      console.error("Erro ao favoritar:", error);
      setFilmes((prev) =>
        prev.map((f) => (f.id === id ? { ...f, favorito: !f.favorito } : f)),
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => alert("Menu em desenvolvimento")}
          >
            <Ionicons name="menu-outline" size={26} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>MovieHub</Text>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => alert("Notificações em desenvolvimento")}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.greeting}>
          Olá{userName ? `, ${userName}` : ""}!
        </Text>
        <Text style={styles.subtitle}>Desfrute dos seus filmes favoritos.</Text>

        <View style={styles.searchRow}>
          <View style={styles.searchWrapper}>
            <Ionicons
              name="search-outline"
              size={18}
              color={COLORS.placeholder}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar filmes..."
              placeholderTextColor={COLORS.placeholder}
              value={busca}
              onChangeText={setBusca}
            />
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("Adicionar")}
          >
            <Ionicons name="add" size={24} color="#241C00" />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.sectionTitle}>Resumo</Text>
          {carregando && (
            <ActivityIndicator size="small" color={COLORS.gold} />
          )}
        </View>
        <View style={styles.summaryRow}>
          <View style={styles.summaryBox}>
            <Ionicons name="film-outline" size={18} color={COLORS.gold} />
            <Text style={styles.summaryNumber}>{stats.total}</Text>
            <Text style={styles.summaryLabel}>Total de filmes</Text>
          </View>
          <View style={styles.summaryBox}>
            <Ionicons
              name="checkmark-circle-outline"
              size={18}
              color="#3DDC97"
            />
            <Text style={styles.summaryNumber}>{stats.assistidos}</Text>
            <Text style={styles.summaryLabel}>Assistidos</Text>
          </View>
          <View style={styles.summaryBox}>
            <Ionicons name="time-outline" size={18} color="#4EA1F3" />
            <Text style={styles.summaryNumber}>{stats.queroAssistir}</Text>
            <Text style={styles.summaryLabel}>Quero assistir</Text>
          </View>
          <View style={[styles.summaryBox, styles.summaryBoxLast]}>
            <Ionicons name="heart" size={18} color="#E5484D" />
            <Text style={styles.summaryNumber}>{stats.favoritos}</Text>
            <Text style={styles.summaryLabel}>Favoritos</Text>
          </View>
        </View>

        {!carregando && filmes.length === 0 ? (
          <View style={styles.emptyGeneralBox}>
            <Text style={styles.emptyGeneralEmoji}>🎬</Text>
            <Text style={styles.emptyGeneralText}>
              Registre um filme para começar
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Filmes Recentes</Text>
                <TouchableOpacity onPress={() => navigation.navigate("TabsRoot")}>
                  <Text style={styles.seeAllText}>Ver todos</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {filmes.map((filme) => (
                  <View key={filme.id} style={styles.cardItem}>
                    <FilmeCard
                      filme={filme}
                      onToggleFavorito={handleToggleFavorito}
                    />
                  </View>
                ))}
              </ScrollView>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Favoritos</Text>
                <TouchableOpacity onPress={() => navigation.navigate("TabsRoot")}>
                  <Text style={styles.seeAllText}>Ver todos</Text>
                </TouchableOpacity>
              </View>

              {favoritos.length === 0 ? (
                <View style={styles.emptyStateBox}>
                  <Ionicons
                    name="heart-outline"
                    size={22}
                    color={COLORS.placeholder}
                  />
                  <Text style={styles.emptyStateText}>Nenhum favorito ainda</Text>
                </View>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {favoritos.map((filme) => (
                    <View key={filme.id} style={styles.cardItem}>
                      <FilmeCard
                        filme={filme}
                        onToggleFavorito={handleToggleFavorito}
                      />
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
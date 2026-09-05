import React, { useCallback, useRef, useState } from "react";
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
import { mapMovieToFilme } from "../../utils/movieMapper";
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

  // Um timer de debounce por filme, pra suportar cliques repetidos sem
  // disparar uma requisição a cada clique — só a última intenção é enviada,
  // meio segundo depois do usuário parar de clicar naquele filme específico.
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

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

  const handleToggleFavorito = (id: string) => {
    let novoValor = false;

    setFilmes((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        novoValor = !f.favorito;
        return { ...f, favorito: novoValor };
      }),
    );

    // Dashboard reage junto, na hora — sem esperar o servidor confirmar.
    setStats((prev) => ({
      ...prev,
      favoritos: prev.favoritos + (novoValor ? 1 : -1),
    }));

    if (debounceTimers.current[id]) {
      clearTimeout(debounceTimers.current[id]);
    }
    debounceTimers.current[id] = setTimeout(() => {
      enviarFavoritoParaServidor(id, novoValor);
      delete debounceTimers.current[id];
    }, 500);
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
                      onPress={(filme) =>
                      navigation.navigate("Detalhes", { filmeId: filme.id })
                    }
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
                        onPress={(filme) =>
                        navigation.navigate("Detalhes", { filmeId: filme.id })
                      }
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
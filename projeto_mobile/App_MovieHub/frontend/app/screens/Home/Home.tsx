import React, { useCallback, useMemo, useState } from "react";
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
import * as SecureStore from "expo-secure-store";
import styles, { COLORS } from "./styles";
import FilmeCard from "../../components/FilmeCards/FilmeCard";
import { MOCK_FILMES } from "../../data/mockFilmes";
import type { MainStackParamList } from "../../navigation/MainStack";

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
  const [filmes, setFilmes] = useState(MOCK_FILMES);
  const [busca, setBusca] = useState("");
  const [userName, setUserName] = useState("");
  const [stats, setStats] = useState<DashboardStats>(STATS_VAZIO);
  const [carregandoStats, setCarregandoStats] = useState(true);

  const favoritos = useMemo(() => filmes.filter((f) => f.favorito), [filmes]);

  const carregarStats = useCallback(async () => {
    setCarregandoStats(true);
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        // Sem token = usuário não está logado de verdade ainda (ver aviso acima).
        setStats(STATS_VAZIO);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/users/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        console.error("Erro ao buscar stats:", response.status);
        setStats(STATS_VAZIO);
        return;
      }

      const data: DashboardStats = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Falha de conexão ao buscar stats:", error);
      setStats(STATS_VAZIO);
    } finally {
      setCarregandoStats(false);
    }
  }, []);

  // Roda ao montar E toda vez que a Home volta a ficar em foco
  // (ex.: usuário adiciona um filme e volta pra cá — os números atualizam sozinhos).
  useFocusEffect(
    useCallback(() => {
      carregarStats();
      SecureStore.getItemAsync("userName").then((nome) =>
        setUserName(nome ?? ""),
      );
    }, [carregarStats]),
  );

  const handleToggleFavorito = (id: string) => {
    setFilmes((prev) =>
      prev.map((f) => (f.id === id ? { ...f, favorito: !f.favorito } : f)),
    );
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
          Olá {userName ? `, ${userName}` : "Flávio"}!
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
          {carregandoStats && (
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

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Filmes Recentes</Text>
            <TouchableOpacity onPress={() => navigation.navigate("TabsRoot")}>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {filmes.length === 0 ? (
            <View style={styles.emptyStateBox}>
              <Ionicons
                name="film-outline"
                size={22}
                color={COLORS.placeholder}
              />
              <Text style={styles.emptyStateText}>
                Nenhum filme registrado ainda
              </Text>
            </View>
          ) : (
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
          )}
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
      </ScrollView>
    </SafeAreaView>
  );
}

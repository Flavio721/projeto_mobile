import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import styles, { COLORS } from "./styles";
import FilmeCard from "../../components/FilmeCards/FilmeCard";
import { MOCK_FILMES } from "../../data/mockFilmes";
import type { MainStackParamList } from "../../navigation/MainStack";
import type { Filme, StatusFilme } from "../../types/Filme";

type FilmesNavigationProp = NativeStackNavigationProp<MainStackParamList>;

type FiltroTab = "todos" | StatusFilme;

const TABS: { key: FiltroTab; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "assistido", label: "Assistidos" },
  { key: "quero_assistir", label: "Quero assistir" },
  { key: "assistindo", label: "Assistindo" },
];

export default function FilmesScreen() {
  const navigation = useNavigation<FilmesNavigationProp>();
  // TEMPORÁRIO — substituir por fetch em /filmes quando essa rota existir no backend.
  const [filmes, setFilmes] = useState<Filme[]>(MOCK_FILMES);
  const [busca, setBusca] = useState("");
  const [tabAtiva, setTabAtiva] = useState<FiltroTab>("todos");

  const filmesFiltrados = useMemo(() => {
    return filmes.filter((f) => {
      const bateTab = tabAtiva === "todos" || f.status === tabAtiva;
      const bateBusca = f.titulo.toLowerCase().includes(busca.toLowerCase());
      return bateTab && bateBusca;
    });
  }, [filmes, tabAtiva, busca]);

  const handleToggleFavorito = (id: string) => {
    setFilmes((prev) =>
      prev.map((f) => (f.id === id ? { ...f, favorito: !f.favorito } : f)),
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filmes</Text>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => alert("Filtros avançados em desenvolvimento")}
          >
            <Ionicons name="funnel-outline" size={22} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchInputWrapper}>
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
            style={styles.sortButton}
            onPress={() => alert("Ordenação em desenvolvimento")}
          >
            <Ionicons name="options-outline" size={18} color={COLORS.white} />
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
                <Text
                  style={[
                    styles.tabButtonText,
                    ativa && styles.tabButtonTextActive,
                  ]}
                >
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
          renderItem={({ item }) => (
            <View style={styles.cardSpacing}>
              <FilmeCard
                filme={item}
                onToggleFavorito={handleToggleFavorito}
                onPress={(filme: any) =>
                  navigation.navigate("Detalhes", { filme })
                }
              />
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons
                name="film-outline"
                size={26}
                color={COLORS.placeholder}
              />
              <Text style={styles.emptyText}>
                {busca
                  ? "Nenhum filme encontrado para essa busca"
                  : "Nenhum filme registrado ainda"}
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

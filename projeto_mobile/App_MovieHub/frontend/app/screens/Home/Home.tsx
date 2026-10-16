import Text from '../components/TextoLocalizado';
import React, { useCallback, useRef, useState } from "react";
import { View, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import FilmeCard from "../components/FilmeCards/FilmeCard";
import AppMenu, { type AppMenuRoute } from '../components/AppMenu';
import ActionMenu from '../components/ActionMenu/ActionMenu';
import criarStyles from "./styles";
import { buscarItem } from "../../lib/storage";
import { mapMovieToFilme } from "../../utils/movieMapper";
import { useStyles, useTema } from "../../contexts/TemaContext";
import { useIdioma } from "../../contexts/IdiomaContext";
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
type MenuUser = { name: string; email: string; avatarUrl?: string | null };

type HomeNavigationProp = NativeStackNavigationProp<MainStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavigationProp>();
  const styles = useStyles(criarStyles);
  const { cores } = useTema();
  const { idioma, idiomaTmdb, t } = useIdioma();
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [populares, setPopulares] = useState<Filme[]>([]);
  const [userName, setUserName] = useState("");
  const [menuUser, setMenuUser] = useState<MenuUser | null>(null);
  const [stats, setStats] = useState<DashboardStats>(STATS_VAZIO);
  const [carregando, setCarregando] = useState(true);
  const [menuVisivel, setMenuVisivel] = useState(false);
  const [notificacoesVisiveis, setNotificacoesVisiveis] = useState(false);
  const [preferencias, setPreferencias] = useState({ lembretes: true, novidades: true });

  const favoritos = filmes.filter((f) => f.favorito);

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    try {
      const token = await buscarItem("token");
      if (!token) {
        setFilmes([]);
        setStats(STATS_VAZIO);
        setPopulares([]);
        setMenuUser(null);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      const [filmesResponse, statsResponse, popularesResponse, perfilResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/movies?language=${idiomaTmdb}`, { headers }),
        fetch(`${API_BASE_URL}/movies/stats`, { headers }),
        fetch(`${API_BASE_URL}/movies/popular?language=${idiomaTmdb}`, { headers }),
        fetch(`${API_BASE_URL}/users/me`, { headers }),
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
      if (popularesResponse.ok) {
        const popularData = await popularesResponse.json();
        setPopulares((popularData.results ?? []).map(mapMovieToFilme));
      } else {
        setPopulares([]);
      }
      if (perfilResponse.ok) {
        const perfil = await perfilResponse.json();
        setMenuUser({ name: perfil.name ?? '', email: perfil.email ?? '', avatarUrl: perfil.avatarUrl ?? null });
      }
    } catch (error) {
      console.error("Falha de conexão ao carregar Home:", error);
      setFilmes([]);
      setStats(STATS_VAZIO);
      setPopulares([]);
      setMenuUser(null);
    } finally {
      setCarregando(false);
    }
  }, [idiomaTmdb]);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
      buscarItem("userName").then((nome) => setUserName(nome ?? ""));
      buscarItem('configuracoes').then((salvo) => {
        if (!salvo) return;
        try {
          const preferenciasSalvas = JSON.parse(salvo);
          setPreferencias({ lembretes: preferenciasSalvas.lembretes !== false, novidades: preferenciasSalvas.novidades !== false });
        } catch {
          setPreferencias({ lembretes: true, novidades: true });
        }
      });
    }, [carregarDados, idioma]),
  );

  const selecionarMenu = (route: AppMenuRoute) => {
    setMenuVisivel(false);
    const abas = ['Home', 'Filmes', 'Favoritos', 'Perfil', 'Arvore'];
    if (abas.includes(route)) (navigation as any).navigate(route);
    else (navigation as any).getParent()?.navigate(route);
  };

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
            onPress={() => setMenuVisivel(true)}
            accessibilityRole="button"
            accessibilityLabel={t('navigation')}
          >
            <Ionicons name="menu-outline" size={26} color={cores.text} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>MovieHub</Text>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setNotificacoesVisiveis(true)}
            accessibilityRole="button"
            accessibilityLabel={t('quickActions')}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={cores.text}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.greeting}>
          {t('hello')}{userName ? `, ${userName}` : ""}!
        </Text>
        <Text style={styles.subtitle}>{t('subtitle')}</Text>

        {preferencias.lembretes && stats.queroAssistir > 0 && (
          <TouchableOpacity
            onPress={() => selecionarMenu('Filmes')}
            style={{ flexDirection: 'row', alignItems: 'center', padding: 13, borderRadius: 14, backgroundColor: cores.card, borderColor: cores.border, borderWidth: 1, marginBottom: 16 }}
            accessibilityRole="button"
          >
            <Ionicons name="notifications-outline" size={19} color={cores.gold} />
            <Text style={{ color: cores.text, fontSize: 13, fontWeight: '600', flex: 1, marginHorizontal: 10 }}>{t('watchlist')}: {stats.queroAssistir} · {t('watchlistReminder')}</Text>
            <Ionicons name="chevron-forward" size={16} color={cores.muted} />
          </TouchableOpacity>
        )}

        {/* Não é mais um TextInput funcional — é um botão que abre a tela
            de Pesquisa de verdade. Por isso "editable" nem existe aqui;
            o toque inteiro na barra é uma navegação, não uma digitação. */}
        <View style={styles.searchRow}>
          <TouchableOpacity
            style={styles.searchWrapper}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Pesquisa")}
          >
            <Ionicons
              name="search-outline"
              size={18}
              color={cores.placeholder}
              style={styles.searchIcon}
            />
            <Text style={styles.searchPlaceholderText}>{t('search')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("Pesquisa")}
          >
            <Ionicons name="add" size={24} color={cores.onGold} />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.sectionTitle}>{t('summary')}</Text>
          {carregando && (
            <ActivityIndicator size="small" color={cores.gold} />
          )}
        </View>
        <View style={styles.summaryRow}>
          <View style={styles.summaryBox}>
            <Ionicons name="film-outline" size={18} color={cores.gold} />
            <Text style={styles.summaryNumber}>{stats.total}</Text>
            <Text style={styles.summaryLabel}>{t('totalMovies')}</Text>
          </View>
          <View style={styles.summaryBox}>
            <Ionicons
              name="checkmark-circle-outline"
              size={18}
              color={cores.success}
            />
            <Text style={styles.summaryNumber}>{stats.assistidos}</Text>
            <Text style={styles.summaryLabel}>{t('watched')}</Text>
          </View>
          <View style={styles.summaryBox}>
            <Ionicons name="time-outline" size={18} color={cores.info} />
            <Text style={styles.summaryNumber}>{stats.queroAssistir}</Text>
            <Text style={styles.summaryLabel}>{t('watchlist')}</Text>
          </View>
          <View style={[styles.summaryBox, styles.summaryBoxLast]}>
            <Ionicons name="heart" size={18} color={cores.heartOn} />
            <Text style={styles.summaryNumber}>{stats.favoritos}</Text>
            <Text style={styles.summaryLabel}>Favoritos</Text>
          </View>
        </View>

        {preferencias.novidades && <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>{t('popular')}</Text>
              <Text style={styles.popularSubtitle}>{t('popularSubtitle')}</Text>
            </View>
            {carregando && <ActivityIndicator size="small" color={cores.gold} />}
          </View>
          {populares.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {populares.map((filme) => (
                <TouchableOpacity key={filme.id} style={styles.popularCard} onPress={() => navigation.navigate('Detalhes', { filmeId: filme.id })}>
                  {filme.posterUri ? <Image source={{ uri: filme.posterUri }} style={styles.popularPoster} /> : <View style={[styles.popularPoster, styles.posterFallback]}><Ionicons name="film-outline" size={24} color={cores.muted} /></View>}
                  <Text style={styles.popularTitle} numberOfLines={1}>{filme.titulo}</Text>
                  <View style={styles.popularRating}><Ionicons name="star" size={12} color={cores.gold} /><Text style={styles.popularRatingText}>{filme.tmdbRating?.toFixed(1) ?? '—'} TMDB</Text></View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : !carregando ? <Text style={styles.emptySectionText}>{t('emptyPopular')}</Text> : null}
        </View>}

        {!carregando && filmes.length === 0 ? (
          <View style={styles.emptyGeneralBox}>
            <Text style={styles.emptyGeneralEmoji}>🎬</Text>
            <Text style={styles.emptyGeneralText}>
              {t('emptyCollection')}
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>{t('recent')}</Text>
                <TouchableOpacity onPress={() => selecionarMenu('Filmes')}>
                  <Text style={styles.seeAllText}>{t('seeAll')}</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {filmes.map((filme) => (
                  <View key={filme.id} style={styles.cardItem}>
                    <FilmeCard
                      filme={filme}
                      onToggleFavorito={handleToggleFavorito}
                      onPress={(f : any) => navigation.navigate("Detalhes", { filmeId: f.id })}
                    />
                  </View>
                ))}
              </ScrollView>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>{t('favorites')}</Text>
                <TouchableOpacity onPress={() => selecionarMenu('Favoritos')}>
                  <Text style={styles.seeAllText}>{t('seeAll')}</Text>
                </TouchableOpacity>
              </View>

              {favoritos.length === 0 ? (
                <View style={styles.emptyStateBox}>
                  <Ionicons
                    name="heart-outline"
                    size={22}
                    color={cores.placeholder}
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
                        onPress={(f : any) => navigation.navigate("Detalhes", { filmeId: f.id })}
                      />
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
          </>
        )}
      </ScrollView>
      <AppMenu visible={menuVisivel} onClose={() => setMenuVisivel(false)} onSelect={selecionarMenu} user={menuUser} />
      <ActionMenu
        visible={notificacoesVisiveis}
        onClose={() => setNotificacoesVisiveis(false)}
        options={[
          { label: `${t('watchlist')}: ${stats.queroAssistir}`, icon: 'bookmark-outline', onPress: () => selecionarMenu('Filmes') },
          { label: t('searchTitle'), icon: 'search-outline', onPress: () => selecionarMenu('Pesquisa') },
          { label: t('settings'), icon: 'settings-outline', onPress: () => selecionarMenu('Configuracoes') },
        ]}
      />
    </SafeAreaView>
  );
}

import Text from '../components/TextoLocalizado';
import { useStyles, useTema } from '../../contexts/TemaContext';
import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import criarStyles from './styles';
import { useToast } from '../../contexts/ToastContext';
import type { MainStackParamList } from '../../navigation/MainStack';
import { buscarItem } from '../../lib/storage';
import { mapMovieToFilme } from '../../utils/movieMapper';
import type { Filme } from '../../types/Filme';

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

type EstatisticasNavigationProp = NativeStackNavigationProp<MainStackParamList>;

export default function Estatisticas() {
  const styles = useStyles(criarStyles);
  const { cores } = useTema();
  const navigation = useNavigation<EstatisticasNavigationProp>();
  const { showError } = useToast();
  const [ carregando, setCarregando ] = useState(false);
  const [stats, setStats] = useState<DashboardStats>(STATS_VAZIO);
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const avaliados = filmes.filter((filme) => filme.status === 'WATCHED' && filme.nota > 0);
  const notaMedia = avaliados.length ? avaliados.reduce((sum, filme) => sum + filme.nota, 0) / avaliados.length : 0;
  const genreColors = ['#4EA1F3', '#3DDC97', '#F4B400', '#E5484D', '#9C6ADE', '#6E6A8C'];
  const genreCounts = new Map<string, number>();
  filmes.filter((filme) => filme.status === 'WATCHED').forEach((filme) => {
    filme.genero.split(',').map((genre) => genre.trim()).filter((genre) => genre && genre !== '—').forEach((genre) => genreCounts.set(genre, (genreCounts.get(genre) ?? 0) + 1));
  });
  const porGenero = [...genreCounts.entries()].sort((a, b) => b[1] - a[1]).map(([genero, quantidade], index) => ({ genero, quantidade, cor: genreColors[index % genreColors.length] }));
  const totalGeneros = Math.max(porGenero.reduce((sum, genre) => sum + genre.quantidade, 0), 1);
  const nomesMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const evolucaoMensal = nomesMeses.map((mes, index) => ({ mes, quantidade: filmes.filter((filme) => filme.status === 'WATCHED' && filme.assistidoEm && new Date(filme.assistidoEm).getMonth() === index && new Date(filme.assistidoEm).getFullYear() === new Date().getFullYear()).length }));
  const maiorMes = Math.max(...evolucaoMensal.map((month) => month.quantidade), 1);

  const carregarDados = useCallback(async () => {
      setCarregando(true);
      try {
        const token = await buscarItem("token");
        if (!token) {
          setStats(STATS_VAZIO);
          return;
        }
  
        const headers = { Authorization: `Bearer ${token}` };
  
        const [statsResponse, moviesResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/movies/stats`, { headers }),
          fetch(`${API_BASE_URL}/movies`, { headers }),
        ]);
  
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        } else {
          console.error("Erro ao buscar stats:", statsResponse.status);
          setStats(STATS_VAZIO);
        }
        if (moviesResponse.ok) {
          const moviesData = await moviesResponse.json();
          setFilmes(moviesData.map(mapMovieToFilme));
        } else {
          setFilmes([]);
        }
      } catch (error) {
        console.error("Falha de conexão ao carregar Home:", error);
        setStats(STATS_VAZIO);
        setFilmes([]);
      } finally {
        setCarregando(false);
      }
    }, []);
  
    useFocusEffect(
      useCallback(() => {
        carregarDados();
      }, [carregarDados]),
    );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color={cores.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Estatísticas</Text>
          </View>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => showError('Compartilhar ainda não foi implementado.')}
          >
            <Ionicons name="share-outline" size={20} color={cores.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.summaryCard}>
          <View>
            <Text style={styles.summaryCardTitle}>Resumo geral</Text>
            {carregando && (
            <ActivityIndicator size="small" color={cores.gold} />
          )}
            <Text style={styles.summaryCardSubtitle}>Todos os dados da sua coleção de filmes</Text>
          </View>
          <View style={styles.summaryIconBox}>
            <Ionicons name="bar-chart-outline" size={20} color={cores.gold} />
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <View style={styles.statBoxInner}>
              <View style={[styles.statIconCircle, { backgroundColor: cores.card }]}>
                <Ionicons name="film-outline" size={16} color={cores.info} />
              </View>
              <Text style={styles.statValue}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total de filmes</Text>
            </View>
          </View>
          <View style={styles.statBox}>
            <View style={styles.statBoxInner}>
              <View style={[styles.statIconCircle, { backgroundColor: cores.card }]}>
                <Ionicons name="checkmark-circle-outline" size={16} color={cores.success} />
              </View>
              <Text style={styles.statValue}>{stats.assistidos}</Text>
              <Text style={styles.statLabel}>Assistidos</Text>
            </View>
          </View>
          <View style={styles.statBox}>
            <View style={styles.statBoxInner}>
              <View style={[styles.statIconCircle, { backgroundColor: cores.card }]}>
                <Ionicons name="bookmark-outline" size={16} color={cores.danger} />
              </View>
              <Text style={styles.statValue}>{stats.queroAssistir}</Text>
              <Text style={styles.statLabel}>Quero assistir</Text>
            </View>
          </View>
          <View style={styles.statBox}>
            <View style={styles.statBoxInner}>
              <View style={[styles.statIconCircle, { backgroundColor: cores.card }]}>
                <Ionicons name="heart" size={16} color={cores.gold} />
              </View>
              <Text style={styles.statValue}>{stats.favoritos}</Text>
              <Text style={styles.statLabel}>Favoritos</Text>
            </View>
          </View>
          <View style={styles.statBox}>
            <View style={styles.statBoxInner}>
                <Text style={styles.statValue}>{notaMedia.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Nota média</Text>
              <View style={styles.statStarsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= Math.round(notaMedia) ? 'star' : 'star-outline'}
                    size={12}
                    color={cores.gold}
                    style={{ marginRight: 2 }}
                  />
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Por gênero</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Generos')}>
              <Text style={styles.verTodosText}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.proporcaoBar}>
            {porGenero.map((g) => (
              <View
                key={g.genero}
                style={{ flex: g.quantidade / totalGeneros, backgroundColor: g.cor }}
              />
            ))}
          </View>

          {porGenero.map((g) => (
            <View key={g.genero} style={styles.legendaItem}>
              <View style={styles.legendaLeft}>
                <View style={[styles.legendaDot, { backgroundColor: g.cor }]} />
                <Text style={styles.legendaLabel}>{g.genero}</Text>
              </View>
              <Text style={styles.legendaValue}>
                {g.quantidade} ({Math.round((g.quantidade / totalGeneros) * 100)}%)
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Evolução mensal</Text>
          </View>
          <View style={styles.barChartRow}>
            {evolucaoMensal.map((m) => (
              <View key={m.mes} style={styles.barColumn}>
                <Text style={styles.barValue}>{m.quantidade}</Text>
                <View
                  style={[
                    styles.bar,
                    { height: Math.max((m.quantidade / maiorMes) * 80, 4) },
                  ]}
                />
                <Text style={styles.barLabel}>{m.mes}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

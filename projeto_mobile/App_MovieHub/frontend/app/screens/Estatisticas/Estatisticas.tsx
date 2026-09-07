import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styles, { COLORS } from './styles';
import { useToast } from '../../contexts/ToastContext';
import type { MainStackParamList } from '../../navigation/MainStack';
import { buscarItem } from '../../lib/storage';

// TEMPORÁRIO — dados mockados. Quando a consulta real existir no backend
// (algo como GET /movies/statistics), a resposta precisa vir exatamente
// nesse formato pra essa tela funcionar sem precisar mexer no layout:
const MOCK_ESTATISTICAS = {
  totalFilmes: 42,
  assistidos: 31,
  queroAssistir: 8,
  assistindo: 3, // sempre 0 até o enum de status ganhar um terceiro valor
  favoritos: 12,
  notaMedia: 4.2,
  porGenero: [
    { genero: 'Ação', quantidade: 12, cor: '#4EA1F3' },
    { genero: 'Drama', quantidade: 9, cor: '#3DDC97' },
    { genero: 'Ficção Científica', quantidade: 8, cor: '#F4B400' },
    { genero: 'Comédia', quantidade: 5, cor: '#E5484D' },
    { genero: 'Terror', quantidade: 4, cor: '#9C6ADE' },
    { genero: 'Outros', quantidade: 4, cor: '#6E6A8C' },
  ],
  evolucaoMensal: [
    { mes: 'Jan', quantidade: 2 },
    { mes: 'Fev', quantidade: 3 },
    { mes: 'Mar', quantidade: 4 },
    { mes: 'Abr', quantidade: 6 },
    { mes: 'Mai', quantidade: 8 },
    { mes: 'Jun', quantidade: 10 },
    { mes: 'Jul', quantidade: 9 },
  ],
};

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
  const navigation = useNavigation<EstatisticasNavigationProp>();
  const { showError } = useToast();
  const dados = MOCK_ESTATISTICAS;
  const [ carregando, setCarregando ] = useState(false);
  const [stats, setStats] = useState<DashboardStats>(STATS_VAZIO);

  const totalGeneros = dados.porGenero.reduce((soma, g) => soma + g.quantidade, 0);
  const maiorMes = Math.max(...dados.evolucaoMensal.map((m) => m.quantidade), 1);

  const carregarDados = useCallback(async () => {
      setCarregando(true);
      try {
        const token = await buscarItem("token");
        if (!token) {
          setStats(STATS_VAZIO);
          return;
        }
  
        const headers = { Authorization: `Bearer ${token}` };
  
        const statsResponse = await fetch(`${API_BASE_URL}/movies/stats`, { headers });
  
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        } else {
          console.error("Erro ao buscar stats:", statsResponse.status);
          setStats(STATS_VAZIO);
        }
      } catch (error) {
        console.error("Falha de conexão ao carregar Home:", error);
        setStats(STATS_VAZIO);
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
              <Ionicons name="arrow-back" size={22} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.title}>Estatísticas</Text>
          </View>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => showError('Compartilhar ainda não foi implementado.')}
          >
            <Ionicons name="share-outline" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.summaryCard}>
          <View>
            <Text style={styles.summaryCardTitle}>Resumo geral</Text>
            {carregando && (
            <ActivityIndicator size="small" color={COLORS.gold} />
          )}
            <Text style={styles.summaryCardSubtitle}>Todos os dados da sua coleção de filmes</Text>
          </View>
          <View style={styles.summaryIconBox}>
            <Ionicons name="bar-chart-outline" size={20} color={COLORS.gold} />
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <View style={styles.statBoxInner}>
              <View style={[styles.statIconCircle, { backgroundColor: 'rgba(78,161,243,0.15)' }]}>
                <Ionicons name="film-outline" size={16} color="#4EA1F3" />
              </View>
              <Text style={styles.statValue}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total de filmes</Text>
            </View>
          </View>
          <View style={styles.statBox}>
            <View style={styles.statBoxInner}>
              <View style={[styles.statIconCircle, { backgroundColor: 'rgba(61,220,151,0.15)' }]}>
                <Ionicons name="checkmark-circle-outline" size={16} color="#3DDC97" />
              </View>
              <Text style={styles.statValue}>{stats.assistidos}</Text>
              <Text style={styles.statLabel}>Assistidos</Text>
            </View>
          </View>
          <View style={styles.statBox}>
            <View style={styles.statBoxInner}>
              <View style={[styles.statIconCircle, { backgroundColor: 'rgba(229,72,77,0.15)' }]}>
                <Ionicons name="bookmark-outline" size={16} color="#E5484D" />
              </View>
              <Text style={styles.statValue}>{stats.queroAssistir}</Text>
              <Text style={styles.statLabel}>Quero assistir</Text>
            </View>
          </View>
          <View style={styles.statBox}>
            <View style={styles.statBoxInner}>
              <View style={[styles.statIconCircle, { backgroundColor: 'rgba(244,180,0,0.15)' }]}>
                <Ionicons name="heart" size={16} color={COLORS.gold} />
              </View>
              <Text style={styles.statValue}>{stats.favoritos}</Text>
              <Text style={styles.statLabel}>Favoritos</Text>
            </View>
          </View>
          <View style={styles.statBox}>
            <View style={styles.statBoxInner}>
              <Text style={styles.statValue}>{dados.notaMedia.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Nota média</Text>
              <View style={styles.statStarsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= Math.round(dados.notaMedia) ? 'star' : 'star-outline'}
                    size={12}
                    color={COLORS.gold}
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
            {dados.porGenero.map((g) => (
              <View
                key={g.genero}
                style={{ flex: g.quantidade / totalGeneros, backgroundColor: g.cor }}
              />
            ))}
          </View>

          {dados.porGenero.map((g) => (
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
            {dados.evolucaoMensal.map((m) => (
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

        <Text style={styles.mockNotice}>
          Dados de exemplo — ainda não conectados à API.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
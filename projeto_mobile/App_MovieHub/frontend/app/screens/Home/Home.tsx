import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import FilmeCard from '../../components/FilmeCards/FilmeCard';
import type { Filme } from '../../navigation/MainDrawer';
import styles, { COLORS } from './styles';

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Nome e números do resumo ainda não vêm do backend — mock temporário.
// Troque por dados reais quando a rota de usuário/filmes existir.
const NOME_USUARIO = 'Lucas';

// Dados de exemplo só para validar o layout com filmes cadastrados.
// Troque por fetch em /filmes assim que a rota existir no backend.
const FILMES_MOCK: Filme[] = [];

export default function Home() {
  const navigation = useNavigation<HomeNavigationProp>();
  const [busca, setBusca] = useState('');
  const [filmes, setFilmes] = useState<Filme[]>(FILMES_MOCK);

  const resumo = useMemo(
    () => ({
      total: filmes.length || Math.floor(Math.random() * 30) + 5,
      assistidos: Math.floor(Math.random() * 20) + 1,
      queroAssistir: Math.floor(Math.random() * 10) + 1,
      favoritos: filmes.filter((f) => f.favorito).length || Math.floor(Math.random() * 8) + 1,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const recentes = filmes.slice(-6).reverse();
  const favoritos = filmes.filter((f) => f.favorito);

  const handleToggleFavorito = (id: string) => {
    setFilmes((prev) =>
      prev.map((f) => (f.id === id ? { ...f, favorito: !f.favorito } : f)),
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => Alert.alert('Menu', 'Ainda não definimos o que esse botão faz.')}
          >
            <Ionicons name="menu" size={26} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>MovieHub</Text>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => Alert.alert('Notificações', 'Popup de notificações em desenvolvimento')}
          >
            <Ionicons name="notifications-outline" size={22} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <Text style={styles.greeting}>Olá, {NOME_USUARIO}!</Text>
        <Text style={styles.subtitle}>Desfrute dos seus filmes favoritos.</Text>

        <View style={styles.searchRow}>
          <View style={styles.searchWrapper}>
            <Ionicons name="search" size={18} color={COLORS.muted} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar filmes..."
              placeholderTextColor={COLORS.muted}
              value={busca}
              onChangeText={setBusca}
            />
          </View>
          <TouchableOpacity
            style={styles.addButton}
            // onPress={() => navigation.navigate('CadastroFilme')}
          >
            <Ionicons name="add" size={22} color="#241C00" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Resumo</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryBox}>
            <MaterialCommunityIcons name="movie-open-outline" size={18} color={COLORS.white} />
            <Text style={styles.summaryNumber}>{resumo.total}</Text>
            <Text style={styles.summaryLabel}>Total de filmes</Text>
          </View>
          <View style={styles.summaryBox}>
            <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
            <Text style={styles.summaryNumber}>{resumo.assistidos}</Text>
            <Text style={styles.summaryLabel}>Assistidos</Text>
          </View>
          <View style={styles.summaryBox}>
            <Ionicons name="time-outline" size={18} color="#4C9AE2" />
            <Text style={styles.summaryNumber}>{resumo.queroAssistir}</Text>
            <Text style={styles.summaryLabel}>Quero assistir</Text>
          </View>
          <View style={[styles.summaryBox, styles.summaryBoxLast]}>
            <Ionicons name="heart" size={18} color="#E24C4C" />
            <Text style={styles.summaryNumber}>{resumo.favoritos}</Text>
            <Text style={styles.summaryLabel}>Favoritos</Text>
          </View>
        </View>

        {filmes.length === 0 ? (
          <View style={styles.emptyStateBox}>
            <MaterialCommunityIcons name="movie-open-outline" size={40} color={COLORS.muted} />
            <Text style={styles.emptyStateText}>
              Você ainda não tem filmes registrados.{'\n'}Toque no + para adicionar o primeiro.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Filmes Recentes</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>Ver todos</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
                {recentes.map((filme) => (
                  <FilmeCard key={filme.id} filme={filme} onToggleFavorito={handleToggleFavorito} />
                ))}
              </ScrollView>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Favoritos</Text>
                {favoritos.length > 0 && (
                  <TouchableOpacity>
                    <Text style={styles.seeAllText}>Ver todos</Text>
                  </TouchableOpacity>
                )}
              </View>
              {favoritos.length === 0 ? (
                <Text style={styles.emptySectionText}>Nenhum favorito ainda.</Text>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
                  {favoritos.map((filme) => (
                    <FilmeCard
                      key={filme.id}
                      filme={filme}
                      onToggleFavorito={handleToggleFavorito}
                      showRating={false}
                    />
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
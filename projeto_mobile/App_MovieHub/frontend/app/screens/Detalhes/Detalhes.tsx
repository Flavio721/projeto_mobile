import React, { useCallback, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import styles, { COLORS } from './styles';
import ActionMenu from '../components/ActionMenu/ActionMenu';
import { buscarItem } from '../../lib/storage';
import { useToast } from '../../contexts/ToastContext';
import { mapMovieToFilme } from '../../utils/movieMapper';
import type { MainStackParamList } from '../../navigation/MainStack';
import type { Filme } from '../../types/Filme';
import LoadingOverlay from '../components/LoadingOverlay';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

type DetalhesNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Detalhes'>;
type DetalhesRouteProp = RouteProp<MainStackParamList, 'Detalhes'>;

export default function Detalhes() {
  const navigation = useNavigation<DetalhesNavigationProp>();
  const route = useRoute<DetalhesRouteProp>();
  const { filmeId } = route.params;
  const { showError } = useToast();

  const [filme, setFilme] = useState<Filme | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [menuVisivel, setMenuVisivel] = useState(false);

  const carregarFilme = useCallback(async () => {
    setCarregando(true);
    try {
      const token = await buscarItem('token');
      if (!token) {
        showError('Sessão expirada. Faça login novamente.');
        navigation.goBack();
        return;
      }

      const response = await fetch(`${API_BASE_URL}/movies/${filmeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        showError(data.error ?? 'Não foi possível carregar o filme.');
        navigation.goBack();
        return;
      }

      const data = await response.json();
      setFilme(mapMovieToFilme(data));
    } catch (error) {
      console.error('Erro ao buscar filme:', error);
      showError('Falha de conexão com o servidor.');
      navigation.goBack();
    } finally {
      setCarregando(false);
    }
  }, [filmeId, navigation, showError]);

  // Sempre busca de novo ao focar a tela — assim, voltar de uma Edição
  // já mostra os dados atualizados sem precisar de lógica extra.
  useFocusEffect(
    useCallback(() => {
      carregarFilme();
    }, [carregarFilme]),
  );

  const handleFavoritar = async () => {
    if (!filme) return;
    const novoValor = !filme.favorito;
    setFilme({ ...filme, favorito: novoValor });

    try {
      const token = await buscarItem('token');
      if (!token) return;
      await fetch(`${API_BASE_URL}/movies/${filmeId}/favorite`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isFavorite: novoValor }),
      });
    } catch (error) {
      console.error('Erro ao favoritar:', error);
      setFilme({ ...filme, favorito: !novoValor });
    }
  };

  const handleCompartilhar = () => {
    // TODO: usar o módulo Share do React Native quando quiser compartilhar de verdade.
    showError('Compartilhar ainda não foi implementado.');
  };

  const handleEditar = () => {
    navigation.navigate('Editar', { filmeId });
  };

  const handleExcluir = () => {
    if (!filme) return;
    navigation.navigate('Excluir', { filme });
  };

  const abrirTrailer = () => {
    if (filme?.trailerUrl) {
      Linking.openURL(filme.trailerUrl);
    }
  };

  if (carregando || !filme) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LoadingOverlay visible message="Carregando filme..." />
        <View style={styles.centered} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Detalhes do Filme</Text>
          <TouchableOpacity style={styles.iconButton} onPress={() => setMenuVisivel(true)}>
            <Ionicons name="ellipsis-vertical" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.posterWrapper}>
          {filme.posterUri ? (
            <Image source={{ uri: filme.posterUri }} style={styles.poster} />
          ) : (
            <View style={[styles.poster, styles.posterFallback]}>
              <Ionicons name="film-outline" size={28} color={COLORS.white} />
            </View>
          )}

          <View style={styles.headerInfo}>
            <Text style={styles.titulo}>{filme.titulo}</Text>
            <Text style={styles.metaLine}>
              {filme.ano}
              {filme.duracaoMin ? ` • ${Math.floor(filme.duracaoMin / 60)}h${String(filme.duracaoMin % 60).padStart(2, '0')}min` : ''}
            </Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={16} color={COLORS.gold} />
              <Text style={styles.ratingText}>{filme.nota.toFixed(1)}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>
                {filme.status === 'WATCHED' ? 'Assistido' : 'Quero assistir'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Gênero</Text>
          <Text style={styles.sectionValue}>{filme.genero}</Text>
        </View>

        {!!filme.diretor && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Diretor</Text>
            <Text style={styles.sectionValue}>{filme.diretor}</Text>
          </View>
        )}

        {!!filme.descricao && (
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>Descrição</Text>
            <Text style={styles.sectionValue}>{filme.descricao}</Text>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Minha avaliação</Text>
          <View style={styles.myRatingRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= Math.round(filme.nota) ? 'star' : 'star-outline'}
                size={18}
                color={COLORS.gold}
                style={{ marginRight: 2 }}
              />
            ))}
            <Text style={styles.myRatingValue}>{filme.nota.toFixed(1)}</Text>
          </View>
        </View>

        {!!filme.trailerUrl && (
          <TouchableOpacity style={styles.trailerRow} onPress={abrirTrailer}>
            <View style={styles.trailerLeft}>
              <Ionicons name="logo-youtube" size={22} color={COLORS.danger} />
              <Text style={styles.trailerText}>Assistir trailer no YouTube</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.muted} />
          </TouchableOpacity>
        )}

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton} onPress={handleFavoritar}>
            <Ionicons
              name={filme.favorito ? 'heart' : 'heart-outline'}
              size={20}
              color={filme.favorito ? COLORS.danger : COLORS.muted}
            />
            <Text
              style={[
                styles.actionButtonText,
                filme.favorito && styles.actionButtonTextDanger,
              ]}
            >
              Favorito
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleEditar}>
            <Ionicons name="create-outline" size={20} color={COLORS.gold} />
            <Text style={[styles.actionButtonText, styles.actionButtonTextActive]}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleExcluir}>
            <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
            <Text style={[styles.actionButtonText, styles.actionButtonTextDanger]}>Excluir</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleCompartilhar}>
            <Ionicons name="share-social-outline" size={20} color={COLORS.muted} />
            <Text style={styles.actionButtonText}>Compartilhar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ActionMenu
        visible={menuVisivel}
        onClose={() => setMenuVisivel(false)}
        options={[
          { label: 'Compartilhar', icon: 'share-social-outline', onPress: handleCompartilhar },
          { label: 'Editar', icon: 'create-outline', onPress: handleEditar },
          { label: 'Excluir', icon: 'trash-outline', onPress: handleExcluir, danger: true },
        ]}
      />
    </SafeAreaView>
  );
}
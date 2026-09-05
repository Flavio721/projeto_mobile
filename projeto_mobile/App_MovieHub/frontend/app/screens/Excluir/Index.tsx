import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import styles, { COLORS} from './styles';
import LoadingOverlay from '../components/LoadingOverlay';
import { useToast } from '../../contexts/ToastContext';
import { buscarItem } from '../../lib/storage';
import type { MainStackParamList } from '../../navigation/MainStack';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

type ExcluirNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Excluir'>;
type ExcluirRouteProp = RouteProp<MainStackParamList, 'Excluir'>;

export default function Excluir() {
  const navigation = useNavigation<ExcluirNavigationProp>();
  const route = useRoute<ExcluirRouteProp>();
  const { filme } = route.params;
  const { showSuccess, showError } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleExcluir = async () => {
    setIsDeleting(true);
    try {
      const token = await buscarItem('token');
      if (!token) {
        showError('Sessão expirada. Faça login novamente.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/movies/${filme.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok && response.status !== 204) {
        const data = await response.json().catch(() => ({}));
        showError(data.error ?? 'Não foi possível excluir o filme.');
        return;
      }

      showSuccess('Filme excluído com sucesso!');
      // Volta pra raiz das tabs — não faz sentido tentar voltar pra uma tela
      // de Detalhes de um filme que acabou de deixar de existir.
      navigation.popToTop();
    } catch (error) {
      console.error('Erro ao excluir filme:', error);
      showError('Falha de conexão com o servidor.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LoadingOverlay visible={isDeleting} message="Excluindo filme..." />
      <View style={styles.content}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.title}>Excluir Filme</Text>
        </View>

        <View style={styles.body}>
          <View style={styles.iconCircle}>
            <Ionicons name="trash" size={40} color={COLORS.danger} />
            <View style={styles.warningBadge}>
              <Ionicons name="warning" size={22} color={COLORS.gold} />
            </View>
          </View>

          <Text style={styles.heading}>Excluir este filme?</Text>
          <Text style={styles.subheading}>
            Esta ação não pode ser desfeita.{'\n'}
            O filme "{filme.titulo}" será removido permanentemente da sua coleção.
          </Text>

          <View style={styles.filmeCard}>
            {filme.posterUri ? (
              <Image source={{ uri: filme.posterUri }} style={styles.poster} />
            ) : (
              <View style={[styles.poster, styles.posterFallback]}>
                <Ionicons name="film-outline" size={18} color={COLORS.white} />
              </View>
            )}
            <View style={styles.filmeInfo}>
              <Text style={styles.filmeTitulo} numberOfLines={1}>{filme.titulo}</Text>
              <Text style={styles.filmeMeta}>{filme.ano} • {filme.genero}</Text>
              <View style={styles.filmeRatingRow}>
                <Ionicons name="star" size={12} color={COLORS.gold} />
                <Text style={styles.filmeRatingText}>{filme.nota.toFixed(1)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.dangerButton, isDeleting && { opacity: 0.6 }]}
            onPress={handleExcluir}
            disabled={isDeleting}
          >
            <Ionicons name="trash-outline" size={18} color={COLORS.white} />
            <Text style={styles.dangerButtonText}>
              {isDeleting ? 'Excluindo...' : 'Sim, excluir filme'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
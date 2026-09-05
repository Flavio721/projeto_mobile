import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
<<<<<<< HEAD
import type { RootStackParamList } from '../../navigation/RootStack';
=======
import type { RootStackParamList } from '../../../App';
import { buscarItem, removerItem } from '../../lib/storage';
>>>>>>> f6ceb3456ca8f4318e87720b444c106db1f085ab
import styles, { COLORS } from './style';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

type SplashNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

export default function SplashScreen() {
  const navigation = useNavigation<SplashNavigationProp>();

  useEffect(() => {
    let cancelado = false;

    async function verificarSessao() {
      const token = await buscarItem('token');

      if (!token) {
        if (!cancelado) navigation.replace('Login');
        return;
      }

      // Nunca confia no token só porque ele existe no dispositivo — ele pode
      // ter expirado, ou não ser mais válido por qualquer outro motivo do
      // lado do servidor. Confirma com o backend antes de pular o login.
      try {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          if (!cancelado) navigation.replace('Main');
        } else {
          await removerItem('token');
          await removerItem('userName');
          if (!cancelado) navigation.replace('Login');
        }
      } catch (error) {
        // Sem conexão com o backend agora — não dá pra confirmar o token,
        // então por segurança manda pro Login em vez de assumir que está ok.
        console.error('Erro ao verificar sessão:', error);
        if (!cancelado) navigation.replace('Login');
      }
    }

    // Segura por um instante mínimo só pra a marca aparecer — a checagem
    // real de sessão roda em paralelo, não é o que causa a demora.
    const tempoMinimo = new Promise((resolve) => setTimeout(resolve, 1500));

    Promise.all([verificarSessao(), tempoMinimo]);

    return () => {
      cancelado = true;
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.glowCircle} />

      <View style={styles.iconStack}>
        <MaterialCommunityIcons
          name="movie-open-outline"
          size={110}
          color={COLORS.white}
          style={styles.clapperIcon}
        />
        <MaterialCommunityIcons
          name="popcorn"
          size={44}
          color={COLORS.gold}
          style={styles.popcornIcon}
        />
      </View>

      <Text style={styles.appName}>MovieHub</Text>
      <Text style={styles.tagline}>Gerenciador de Filmes</Text>

      <View style={styles.loadingSection}>
        <ActivityIndicator size="small" color={COLORS.gold} />
        <Text style={styles.loadingText}>Carregando...</Text>
        <Text style={styles.loadingSubtext}>Preparando sua experiência</Text>
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>
      </View>
    </View>
  );
}
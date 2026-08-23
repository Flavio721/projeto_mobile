import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import styles, { COLORS } from './style';

type SplashNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

export default function SplashScreen() {
  const navigation = useNavigation<SplashNavigationProp>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.glowCircle} />
      <View style={styles.iconStack}>
        <MaterialCommunityIcons name="movie-open-outline" size={110} color={COLORS.white} style={styles.clapperIcon} />
        <MaterialCommunityIcons name="popcorn" size={44} color={COLORS.gold} style={styles.popcornIcon} />
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
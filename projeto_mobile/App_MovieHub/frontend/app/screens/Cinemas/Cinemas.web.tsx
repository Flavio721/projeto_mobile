import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styles, { COLORS } from './styles';
import type { MainStackParamList } from '../../navigation/MainStack';

// O Metro/bundler escolhe este arquivo automaticamente quando o app roda
// no navegador (extensão .web.tsx) e o Cinemas.tsx normal em dispositivo
// físico/emulador — react-native-maps não tem build pra web.
const MOCK_CINEMAS = [
  { nome: 'Cinépolis Center Vale', marca: 'CNP', cor: '#F4B400', endereco: 'Av. Dep. Benedito Matarazzo, 9403 - Shopping Center Vale', distanciaKm: 1.2 },
  { nome: 'Kinoplex Vale Sul', marca: 'KPX', cor: '#E5484D', endereco: 'Av. Andrômeda, 227 - Shopping Vale Sul', distanciaKm: 3.4 },
  { nome: 'Moviecom Colinas', marca: 'MVC', cor: '#4EA1F3', endereco: 'Av. São João, 2200 - Shopping Colinas', distanciaKm: 5.1 },
];

type CinemasNavigationProp = NativeStackNavigationProp<MainStackParamList>;

export default function Cinemas() {
  const navigation = useNavigation<CinemasNavigationProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.title}>Cinemas Próximos</Text>
        </View>
      </View>

      <View style={styles.mapWrapper}>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map-outline" size={28} color={COLORS.muted} />
          <Text style={styles.mapPlaceholderText}>
            Mapa disponível apenas no app instalado (Android/iOS) — não funciona no navegador.
          </Text>
        </View>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Cinemas próximos</Text>
        <FlatList
          data={MOCK_CINEMAS}
          keyExtractor={(item) => item.nome}
          renderItem={({ item }) => (
            <View style={styles.cinemaRow}>
              <View style={[styles.cinemaLogoBox, { backgroundColor: item.cor }]}>
                <Text style={styles.cinemaLogoText}>{item.marca}</Text>
              </View>
              <View style={styles.cinemaInfo}>
                <View style={styles.cinemaNomeRow}>
                  <Text style={styles.cinemaNome}>{item.nome}</Text>
                  <Text style={styles.cinemaDistancia}>{item.distanciaKm.toFixed(1)} km</Text>
                </View>
                <Text style={styles.cinemaEndereco}>{item.endereco}</Text>
              </View>
            </View>
          )}
          ListFooterComponent={
            <Text style={styles.mockNotice}>
              Lista de exemplo — conectar a uma API de lugares no backend pra dados reais.
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}
import Text from '../components/TextoLocalizado';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Linking, Platform, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import criarStyles from './styles';
import { useStyles, useTema } from '../../contexts/TemaContext';
import { useIdioma } from '../../contexts/IdiomaContext';
import { useToast } from '../../contexts/ToastContext';
import { buscarItem } from '../../lib/storage';
import type { MainStackParamList } from '../../navigation/MainStack';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const RAIO_METROS = 10000;

interface Cinema {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
}

type CinemasNavigationProp = NativeStackNavigationProp<MainStackParamList>;

export default function CinemasBase() {
  const styles = useStyles(criarStyles);
  const { cores } = useTema();
  const { traduzir } = useIdioma();
  const navigation = useNavigation<CinemasNavigationProp>();
  const { showError } = useToast();
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [cidade, setCidade] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [localizacaoNegada, setLocalizacaoNegada] = useState(false);
  const [erro, setErro] = useState('');

  const buscarCinemas = useCallback(async (forcarAtualizacao = false) => {
    setCarregando(true);
    setErro('');
    setLocalizacaoNegada(false);
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && !window.isSecureContext) {
        setErro(traduzir('A localização no navegador exige HTTPS ou localhost.'));
        return;
      }
      const servicosAtivos = await Location.hasServicesEnabledAsync();
      if (!servicosAtivos) {
        throw new Error(traduzir('A localização do aparelho está desativada. Ative o GPS e tente novamente.'));
      }
      const permissao = await Location.requestForegroundPermissionsAsync();
      if (permissao.status !== 'granted') {
        setLocalizacaoNegada(true);
        setErro(traduzir('Permita o acesso à localização para encontrar cinemas próximos.'));
        return;
      }

      // A última posição recente evita deixar a tela presa enquanto o GPS
      // tenta obter um sinal novo, algo comum em ambientes fechados.
      const ultimaPosicao = await Location.getLastKnownPositionAsync({ maxAge: 10 * 60 * 1000, requiredAccuracy: 5000 }).catch(() => null);
      let posicao = ultimaPosicao;
      if (!posicao) {
        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        try {
          const limiteDeEspera = new Promise<never>((_resolve, reject) => {
            timeoutId = setTimeout(() => reject(new Error(traduzir('Não foi possível obter sua localização. Verifique o GPS e tente novamente.'))), 20000);
          });
          posicao = await Promise.race([
            Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
            limiteDeEspera,
          ]);
        } finally {
          if (timeoutId) clearTimeout(timeoutId);
        }
      }
      const { latitude, longitude } = posicao.coords;
      try {
        const [endereco] = await Location.reverseGeocodeAsync({ latitude, longitude });
        const local = [endereco?.city ?? endereco?.subregion, endereco?.region].filter(Boolean).join(' · ');
        setCidade(local || traduzir('Sua localização atual'));
      } catch {
        setCidade(traduzir('Sua localização atual'));
      }

      const token = await buscarItem('token');
      if (!token) throw new Error(traduzir('Sua sessão expirou. Entre novamente.'));
      const params = new URLSearchParams({ lat: String(latitude), lng: String(longitude), radius: String(RAIO_METROS) });
      if (forcarAtualizacao) params.set('refresh', 'true');
      const response = await fetch(`${API_BASE_URL}/cinemas/nearby?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error ?? traduzir('Não foi possível encontrar cinemas agora.'));
      setCinemas(Array.isArray(data.results) ? data.results : []);
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : traduzir('Não foi possível encontrar cinemas agora.');
      setErro(mensagem);
      setCinemas([]);
      if (mensagem.includes('Network request failed')) showError(traduzir('Verifique sua conexão com a internet.'));
    } finally {
      setCarregando(false);
    }
  }, [showError, traduzir]);

  useFocusEffect(useCallback(() => { void buscarCinemas(); }, [buscarCinemas]));

  const abrirRota = async (cinema: Cinema) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${cinema.latitude},${cinema.longitude}`;
    try {
      await Linking.openURL(url);
    } catch {
      showError(traduzir('Não foi possível abrir o aplicativo de mapas.'));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel={traduzir('Voltar')}>
            <Ionicons name="arrow-back" size={22} color={cores.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Cinemas Próximos</Text>
        </View>
        <TouchableOpacity onPress={() => void buscarCinemas(true)} disabled={carregando} accessibilityRole="button" accessibilityLabel={traduzir('Atualizar cinemas')} style={styles.refreshButton}>
          <Ionicons name="refresh-outline" size={20} color={cores.gold} />
        </TouchableOpacity>
      </View>

      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={17} color={cores.gold} />
        <Text style={styles.locationText} numberOfLines={1}>{cidade || traduzir('Usando sua localização atual')}</Text>
        <Text style={styles.radiusText}>{traduzir('Raio de 10 km')}</Text>
      </View>

      <View style={styles.listContainer}>
        <View style={styles.resultsHeader}>
          <Text style={styles.sectionTitle}>Cinemas próximos</Text>
          {!!cinemas.length && <Text style={styles.resultCount}>{cinemas.length}</Text>}
        </View>
        <FlatList
          data={cinemas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={cinemas.length ? styles.listContent : styles.emptyListContent}
          refreshing={carregando}
          onRefresh={() => void buscarCinemas(true)}
          renderItem={({ item }) => (
            <View style={styles.cinemaRow}>
              <View style={[styles.cinemaLogoBox, { backgroundColor: cores.gold }]}>
                <Ionicons name="film-outline" size={20} color={cores.onGold} />
              </View>
              <View style={styles.cinemaInfo}>
                <View style={styles.cinemaNomeRow}>
                  <Text style={styles.cinemaNome} numberOfLines={2}>{item.name}</Text>
                  <Text style={styles.cinemaDistancia}>{item.distanceKm.toFixed(1)} km</Text>
                </View>
                <Text style={styles.cinemaEndereco}>{item.address}</Text>
                <TouchableOpacity style={styles.routeButton} onPress={() => void abrirRota(item)} accessibilityRole="button">
                  <Ionicons name="navigate-outline" size={15} color={cores.gold} />
                  <Text style={styles.routeLabel}>Como chegar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={(
            <View style={styles.emptyBox}>
              {carregando ? <ActivityIndicator color={cores.gold} size="large" /> : <Ionicons name={localizacaoNegada ? 'location-outline' : 'film-outline'} size={32} color={cores.muted} />}
              <Text style={styles.emptyTitle}>{carregando ? 'Buscando cinemas...' : localizacaoNegada ? 'Localização necessária' : erro ? 'Não foi possível buscar cinemas' : 'Nenhum cinema encontrado por perto'}</Text>
              <Text style={styles.emptyText}>{carregando ? 'Consultando locais próximos à sua posição.' : erro || 'Tente novamente mais tarde ou consulte outra região.'}</Text>
              {!carregando && <TouchableOpacity style={styles.retryButton} onPress={() => void buscarCinemas(true)}><Text style={styles.retryLabel}>{localizacaoNegada ? 'Permitir localização' : 'Tentar novamente'}</Text></TouchableOpacity>}
            </View>
          )}
          ListFooterComponent={<Text style={styles.sourceNotice}>© OpenStreetMap contributors. A distância é aproximada em linha reta; a cobertura varia conforme o mapa da região.</Text>}
        />
      </View>
    </SafeAreaView>
  );
}

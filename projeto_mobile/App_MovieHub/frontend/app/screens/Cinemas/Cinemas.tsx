import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styles, { COLORS } from './styles';
import { useToast } from '../../contexts/ToastContext';
import type { MainStackParamList } from '../../navigation/MainStack';

// TEMPORÁRIO — lista de cinemas mockada. Pra ter dados reais aqui, precisa
// de uma API de lugares (ex.: Google Places Nearby Search), e o certo
// arquiteturalmente é o backend fazer essa chamada (endpoint tipo
// GET /cinemas/nearby?lat=&lng=), nunca o app chamar direto com uma chave
// exposta no cliente. As coordenadas abaixo são deltas relativos à
// localização do usuário, só pra os pins aparecerem plausíveis no mapa.
const MOCK_CINEMAS = [
  { nome: 'Cinépolis Center Vale', marca: 'CNP', cor: '#F4B400', endereco: 'Av. Dep. Benedito Matarazzo, 9403 - Shopping Center Vale', distanciaKm: 1.2, deltaLat: 0.008, deltaLng: 0.004 },
  { nome: 'Kinoplex Vale Sul', marca: 'KPX', cor: '#E5484D', endereco: 'Av. Andrômeda, 227 - Shopping Vale Sul', distanciaKm: 3.4, deltaLat: -0.01, deltaLng: 0.012 },
  { nome: 'Moviecom Colinas', marca: 'MVC', cor: '#4EA1F3', endereco: 'Av. São João, 2200 - Shopping Colinas', distanciaKm: 5.1, deltaLat: 0.015, deltaLng: -0.01 },
];

// Fallback: São José dos Campos - SP, caso a permissão de localização seja negada.
const REGIAO_PADRAO = { latitude: -23.2237, longitude: -45.9009 };

type CinemasNavigationProp = NativeStackNavigationProp<MainStackParamList>;

export default function Cinemas() {
  const navigation = useNavigation<CinemasNavigationProp>();
  const { showError } = useToast();
  const mapRef = React.useRef<MapView>(null);

  const [coords, setCoords] = useState(REGIAO_PADRAO);
  const [cidade, setCidade] = useState('Buscando localização...');
  const [permissaoNegada, setPermissaoNegada] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setPermissaoNegada(true);
          setCidade('Localização não autorizada');
          showError('Permita o acesso à localização pra ver cinemas perto de você.');
          return;
        }

        const posicao = await Location.getCurrentPositionAsync({});
        setCoords({ latitude: posicao.coords.latitude, longitude: posicao.coords.longitude });

        const [endereco] = await Location.reverseGeocodeAsync({
          latitude: posicao.coords.latitude,
          longitude: posicao.coords.longitude,
        });
        if (endereco) {
          setCidade(`${endereco.city ?? endereco.subregion ?? ''} - ${endereco.region ?? ''}`);
        }
      } catch (error) {
        console.error('Erro ao obter localização:', error);
        setCidade('Não foi possível obter a localização');
      }
    })();
  }, []);

  const recentralizar = () => {
    mapRef.current?.animateToRegion({
      ...coords,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
  };

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

      <View style={styles.locationRow}>
        <View style={styles.locationLeft}>
          <Ionicons name="location-outline" size={16} color={COLORS.gold} />
          <Text style={styles.locationText} numberOfLines={1}>{cidade}</Text>
        </View>
        <TouchableOpacity onPress={() => Location.requestForegroundPermissionsAsync()}>
          <Ionicons name="create-outline" size={18} color={COLORS.muted} />
        </TouchableOpacity>
      </View>

      <View style={styles.mapWrapper}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          initialRegion={{ ...coords, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
          showsUserLocation={!permissaoNegada}
          showsMyLocationButton={false}
        >
          {MOCK_CINEMAS.map((cinema) => (
            <Marker
              key={cinema.nome}
              coordinate={{
                latitude: coords.latitude + cinema.deltaLat,
                longitude: coords.longitude + cinema.deltaLng,
              }}
              title={cinema.nome}
              description={cinema.endereco}
              pinColor={cinema.cor}
            />
          ))}
        </MapView>
        <TouchableOpacity style={styles.recenterButton} onPress={recentralizar}>
          <Ionicons name="locate-outline" size={18} color={COLORS.white} />
        </TouchableOpacity>
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
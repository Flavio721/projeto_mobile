import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import styles, { COLORS } from './styles';
import { useToast } from '../../contexts/ToastContext';
import type { MainStackParamList } from '../../navigation/MainStack';

type Aba = 'galeria' | 'camera';

type GaleriaNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Galeria'>;
type GaleriaRouteProp = RouteProp<MainStackParamList, 'Galeria'>;

export default function Galeria() {
  const navigation = useNavigation<GaleriaNavigationProp>();
  const route = useRoute<GaleriaRouteProp>();
  const { onSelecionar } = route.params;
  const { showError } = useToast();

  const [aba, setAba] = useState<Aba>('galeria');
  const [fotos, setFotos] = useState<MediaLibrary.Asset[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [permissaoNegada, setPermissaoNegada] = useState(false);
  const [selecionada, setSelecionada] = useState<string | null>(null);

  const carregarFotosRecentes = useCallback(async () => {
    setCarregando(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        setPermissaoNegada(true);
        return;
      }

      const resultado = await MediaLibrary.getAssetsAsync({
        mediaType: 'photo',
        first: 30,
        sortBy: [['creationTime', false]],
      });
      setFotos(resultado.assets);
    } catch (error) {
      console.error('Erro ao carregar fotos:', error);
      showError('Não foi possível acessar suas fotos.');
    } finally {
      setCarregando(false);
    }
  }, [showError]);

  useEffect(() => {
    carregarFotosRecentes();
  }, [carregarFotosRecentes]);

  const handleUsarSelecionada = () => {
    if (!selecionada) return;
    onSelecionar(selecionada);
    navigation.goBack();
  };

  const handleTirarFoto = async () => {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissao.granted) {
      showError('Autorize o acesso à câmera para tirar uma foto.');
      return;
    }
    const resultado = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      aspect: [2, 3],
      allowsEditing: true,
    });
    if (!resultado.canceled) {
      onSelecionar(resultado.assets[0].uri);
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.title}>Galeria</Text>
        </View>

        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tabButton, aba === 'galeria' && styles.tabButtonActive]}
            onPress={() => setAba('galeria')}
          >
            <Text style={[styles.tabButtonText, aba === 'galeria' && styles.tabButtonTextActive]}>
              Galeria
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, aba === 'camera' && styles.tabButtonActive]}
            onPress={() => setAba('camera')}
          >
            <Text style={[styles.tabButtonText, aba === 'camera' && styles.tabButtonTextActive]}>
              Câmera
            </Text>
          </TouchableOpacity>
        </View>

        {aba === 'galeria' ? (
          <>
            <Text style={styles.sectionTitle}>Recentes</Text>
            {permissaoNegada ? (
              <View style={styles.emptyBox}>
                <Ionicons name="images-outline" size={28} color={COLORS.muted} />
                <Text style={styles.emptyText}>
                  Autorize o acesso às fotos do aparelho pra escolher uma capa daqui.
                </Text>
              </View>
            ) : (
              <FlatList
                data={fotos}
                keyExtractor={(item) => item.id}
                numColumns={3}
                contentContainerStyle={styles.grid}
                renderItem={({ item }) => {
                  const ativo = item.uri === selecionada;
                  return (
                    <TouchableOpacity
                      style={[styles.gridItem, ativo && styles.gridItemSelected]}
                      onPress={() => setSelecionada(item.uri)}
                      activeOpacity={0.85}
                    >
                      <Image source={{ uri: item.uri }} style={styles.gridImage} />
                      {ativo && (
                        <View style={styles.selectedBadge}>
                          <Ionicons name="checkmark" size={13} color="#241C00" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                }}
                ListEmptyComponent={
                  !carregando ? (
                    <View style={styles.emptyBox}>
                      <Ionicons name="images-outline" size={28} color={COLORS.muted} />
                      <Text style={styles.emptyText}>Nenhuma foto encontrada no aparelho.</Text>
                    </View>
                  ) : null
                }
              />
            )}
          </>
        ) : (
          <View style={styles.cameraBox}>
            <View style={styles.cameraIconCircle}>
              <Ionicons name="camera" size={36} color={COLORS.gold} />
            </View>
            <Text style={styles.cameraText}>
              Tire uma foto na hora pra usar como capa do filme.
            </Text>
            <TouchableOpacity style={styles.cameraButton} onPress={handleTirarFoto}>
              <Ionicons name="camera-outline" size={18} color="#241C00" />
              <Text style={styles.cameraButtonText}>Abrir câmera</Text>
            </TouchableOpacity>
          </View>
        )}

        {aba === 'galeria' && (
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.primaryButton, !selecionada && styles.primaryButtonDisabled]}
              onPress={handleUsarSelecionada}
              disabled={!selecionada}
            >
              <Ionicons name="checkmark" size={18} color="#241C00" />
              <Text style={styles.primaryButtonText}>
                Usar imagem selecionada {selecionada ? '(1)' : '(0)'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
              <Text style={styles.secondaryButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
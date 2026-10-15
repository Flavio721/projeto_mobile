import TextInput from '../components/CampoTextoLocalizado';
import Text from '../components/TextoLocalizado';
import { useStyles, useTema } from '../../contexts/TemaContext';
import React, { useCallback, useState } from 'react';
import { View, Image, TouchableOpacity, ScrollView, TextInput as NativeTextInput, ActivityIndicator, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import criarStyles from './styles';
import { buscarItem } from '../../lib/storage';
import { useToast } from '../../contexts/ToastContext';
import { mapMovieToFilme } from '../../utils/movieMapper';
import type { MainStackParamList } from '../../navigation/MainStack';
import type { Filme, StatusFilme } from '../../types/Filme';
import LoadingOverlay from '../components/LoadingOverlay';
import StarRatingInput from '../components/StarRatingInput';
import { useIdioma } from '../../contexts/IdiomaContext';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
type DetailsNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Detalhes'>;
type DetailsRouteProp = RouteProp<MainStackParamList, 'Detalhes'>;
const hoje = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export default function Detalhes() {
  const styles = useStyles(criarStyles);
  const { cores } = useTema();
  const navigation = useNavigation<DetailsNavigationProp>();
  const { params } = useRoute<DetailsRouteProp>();
  const { filmeId } = params;
  const { showError, showSuccess } = useToast();
  const { traduzir, idiomaTmdb } = useIdioma();
  const [filme, setFilme] = useState<Filme | null>(null);
  const [status, setStatus] = useState<StatusFilme>('WATCHLIST');
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [assistidoEm, setAssistidoEm] = useState(hoje());
  const [naLista, setNaLista] = useState(false);
  const [favorito, setFavorito] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [removendo, setRemovendo] = useState(false);

  const carregarFilme = useCallback(async () => {
    setCarregando(true);
    try {
      const token = await buscarItem('token');
      if (!token) throw new Error('Sua sessão expirou. Entre novamente.');
      const response = await fetch(`${API_BASE_URL}/movies/catalog/${filmeId}?language=${idiomaTmdb}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error ?? 'Não foi possível carregar o filme.');
      const mapped = mapMovieToFilme(data);
      setFilme(mapped);
      setNaLista(Boolean(mapped.naLista));
      setStatus(mapped.status ?? 'WATCHLIST');
      setFavorito(mapped.favorito);
      setNota(mapped.nota);
      setComentario(mapped.comentario ?? '');
      setAssistidoEm(mapped.assistidoEm?.slice(0, 10) ?? hoje());
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Falha de conexão com o servidor.');
      navigation.goBack();
    } finally {
      setCarregando(false);
    }
  }, [filmeId, idiomaTmdb, navigation, showError]);

  useFocusEffect(useCallback(() => { carregarFilme(); }, [carregarFilme]));

  const salvar = async () => {
    if (!filme) return;
    if (status === 'WATCHED' && !/^\d{4}-\d{2}-\d{2}$/.test(assistidoEm)) {
      showError('Informe a data em que assistiu no formato AAAA-MM-DD.');
      return;
    }
    setSalvando(true);
    try {
      const token = await buscarItem('token');
      if (!token) throw new Error('Sua sessão expirou. Entre novamente.');
      const response = await fetch(`${API_BASE_URL}/movies/${filmeId}/library?language=${idiomaTmdb}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          status,
          isFavorite: favorito,
          rating: nota || null,
          comment: comentario.trim() || null,
          watchedAt: status === 'WATCHED' ? new Date(`${assistidoEm}T12:00:00.000Z`).toISOString() : null,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error ?? 'Não foi possível salvar na sua lista.');
      const updated = mapMovieToFilme(data);
      setFilme(updated);
      setNaLista(true);
      setStatus(updated.status ?? status);
      setNota(updated.nota);
      setComentario(updated.comentario ?? '');
      setAssistidoEm(updated.assistidoEm?.slice(0, 10) ?? hoje());
      showSuccess('Registro salvo. Você pode alterar sua avaliação quando quiser.');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Falha de conexão com o servidor.');
    } finally {
      setSalvando(false);
    }
  };

  const alternarFavorito = () => setFavorito((value) => !value);

  const executarRemocao = async () => {
    if (removendo) return;
    setRemovendo(true);
    try {
      const token = await buscarItem('token');
      if (!token) throw new Error('Sua sessão expirou. Entre novamente.');
      const response = await fetch(`${API_BASE_URL}/movies/${filmeId}/library`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? 'Não foi possível remover o filme.');
      }
      setNaLista(false);
      setFavorito(false);
      setStatus('WATCHLIST');
      setNota(0);
      setComentario('');
      setAssistidoEm(hoje());
      showSuccess('Filme removido da sua lista.');
      navigation.goBack();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Falha de conexão com o servidor.');
    } finally {
      setRemovendo(false);
    }
  };

  const removerDaLista = () => {
    const titulo = traduzir('Remover filme');
    const mensagem = `${traduzir('Remover')} “${filme?.titulo}” ${traduzir('da sua lista?')}`;
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm(`${titulo}\n\n${mensagem}`)) void executarRemocao();
      return;
    }
    Alert.alert(titulo, mensagem, [
      { text: traduzir('Cancelar'), style: 'cancel' },
      { text: traduzir('Remover'), style: 'destructive', onPress: () => void executarRemocao() },
    ]);
  };

  if (carregando || !filme) {
    return <SafeAreaView style={styles.safeArea}><LoadingOverlay visible message="Carregando filme..." /><View style={styles.centered} /></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={22} color={cores.text} /></TouchableOpacity>
          <Text style={styles.topBarTitle}>Detalhes do filme</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.posterWrapper}>
          {filme.posterUri ? <Image source={{ uri: filme.posterUri }} style={styles.poster} /> : <View style={[styles.poster, styles.posterFallback]}><Ionicons name="film-outline" size={28} color={cores.text} /></View>}
          <View style={styles.headerInfo}>
            <Text style={styles.titulo}>{filme.titulo}</Text>
            <Text style={styles.metaLine}>{filme.ano || 'Ano não informado'}{filme.duracaoMin ? ` • ${filme.duracaoMin} min` : ''}</Text>
            <View style={styles.ratingRow}><Ionicons name="star" size={16} color={cores.gold} /><Text style={styles.ratingText}>{filme.tmdbRating?.toFixed(1) ?? '—'} TMDB</Text></View>
            {naLista && <View style={styles.statusBadge}><Text style={styles.statusBadgeText}>{status === 'WATCHED' ? 'Assistido' : 'Quero assistir'}</Text></View>}
          </View>
        </View>

        {!!filme.genero && filme.genero !== '—' && <View style={styles.section}><Text style={styles.sectionLabel}>Gêneros</Text><Text style={styles.sectionValue}>{filme.genero}</Text></View>}
        {!!filme.descricao && <View style={styles.card}><Text style={styles.sectionLabel}>Sinopse</Text><Text style={styles.sectionValue}>{filme.descricao}</Text></View>}

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Minha lista</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
            {([{ value: 'WATCHLIST', label: 'Quero assistir' }, { value: 'WATCHED', label: 'Já assisti' }] as const).map((option) => (
              <TouchableOpacity key={option.value} onPress={() => { setStatus(option.value); if (option.value === 'WATCHED' && !assistidoEm) setAssistidoEm(hoje()); }} style={{ flex: 1, padding: 12, borderRadius: 10, backgroundColor: status === option.value ? cores.gold : cores.card }}>
                <Text style={{ color: status === option.value ? cores.onGold : cores.text, textAlign: 'center', fontWeight: '700' }}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={[styles.actionButton, { alignSelf: 'flex-start', marginTop: 12 }]} onPress={alternarFavorito}>
            <Ionicons name={favorito ? 'heart' : 'heart-outline'} size={20} color={favorito ? cores.danger : cores.muted} />
            <Text style={styles.actionButtonText}>{favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}</Text>
          </TouchableOpacity>
        </View>

        {status === 'WATCHED' && <View style={styles.card}>
          <Text style={styles.sectionLabel}>Data em que assistiu (obrigatória)</Text>
          <TextInput value={assistidoEm} onChangeText={setAssistidoEm} placeholder="AAAA-MM-DD" placeholderTextColor={cores.muted} autoCapitalize="none" style={{ color: cores.text, marginTop: 8, padding: 12, borderRadius: 8, backgroundColor: cores.card }} />
        </View>}

        {(status === 'WATCHED' || naLista) && <View style={styles.card}>
          <Text style={[styles.sectionLabel, { marginTop: 18 }]}>Minha nota</Text>
          <View style={{ marginTop: 8 }}><StarRatingInput value={nota} onChange={setNota} /></View>
          <Text style={[styles.sectionLabel, { marginTop: 18 }]}>Comentário (opcional)</Text>
          <TextInput value={comentario} onChangeText={setComentario} multiline maxLength={5000} placeholder="Escreva suas impressões sobre o filme" placeholderTextColor={cores.muted} style={{ color: cores.text, marginTop: 8, minHeight: 100, padding: 12, borderRadius: 8, backgroundColor: cores.card, textAlignVertical: 'top' }} />
          <Text style={{ color: cores.muted, textAlign: 'right', marginTop: 4 }}>{comentario.length}/5000</Text>
        </View>}

        {status === 'WATCHLIST' && !naLista && <View style={styles.card}>
          <Text style={styles.sectionLabel}>Avaliação e comentário</Text>
          <Text style={styles.sectionValue}>Ao marcar como assistido, você poderá registrar a data, uma nota de 1 a 5 estrelas e um comentário.</Text>
        </View>}

        <TouchableOpacity style={[styles.primaryButton, salvando && { opacity: 0.65 }]} onPress={salvar} disabled={salvando}>
          {salvando ? <ActivityIndicator color={cores.onGold} /> : <Text style={styles.primaryButtonText}>{naLista ? 'Salvar alterações' : status === 'WATCHED' ? 'Registrar como assistido' : 'Adicionar à watchlist'}</Text>}
        </TouchableOpacity>
        {naLista && <TouchableOpacity style={{ padding: 16, alignItems: 'center', opacity: removendo ? 0.55 : 1 }} onPress={removerDaLista} disabled={removendo}><Text style={{ color: cores.danger, fontWeight: '700' }}>{removendo ? 'Removendo...' : 'Remover da minha lista'}</Text></TouchableOpacity>}
      </ScrollView>
    </SafeAreaView>
  );
}

import Text from '../components/TextoLocalizado';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Image, Platform, ScrollView, Switch, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../../navigation/MainStack';
import { useTema, useStyles } from '../../contexts/TemaContext';
import { useIdioma } from '../../contexts/IdiomaContext';
import { useToast } from '../../contexts/ToastContext';
import { buscarItem } from '../../lib/storage';
import criarStyles from './styles';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

type Contact = { id: string; name: string; username: string; avatarUrl?: string | null };
type FriendshipRow = { id: number; user: Contact; createdAt: string };
type SearchResult = { user: Contact; relationship: 'NONE' | 'FRIENDS' | 'OUTGOING_PENDING' | 'INCOMING_PENDING' };
type Visibility = {
  shareWatched: boolean;
  shareWatchlist: boolean;
  shareFavorites: boolean;
  shareReviews: boolean;
  shareRecent: boolean;
};
type FriendsData = { friends: FriendshipRow[]; incomingRequests: FriendshipRow[]; outgoingRequests: FriendshipRow[] };

const INITIAL_DATA: FriendsData = { friends: [], incomingRequests: [], outgoingRequests: [] };
const INITIAL_VISIBILITY: Visibility = {
  shareWatched: true,
  shareWatchlist: true,
  shareFavorites: true,
  shareReviews: true,
  shareRecent: true,
};

export default function AmigosScreen() {
  const styles = useStyles(criarStyles);
  const { cores } = useTema();
  const { traduzir } = useIdioma();
  const { showError, showSuccess } = useToast();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [data, setData] = useState(INITIAL_DATA);
  const [visibility, setVisibility] = useState(INITIAL_VISIBILITY);
  const [username, setUsername] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [sending, setSending] = useState(false);
  const [updatingPrivacy, setUpdatingPrivacy] = useState(false);

  const request = useCallback(async (path: string, init?: RequestInit) => {
    const token = await buscarItem('token');
    if (!token) throw new Error('Sua sessão expirou. Entre novamente.');
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        ...init?.headers,
      },
    });
    if (response.status === 204) return null;
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? 'Não foi possível concluir a ação.');
    return result;
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [friends, privacy] = await Promise.all([
        request('/friends'),
        request('/friends/privacy'),
      ]);
      setData(friends);
      setVisibility(privacy);
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Não foi possível carregar seus amigos.');
    } finally {
      setLoading(false);
    }
  }, [request, showError]);

  useFocusEffect(useCallback(() => { void load(); }, [load]));

  const searchUser = async () => {
    if (!username.trim()) {
      showError('Digite o username da pessoa que deseja encontrar.');
      return;
    }
    setSearching(true);
    try {
      const result = await request(`/friends/search?username=${encodeURIComponent(username.trim().replace(/^@/, ''))}`);
      setSearchResult(result);
    } catch (error) {
      setSearchResult(null);
      showError(error instanceof Error ? error.message : 'Não foi possível pesquisar esse usuário.');
    } finally {
      setSearching(false);
    }
  };

  const sendRequest = async () => {
    if (!searchResult || searchResult.relationship !== 'NONE') return;
    setSending(true);
    try {
      await request('/friends/requests', { method: 'POST', body: JSON.stringify({ username: searchResult.user.username }) });
      setSearchResult({ ...searchResult, relationship: 'OUTGOING_PENDING' });
      showSuccess('Solicitação de amizade enviada.');
      await load();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Não foi possível enviar a solicitação.');
    } finally {
      setSending(false);
    }
  };

  const performRequestAction = async (id: number, action: 'accept' | 'remove') => {
    try {
      if (action === 'accept') {
        await request(`/friends/requests/${id}/accept`, { method: 'POST' });
        showSuccess('Amizade aceita.');
      } else {
        await request(`/friends/requests/${id}`, { method: 'DELETE' });
      }
      await load();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Não foi possível atualizar a amizade.');
    }
  };

  const confirmRemove = (id: number, name: string) => {
    const message = `${traduzir('Deseja remover')} ${name}?`;
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm(message)) void performRequestAction(id, 'remove');
      return;
    }
    Alert.alert(traduzir('Remover amigo'), message, [
      { text: traduzir('Cancelar'), style: 'cancel' },
      { text: traduzir('Remover'), style: 'destructive', onPress: () => void performRequestAction(id, 'remove') },
    ]);
  };

  const setPrivacyOption = async (key: keyof Visibility, value: boolean) => {
    const previous = visibility;
    const updated = { ...visibility, [key]: value };
    setVisibility(updated);
    setUpdatingPrivacy(true);
    try {
      const saved = await request('/friends/privacy', { method: 'PATCH', body: JSON.stringify({ [key]: value }) });
      setVisibility(saved);
      showSuccess('Privacidade atualizada.');
    } catch (error) {
      setVisibility(previous);
      showError(error instanceof Error ? error.message : 'Não foi possível salvar a privacidade.');
    } finally {
      setUpdatingPrivacy(false);
    }
  };

  const renderContact = (row: FriendshipRow, kind: 'friend' | 'incoming' | 'outgoing') => (
    <View key={row.id} style={[styles.personRow, { borderBottomColor: cores.border }]}>
      <TouchableOpacity
        style={styles.personMain}
        disabled={kind !== 'friend'}
        onPress={() => navigation.navigate('AmigoAtividade', { userId: row.user.id, name: row.user.name, username: row.user.username })}
      >
        {row.user.avatarUrl ? <Image source={{ uri: row.user.avatarUrl }} style={styles.avatar} /> : (
          <View style={[styles.avatar, styles.avatarFallback, { backgroundColor: cores.posterFallback }]}>
            <Ionicons name="person" size={18} color={cores.muted} />
          </View>
        )}
        <View style={styles.personText}>
          <Text style={[styles.personName, { color: cores.text }]}>{row.user.name}</Text>
          <Text style={[styles.personEmail, { color: cores.muted }]}>@{row.user.username}</Text>
        </View>
      </TouchableOpacity>
      {kind === 'incoming' ? (
        <View style={styles.actionGroup}>
          <TouchableOpacity style={[styles.smallButton, { backgroundColor: cores.gold }]} onPress={() => void performRequestAction(row.id, 'accept')}>
            <Text style={[styles.smallButtonText, { color: cores.onGold }]}>{traduzir('Aceitar')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconAction, { borderColor: cores.border }]} onPress={() => void performRequestAction(row.id, 'remove')}>
            <Ionicons name="close" size={18} color={cores.muted} />
          </TouchableOpacity>
        </View>
      ) : kind === 'outgoing' ? (
        <TouchableOpacity style={[styles.smallButton, { borderColor: cores.border, borderWidth: 1 }]} onPress={() => void performRequestAction(row.id, 'remove')}>
          <Text style={[styles.smallButtonText, { color: cores.muted }]}>{traduzir('Cancelar')}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.actionGroup}>
          <TouchableOpacity style={[styles.iconAction, { borderColor: cores.border }]} onPress={() => confirmRemove(row.id, row.user.name)}>
            <Ionicons name="person-remove-outline" size={17} color={cores.danger} />
          </TouchableOpacity>
          <Ionicons name="chevron-forward" size={16} color={cores.muted} />
        </View>
      )}
    </View>
  );

  const privacyRows: { key: keyof Visibility; label: string; description: string }[] = [
    { key: 'shareWatched', label: 'Filmes assistidos', description: 'Seus amigos podem ver quais filmes você já assistiu.' },
    { key: 'shareWatchlist', label: 'Watchlist', description: 'Seus amigos podem ver os filmes que você pretende assistir.' },
    { key: 'shareFavorites', label: 'Favoritos', description: 'Seus amigos podem identificar seus filmes favoritos.' },
    { key: 'shareReviews', label: 'Notas e comentários', description: 'Seus amigos podem ver suas avaliações e resenhas.' },
    { key: 'shareRecent', label: 'Atividade recente e datas', description: 'Mostra datas e os filmes adicionados mais recentemente.' },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: cores.background }]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={21} color={cores.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: cores.text }]}>{traduzir('Amigos')}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <Text style={[styles.intro, { color: cores.muted }]}>{traduzir('Encontre pessoas pelo username para compartilhar sua atividade de filmes.')}</Text>
        <View style={[styles.addCard, { backgroundColor: cores.card, borderColor: cores.border }]}>
          <Text style={[styles.sectionTitle, { color: cores.text }]}>{traduzir('Adicionar amigo')}</Text>
          <TextInput
            value={username}
            onChangeText={(value) => { setUsername(value); setSearchResult(null); }}
            placeholder={traduzir('Username (ex.: @cinefilo_123)')}
            placeholderTextColor={cores.placeholder}
            autoCapitalize="none"
            autoCorrect={false}
            style={[styles.input, { color: cores.text, borderColor: cores.border, backgroundColor: cores.background }]}
          />
          <TouchableOpacity style={[styles.primaryButton, { backgroundColor: cores.gold }]} onPress={() => void searchUser()} disabled={searching}>
            {searching ? <ActivityIndicator color={cores.onGold} /> : <Text style={[styles.primaryButtonText, { color: cores.onGold }]}>{traduzir('Pesquisar usuário')}</Text>}
          </TouchableOpacity>
          {searchResult ? <View style={[styles.searchResult, { borderTopColor: cores.border }]}>
            {searchResult.user.avatarUrl ? <Image source={{ uri: searchResult.user.avatarUrl }} style={styles.avatar} /> : <View style={[styles.avatar, styles.avatarFallback, { backgroundColor: cores.posterFallback }]}><Ionicons name="person" size={18} color={cores.muted} /></View>}
            <View style={styles.personText}>
              <Text style={[styles.personName, { color: cores.text }]}>{searchResult.user.name}</Text>
              <Text style={[styles.personEmail, { color: cores.muted }]}>@{searchResult.user.username}</Text>
            </View>
            {searchResult.relationship === 'NONE' ? <TouchableOpacity style={[styles.smallButton, { backgroundColor: cores.gold }]} onPress={() => void sendRequest()} disabled={sending}>
              {sending ? <ActivityIndicator size="small" color={cores.onGold} /> : <Text style={[styles.smallButtonText, { color: cores.onGold }]}>{traduzir('Adicionar')}</Text>}
            </TouchableOpacity> : <Text style={[styles.relationshipLabel, { color: cores.muted }]}>{traduzir(searchResult.relationship === 'FRIENDS' ? 'Já são amigos' : searchResult.relationship === 'OUTGOING_PENDING' ? 'Solicitação enviada' : 'Solicitação recebida')}</Text>}
          </View> : null}
        </View>

        {loading ? <ActivityIndicator style={styles.loader} color={cores.gold} /> : (
          <>
            {data.incomingRequests.length > 0 && (
              <View style={[styles.listCard, { backgroundColor: cores.card, borderColor: cores.border }]}>
                <Text style={[styles.sectionTitle, { color: cores.text }]}>{traduzir('Solicitações recebidas')} ({data.incomingRequests.length})</Text>
                {data.incomingRequests.map((row) => renderContact(row, 'incoming'))}
              </View>
            )}

            {data.outgoingRequests.length > 0 && (
              <View style={[styles.listCard, { backgroundColor: cores.card, borderColor: cores.border }]}>
                <Text style={[styles.sectionTitle, { color: cores.text }]}>{traduzir('Solicitações enviadas')} ({data.outgoingRequests.length})</Text>
                {data.outgoingRequests.map((row) => renderContact(row, 'outgoing'))}
              </View>
            )}

            <View style={[styles.listCard, { backgroundColor: cores.card, borderColor: cores.border }]}>
              <Text style={[styles.sectionTitle, { color: cores.text }]}>{traduzir('Meus amigos')} ({data.friends.length})</Text>
              {data.friends.length ? data.friends.map((row) => renderContact(row, 'friend')) : (
                <Text style={[styles.empty, { color: cores.muted }]}>{traduzir('Você ainda não tem amigos adicionados.')}</Text>
              )}
            </View>

            <View style={[styles.listCard, { backgroundColor: cores.card, borderColor: cores.border }]}>
              <View style={styles.privacyHeader}>
                <View style={styles.privacyTitleBlock}>
                  <Text style={[styles.sectionTitle, { color: cores.text }]}>{traduzir('Privacidade para amigos')}</Text>
                  <Text style={[styles.privacyHint, { color: cores.muted }]}>{traduzir('Controle quais dados seus amigos podem ver.')}</Text>
                </View>
                {updatingPrivacy ? <ActivityIndicator size="small" color={cores.gold} /> : null}
              </View>
              {privacyRows.map((item, index) => (
                <View key={item.key} style={[styles.privacyRow, index < privacyRows.length - 1 && { borderBottomColor: cores.border, borderBottomWidth: 1 }]}>
                  <View style={styles.privacyTextBlock}>
                    <Text style={[styles.privacyLabel, { color: cores.text }]}>{traduzir(item.label)}</Text>
                    <Text style={[styles.privacyDescription, { color: cores.muted }]}>{traduzir(item.description)}</Text>
                  </View>
                  <Switch
                    value={visibility[item.key]}
                    onValueChange={(value) => void setPrivacyOption(item.key, value)}
                    trackColor={{ false: cores.border, true: cores.gold }}
                    thumbColor={cores.white}
                  />
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

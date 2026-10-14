import Text from '../components/TextoLocalizado';
import { useStyles, useTema } from '../../contexts/TemaContext';
import React, { useCallback, useState } from 'react';
import { View, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import criarStyles from './styles';
import LoadingOverlay from '../components/LoadingOverlay';
import { useToast } from '../../contexts/ToastContext';
import { buscarItem, removerItem } from '../../lib/storage';
import type { MainStackParamList } from '../../navigation/MainStack';
import { sincronizarConta } from '../../lib/sincronizarConta';
import { useIdioma } from '../../contexts/IdiomaContext';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

interface Usuario {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  avatarUrl?: string | null;
}

interface Stats {
  total: number;
  assistidos: number;
  queroAssistir: number;
  favoritos: number;
}

const STATS_VAZIO: Stats = { total: 0, assistidos: 0, queroAssistir: 0, favoritos: 0 };

type PerfilNavigationProp = NativeStackNavigationProp<MainStackParamList>;

function formatarData(iso: string): string {
  const data = new Date(iso);
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  return `${dia}/${mes}/${data.getFullYear()}`;
}

export default function Perfil() {
  const styles = useStyles(criarStyles);
  const { cores } = useTema();
  const navigation = useNavigation<PerfilNavigationProp>();
  const { showError, showSuccess } = useToast();
  const { traduzir } = useIdioma();

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [stats, setStats] = useState<Stats>(STATS_VAZIO);
  const [carregando, setCarregando] = useState(true);
  const [sincronizando, setSincronizando] = useState(false);

  const carregarPerfil = useCallback(async () => {
    setCarregando(true);
    try {
      const token = await buscarItem('token');
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };
      const [respostaUsuario, respostaStats] = await Promise.all([
        fetch(`${API_BASE_URL}/users/me`, { headers }),
        fetch(`${API_BASE_URL}/movies/stats`, { headers }),
      ]);

      if (respostaUsuario.ok) {
        setUsuario(await respostaUsuario.json());
      }
      if (respostaStats.ok) {
        setStats(await respostaStats.json());
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      showError('Falha de conexão com o servidor.');
    } finally {
      setCarregando(false);
    }
  }, [showError]);

  useFocusEffect(
    useCallback(() => {
      carregarPerfil();
    }, [carregarPerfil]),
  );

  const fotoParaExibir = usuario?.avatarUrl ?? null;

  const handleAlterarFoto = () => navigation.navigate('EditarPerfil');

  const handleSincronizar = async () => {
    setSincronizando(true);
    try {
      await sincronizarConta();
      await carregarPerfil();
      showSuccess('Dados atualizados.');
    } catch {
      showError('Não foi possível atualizar seus dados.');
    } finally {
      setSincronizando(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(traduzir('Sair da conta'), traduzir('Deseja realmente sair da sua conta?'), [
      { text: traduzir('Cancelar'), style: 'cancel' },
      {
        text: traduzir('Sair da conta'),
        style: 'destructive',
        onPress: async () => {
          try {
            await removerItem('token');
            await removerItem('userName');
            (navigation as any).getParent('RootStack')?.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          } catch {
            showError(traduzir('Não foi possível sair da conta. Tente novamente.'));
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LoadingOverlay visible={carregando} message="Carregando perfil..." />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Text style={styles.title}>Meu Perfil</Text>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Configuracoes')}>
            <Ionicons name="settings-outline" size={18} color={cores.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.headerCard}>
          <TouchableOpacity style={styles.avatarWrapper} onPress={handleAlterarFoto} activeOpacity={0.85}>
            <View style={styles.avatarCircle}>
              {fotoParaExibir ? (
                <Image source={{ uri: fotoParaExibir }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={38} color={cores.muted} />
              )}
            </View>
            <View style={styles.avatarCameraBadge}>
              <Ionicons name="camera" size={13} color={cores.onGold} />
            </View>
          </TouchableOpacity>

          <Text style={styles.nome}>{usuario?.name ?? '—'}</Text>
          <Text style={styles.email}>{usuario?.email ?? '—'}</Text>

          {usuario?.createdAt && (
            <View style={styles.membroRow}>
              <Ionicons name="calendar-outline" size={13} color={cores.muted} />
              <Text style={styles.membroText}>Membro desde {formatarData(usuario.createdAt)}</Text>
            </View>
          )}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <View style={[styles.statIconCircle, { backgroundColor: cores.card }]}>
              <Ionicons name="film-outline" size={16} color={cores.info} />
            </View>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total de filmes</Text>
          </View>
          <View style={styles.statBox}>
            <View style={[styles.statIconCircle, { backgroundColor: cores.card }]}>
              <Ionicons name="heart" size={16} color={cores.gold} />
            </View>
            <Text style={styles.statValue}>{stats.favoritos}</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </View>
          <View style={styles.statBox}>
            <View style={[styles.statIconCircle, { backgroundColor: cores.card }]}>
              <Ionicons name="checkmark-circle-outline" size={16} color={cores.success} />
            </View>
            <Text style={styles.statValue}>{stats.assistidos}</Text>
            <Text style={styles.statLabel}>Assistidos</Text>
          </View>
          <View style={[styles.statBox, styles.statBoxLast]}>
            <View style={[styles.statIconCircle, { backgroundColor: cores.card }]}>
              <Ionicons name="bookmark-outline" size={16} color={cores.danger} />
            </View>
            <Text style={styles.statValue}>{stats.queroAssistir}</Text>
            <Text style={styles.statLabel}>Quero assistir</Text>
          </View>
        </View>

        <View style={styles.menuCard}>
          <TouchableOpacity
            style={[styles.menuRow, styles.menuRowBorder]}
            onPress={() => navigation.navigate("EditarPerfil")}
          >
            <View style={styles.menuIcon}>
              <Ionicons name="person-outline" size={18} color={cores.text} />
            </View>
            <Text style={styles.menuLabel}>Editar perfil</Text>
            <Ionicons name="chevron-forward" size={16} color={cores.muted} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuRow, styles.menuRowBorder]} onPress={handleAlterarFoto}>
            <View style={styles.menuIcon}>
              <Ionicons name="camera-outline" size={18} color={cores.text} />
            </View>
            <Text style={styles.menuLabel}>Alterar foto</Text>
            <Ionicons name="chevron-forward" size={16} color={cores.muted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuRow, styles.menuRowBorder]}
            onPress={() => navigation.navigate("AlterarSenha")}
          >
            <View style={styles.menuIcon}>
              <Ionicons name="key-outline" size={18} color={cores.text} />
            </View>
            <Text style={styles.menuLabel}>Alterar senha</Text>
            <Ionicons name="chevron-forward" size={16} color={cores.muted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuRow, styles.menuRowBorder]}
            onPress={() => navigation.navigate('Configuracoes')}
          >
            <View style={styles.menuIcon}>
              <Ionicons name="options-outline" size={18} color={cores.text} />
            </View>
            <Text style={styles.menuLabel}>Preferências</Text>
            <Ionicons name="chevron-forward" size={16} color={cores.muted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuRow} onPress={() => void handleSincronizar()} disabled={sincronizando}>
            <View style={styles.menuIcon}>
              <Ionicons name="cloud-outline" size={18} color={cores.text} />
            </View>
            <Text style={styles.menuLabel}>{sincronizando ? 'Sincronizando...' : 'Sincronizar dados agora'}</Text>
            {sincronizando ? <ActivityIndicator size="small" color={cores.gold} /> : <Ionicons name="refresh-outline" size={16} color={cores.muted} />}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color={cores.danger} />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

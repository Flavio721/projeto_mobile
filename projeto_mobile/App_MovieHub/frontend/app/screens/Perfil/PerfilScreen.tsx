import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styles, { COLORS } from './styles';
import LoadingOverlay from '../components/LoadingOverlay';
import { useToast } from '../../contexts/ToastContext';
import { buscarItem, removerItem } from '../../lib/storage';
import type { MainStackParamList } from '../../navigation/MainStack';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

interface Usuario {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  avatarUrl?: string; // TODO: campo ainda não existe no schema — ver aviso abaixo
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
  const navigation = useNavigation<PerfilNavigationProp>();
  const { showError } = useToast();

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [avatarLocal, setAvatarLocal] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>(STATS_VAZIO);
  const [carregando, setCarregando] = useState(true);

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

  // A foto do banco (usuario.avatarUrl) tem prioridade; se o usuário acabou
  // de escolher uma foto nesta sessão mas ela ainda não foi salva no banco
  // (ver aviso sobre o campo faltando no schema), mostra a prévia local.
  const fotoParaExibir = usuario?.avatarUrl ?? avatarLocal;

  const handleAlterarFoto = () => {
    navigation.navigate('Galeria', {
      onSelecionar: (uri) => {
        setAvatarLocal(uri);
        showError('Foto selecionada, mas ainda não é salva na conta — falta endpoint no backend.');
      },
    });
  };

  const handleLogout = async () => {
  console.log("ENTROU NA FUNÇÃO");

  await removerItem("token");
  console.log("TOKEN REMOVIDO");

  await removerItem("userName");
  console.log("USERNAME REMOVIDO");

  const parent = (navigation as any).getParent("RootStack");

  console.log("PARENT:", parent);

  parent?.reset({
    index: 0,
    routes: [{ name: "Login" }],
  });

  console.log("RESET EXECUTADO");
  (navigation as any).getParent('RootStack')?.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });

};

  const itemEmDesenvolvimento = (nome: string) => showError(`${nome} ainda não foi implementado.`);

  return (
    <SafeAreaView style={styles.safeArea}>
      <LoadingOverlay visible={carregando} message="Carregando perfil..." />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Text style={styles.title}>Meu Perfil</Text>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Configuracoes')}>
            <Ionicons name="settings-outline" size={18} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.headerCard}>
          <TouchableOpacity style={styles.avatarWrapper} onPress={handleAlterarFoto} activeOpacity={0.85}>
            <View style={styles.avatarCircle}>
              {fotoParaExibir ? (
                <Image source={{ uri: fotoParaExibir }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={38} color={COLORS.muted} />
              )}
            </View>
            <View style={styles.avatarCameraBadge}>
              <Ionicons name="camera" size={13} color="#241C00" />
            </View>
          </TouchableOpacity>

          <Text style={styles.nome}>{usuario?.name ?? '—'}</Text>
          <Text style={styles.email}>{usuario?.email ?? '—'}</Text>

          {usuario?.createdAt && (
            <View style={styles.membroRow}>
              <Ionicons name="calendar-outline" size={13} color={COLORS.muted} />
              <Text style={styles.membroText}>Membro desde {formatarData(usuario.createdAt)}</Text>
            </View>
          )}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <View style={[styles.statIconCircle, { backgroundColor: 'rgba(78,161,243,0.15)' }]}>
              <Ionicons name="film-outline" size={16} color="#4EA1F3" />
            </View>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total de filmes</Text>
          </View>
          <View style={styles.statBox}>
            <View style={[styles.statIconCircle, { backgroundColor: 'rgba(244,180,0,0.15)' }]}>
              <Ionicons name="heart" size={16} color={COLORS.gold} />
            </View>
            <Text style={styles.statValue}>{stats.favoritos}</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </View>
          <View style={styles.statBox}>
            <View style={[styles.statIconCircle, { backgroundColor: 'rgba(61,220,151,0.15)' }]}>
              <Ionicons name="checkmark-circle-outline" size={16} color="#3DDC97" />
            </View>
            <Text style={styles.statValue}>{stats.assistidos}</Text>
            <Text style={styles.statLabel}>Assistidos</Text>
          </View>
          <View style={[styles.statBox, styles.statBoxLast]}>
            <View style={[styles.statIconCircle, { backgroundColor: 'rgba(229,72,77,0.15)' }]}>
              <Ionicons name="bookmark-outline" size={16} color="#E5484D" />
            </View>
            <Text style={styles.statValue}>{stats.queroAssistir}</Text>
            <Text style={styles.statLabel}>Quero assistir</Text>
          </View>
        </View>

        <View style={styles.menuCard}>
          <TouchableOpacity
            style={[styles.menuRow, styles.menuRowBorder]}
            onPress={() => itemEmDesenvolvimento('Editar perfil')}
          >
            <View style={styles.menuIcon}>
              <Ionicons name="person-outline" size={18} color={COLORS.white} />
            </View>
            <Text style={styles.menuLabel}>Editar perfil</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.muted} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuRow, styles.menuRowBorder]} onPress={handleAlterarFoto}>
            <View style={styles.menuIcon}>
              <Ionicons name="camera-outline" size={18} color={COLORS.white} />
            </View>
            <Text style={styles.menuLabel}>Alterar foto</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.muted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuRow, styles.menuRowBorder]}
            onPress={() => itemEmDesenvolvimento('Alterar senha')}
          >
            <View style={styles.menuIcon}>
              <Ionicons name="key-outline" size={18} color={COLORS.white} />
            </View>
            <Text style={styles.menuLabel}>Alterar senha</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.muted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuRow, styles.menuRowBorder]}
            onPress={() => itemEmDesenvolvimento('Preferências')}
          >
            <View style={styles.menuIcon}>
              <Ionicons name="options-outline" size={18} color={COLORS.white} />
            </View>
            <Text style={styles.menuLabel}>Preferências</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.muted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuRow} onPress={() => itemEmDesenvolvimento('Sincronizar dados')}>
            <View style={styles.menuIcon}>
              <Ionicons name="cloud-outline" size={18} color={COLORS.white} />
            </View>
            <Text style={styles.menuLabel}>Sincronizar dados</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.muted} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color={COLORS.danger} />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { criarStyles } from './style';
import { useStyles, useTema } from '../../contexts/TemaContext';
import { useToast } from '../../contexts/ToastContext';
import LoadingOverlay from '../components/LoadingOverlay';
import { buscarItem, salvarItem } from '../../lib/storage';
import { uploadImagem } from '../../lib/uploadImagem';
import type { MainStackParamList } from '../../navigation/MainStack';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

type EditarPerfilNavigationProp = NativeStackNavigationProp<MainStackParamList>;

export default function EditarPerfil() {
  const navigation = useNavigation<EditarPerfilNavigationProp>();
  const styles = useStyles(criarStyles);
  const { cores } = useTema();
  const { showSuccess, showError } = useToast();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const carregarPerfil = useCallback(async () => {
    setCarregando(true);
    try {
      const token = await buscarItem('token');
      if (!token) {
        showError('Sessão expirada. Faça login novamente.');
        navigation.goBack();
        return;
      }

      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        showError('Não foi possível carregar seu perfil.');
        navigation.goBack();
        return;
      }

      const usuario = await response.json();
      setNome(usuario.name ?? '');
      setEmail(usuario.email ?? '');
      setAvatarUri(usuario.avatarUrl ?? null);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      showError('Falha de conexão com o servidor.');
      navigation.goBack();
    } finally {
      setCarregando(false);
    }
  }, [navigation, showError]);

  useFocusEffect(
    useCallback(() => {
      carregarPerfil();
    }, [carregarPerfil]),
  );

  const escolherFoto = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      showError('Autorize o acesso à galeria para escolher uma foto.');
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      aspect: [1, 1],
      allowsEditing: true,
    });
    if (!resultado.canceled) {
      setAvatarUri(resultado.assets[0].uri);
    }
  };

  const handleSalvar = async () => {
    if (nome.trim().length < 2) {
      showError('O nome precisa ter ao menos 2 caracteres.');
      return;
    }

    setSalvando(true);
    try {
      const token = await buscarItem('token');
      if (!token) {
        showError('Sessão expirada. Faça login novamente.');
        return;
      }

      // Se a foto continua sendo a mesma URL do servidor, uploadImagem()
      // devolve ela mesma sem reenviar nada.
      let avatarFinal: string | null = null;
      if (avatarUri) {
        try {
          avatarFinal = await uploadImagem(avatarUri);
        } catch (error: any) {
          showError(error.message ?? 'Falha ao enviar a foto.');
          return;
        }
      }

      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: nome.trim(), avatarUrl: avatarFinal }),
      });

      const data = await response.json();

      if (!response.ok) {
        showError(data.error ?? 'Não foi possível salvar as alterações.');
        return;
      }

      // O nome também fica salvo localmente porque a Home usa ele no "Olá, X"
      // sem precisar esperar uma chamada de API.
      await salvarItem('userName', data.name);

      showSuccess('Perfil atualizado com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      showError('Falha de conexão com o servidor.');
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LoadingOverlay visible message="Carregando perfil..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <LoadingOverlay visible={salvando} message="Salvando alterações..." />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={cores.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Editar Perfil</Text>
        </View>

        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={escolherFoto} activeOpacity={0.85}>
            <View style={styles.avatarCircle}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={42} color={cores.muted} />
              )}
            </View>
            <View style={styles.avatarBadge}>
              <Ionicons name="camera" size={14} color={cores.onGold} />
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarHint}>Toque para alterar a foto</Text>
          {!!avatarUri && (
            <TouchableOpacity onPress={() => setAvatarUri(null)}>
              <Text style={styles.removerFotoText}>Remover foto</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Nome completo</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={18} color={cores.placeholder} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome"
              placeholderTextColor={cores.placeholder}
              value={nome}
              onChangeText={setNome}
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>E-mail</Text>
          <View style={[styles.inputWrapper, styles.inputWrapperDisabled]}>
            <Ionicons name="mail-outline" size={18} color={cores.placeholder} style={styles.inputIcon} />
            <TextInput style={styles.input} value={email} editable={false} />
          </View>
          <Text style={styles.hint}>
            O e-mail é usado pra entrar na conta e não pode ser alterado por aqui.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, salvando && { opacity: 0.6 }]}
          onPress={handleSalvar}
          disabled={salvando}
        >
          <Text style={styles.primaryButtonText}>Salvar alterações</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
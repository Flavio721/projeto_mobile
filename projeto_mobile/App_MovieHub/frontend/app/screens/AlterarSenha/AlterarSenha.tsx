import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { criarStyles } from './style';
import { useStyles, useTema } from '../../contexts/TemaContext';
import { useToast } from '../../contexts/ToastContext';
import LoadingOverlay from '../components/LoadingOverlay';
import { buscarItem } from '../../lib/storage';
import type { MainStackParamList } from '../../navigation/MainStack';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

type AlterarSenhaNavigationProp = NativeStackNavigationProp<MainStackParamList>;

// Medidor simples só pra dar retorno visual — não bloqueia nada, quem decide
// o que é senha válida é o backend (mínimo 6 caracteres).
function calcularForca(senha: string): { nivel: number; rotulo: string } {
  if (!senha) return { nivel: 0, rotulo: '' };
  let pontos = 0;
  if (senha.length >= 6) pontos++;
  if (senha.length >= 10) pontos++;
  if (/[A-Z]/.test(senha) && /[a-z]/.test(senha)) pontos++;
  if (/[0-9]/.test(senha)) pontos++;
  if (/[^A-Za-z0-9]/.test(senha)) pontos++;

  if (pontos <= 1) return { nivel: 1, rotulo: 'Fraca' };
  if (pontos <= 3) return { nivel: 2, rotulo: 'Média' };
  return { nivel: 3, rotulo: 'Forte' };
}

export default function AlterarSenha() {
  const navigation = useNavigation<AlterarSenhaNavigationProp>();
  const styles = useStyles(criarStyles);
  const { cores } = useTema();
  const { showSuccess, showError } = useToast();

  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [verAtual, setVerAtual] = useState(false);
  const [verNova, setVerNova] = useState(false);
  const [verConfirmar, setVerConfirmar] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const forca = calcularForca(novaSenha);
  const corForca =
    forca.nivel === 3 ? cores.success : forca.nivel === 2 ? cores.gold : cores.danger;

  const handleSalvar = async () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      showError('Preencha todos os campos.');
      return;
    }
    if (novaSenha.length < 6) {
      showError('A nova senha precisa ter ao menos 6 caracteres.');
      return;
    }
    if (novaSenha !== confirmarSenha) {
      showError('A confirmação não bate com a nova senha.');
      return;
    }
    if (novaSenha === senhaAtual) {
      showError('A nova senha precisa ser diferente da atual.');
      return;
    }

    setSalvando(true);
    try {
      const token = await buscarItem('token');
      if (!token) {
        showError('Sessão expirada. Faça login novamente.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/users/me/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword: senhaAtual, newPassword: novaSenha }),
      });

      const data = await response.json();

      if (!response.ok) {
        showError(data.error ?? 'Não foi possível alterar a senha.');
        return;
      }

      showSuccess('Senha alterada com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      showError('Falha de conexão com o servidor.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LoadingOverlay visible={salvando} message="Alterando senha..." />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={cores.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Alterar Senha</Text>
        </View>

        <View style={styles.avisoBox}>
          <Ionicons name="shield-checkmark-outline" size={20} color={cores.gold} />
          <Text style={styles.avisoTexto}>
            Pedimos sua senha atual para confirmar que é você mesmo alterando a conta.
          </Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Senha atual</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={18} color={cores.placeholder} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha atual"
              placeholderTextColor={cores.placeholder}
              value={senhaAtual}
              onChangeText={setSenhaAtual}
              secureTextEntry={!verAtual}
            />
            <TouchableOpacity onPress={() => setVerAtual((v) => !v)}>
              <Ionicons
                name={verAtual ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={cores.placeholder}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Nova senha</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="key-outline" size={18} color={cores.placeholder} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor={cores.placeholder}
              value={novaSenha}
              onChangeText={setNovaSenha}
              secureTextEntry={!verNova}
            />
            <TouchableOpacity onPress={() => setVerNova((v) => !v)}>
              <Ionicons
                name={verNova ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={cores.placeholder}
              />
            </TouchableOpacity>
          </View>
          {!!novaSenha && (
            <View style={styles.forcaRow}>
              <View style={styles.forcaBarra}>
                <View
                  style={[
                    styles.forcaPreenchimento,
                    { width: `${(forca.nivel / 3) * 100}%`, backgroundColor: corForca },
                  ]}
                />
              </View>
              <Text style={[styles.forcaTexto, { color: corForca }]}>{forca.rotulo}</Text>
            </View>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Confirmar nova senha</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={18} color={cores.placeholder} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Digite novamente a nova senha"
              placeholderTextColor={cores.placeholder}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry={!verConfirmar}
            />
            <TouchableOpacity onPress={() => setVerConfirmar((v) => !v)}>
              <Ionicons
                name={verConfirmar ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={cores.placeholder}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, salvando && { opacity: 0.6 }]}
          onPress={handleSalvar}
          disabled={salvando}
        >
          <Text style={styles.primaryButtonText}>Alterar senha</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles, { COLORS } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/RootStack";
import { useToast } from '../../contexts/ToastContext';
import LoadingOverlay from '../components/LoadingOverlay';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

type CadastroNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Cadastro'>;

export default function CadastroScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation = useNavigation<CadastroNavigationProp>();
  const { showSuccess, showError } = useToast();

  const handleCadastro = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      showError('Preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      showError('As senhas não coincidem.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/users/cadastro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showError(data.error ?? 'Não foi possível cadastrar.');
        return;
      }

      showSuccess('Conta criada com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      showError('Falha de conexão com o servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LoadingOverlay visible={isSubmitting} message="Criando sua conta..." />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <View style={styles.topBarTitles}>
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>Preencha os dados abaixo</Text>
          </View>
        </View>

        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Ionicons name="camera-outline" size={30} color={COLORS.white} />
            <View style={styles.avatarBadge}>
              <Ionicons name="add" size={16} color="#241C00" />
            </View>
          </View>
          <Text style={styles.avatarHint}>Adicionar foto (opcional)</Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Nome completo</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="person-outline"
              size={18}
              color={COLORS.placeholder}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome"
              placeholderTextColor={COLORS.placeholder}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>E-mail</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="mail-outline"
              size={18}
              color={COLORS.placeholder}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor={COLORS.placeholder}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Senha</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color={COLORS.placeholder}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor={COLORS.placeholder}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={COLORS.placeholder}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Confirmar senha</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color={COLORS.placeholder}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Digite novamente sua senha"
              placeholderTextColor={COLORS.placeholder}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword((prev) => !prev)}
            >
              <Ionicons
                name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={COLORS.placeholder}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, isSubmitting && { opacity: 0.6 }]}
          onPress={handleCadastro}
          disabled={isSubmitting}
        >
          <Text style={styles.primaryButtonText}>Cadastrar</Text>
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Já tem uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.footerLink}>Fazer login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
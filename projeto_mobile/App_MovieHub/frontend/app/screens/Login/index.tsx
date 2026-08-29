import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import styles, { COLORS } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../App";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { salvarItem } from "../../lib/storage";


// const API_BASE_URL = "http://IP_DA_MAQUINA:3000";
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

type LoginNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigation = useNavigation<LoginNavigationProp>();

  const handleLogin = async () => {
    console.log("Entrou na função");
    if (!email || !password) return;
    console.log("Passou do if");

    try {
      console.log("Entrou no try");
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
  

      if (!response.ok) {
        Alert.alert("Erro", data.error ?? "Não foi possível entrar.");
        return;
      }

      Alert.alert("Sucesso", "Login efetuado com sucesso!");
      await salvarItem("token", data.token);
      await salvarItem("userName", data.user.name);
      navigation.reset({ index: 0, routes: [{ name: "Main" }] });
    } catch (error) {
      console.error("Erro: ", error);
      Alert.alert("Erro", "Erro ao fazer login");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <MaterialCommunityIcons
              name="movie-open-outline"
              size={30}
              color={COLORS.gold}
            />
            <Text style={styles.logoText}>MovieHub</Text>
          </View>
          <Text style={styles.subtitle}>Faça login para continuar</Text>
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
              placeholder="Digite sua senha"
              placeholderTextColor={COLORS.placeholder}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={18}
                color={COLORS.placeholder}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.optionsRow}>
          <TouchableOpacity
            style={styles.rememberRow}
            onPress={() => setRememberMe((prev) => !prev)}
          >
            <MaterialIcons
              name={rememberMe ? "check-box" : "check-box-outline-blank"}
              size={18}
              color={rememberMe ? COLORS.gold : COLORS.placeholder}
            />
            <Text style={styles.rememberText}>Manter conectado</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.forgotText}>Esqueci minha senha</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
          <Text style={styles.primaryButtonText}>Entrar</Text>
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Não tem uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
            <Text style={styles.footerLink}>Criar conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

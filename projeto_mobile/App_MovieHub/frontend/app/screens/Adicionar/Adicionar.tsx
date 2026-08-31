import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import styles, { COLORS } from "./styles";
import SelectField from "./components/SelectField";
import StarRatingInput from "./components/StarRatingInput";
import type { MainStackParamList } from "../../navigation/MainStack";
import type { StatusFilme } from "../../types/Filme";
import { buscarItem } from "../../lib/storage";
import LoadingOverlay from "./components/LoadingOverlay";
import { useToast } from "../../contexts/ToastContext";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const GENEROS = [
  "Ação",
  "Aventura",
  "Comédia",
  "Drama",
  "Ficção Científica",
  "Terror",
  "Suspense",
  "Romance",
  "Animação",
  "Documentário",
  "Fantasia",
  "Crime",
];

const STATUS_OPTIONS: { label: string; value: StatusFilme }[] = [
  { label: "Assistido", value: "WATCHED" },
  { label: "Quero assistir", value: "WATCHLIST" },
];

type AdicionarNavigationProp = NativeStackNavigationProp<MainStackParamList>;

export default function Adicionar() {
  const navigation = useNavigation<AdicionarNavigationProp>();
  const { showSuccess, showError } = useToast();

  const [posterUri, setPosterUri] = useState<string | null>(null);
  const [titulo, setTitulo] = useState("");
  const [genero, setGenero] = useState<string | null>(null);
  const [ano, setAno] = useState("");
  const [duracaoMin, setDuracaoMin] = useState("");
  const [diretor, setDiretor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [nota, setNota] = useState(0);
  const [status, setStatus] = useState<StatusFilme | null>(null);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusLabel =
    STATUS_OPTIONS.find((s) => s.value === status)?.label ?? null;

  const escolherDaGaleria = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      showError("Autorize o acesso à galeria para escolher uma capa.");
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      aspect: [2, 3],
      allowsEditing: true,
    });
    if (!resultado.canceled) {
      setPosterUri(resultado.assets[0].uri);
    }
  };

  const tirarFoto = async () => {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissao.granted) {
      showError("Autorize o acesso à câmera para tirar uma foto.");
      return;
    }
    const resultado = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      aspect: [2, 3],
      allowsEditing: true,
    });
    if (!resultado.canceled) {
      setPosterUri(resultado.assets[0].uri);
    }
  };

  const handleSalvar = async () => {
    if (!titulo || !genero || !ano || !status) {
      showError("Preencha ao menos Título, Gênero, Ano e Status.");
      return;
    }
    if (!posterUri) {
      showError("Selecione uma capa para o filme.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await buscarItem("token");
      if (!token) {
        showError("Sessão expirada. Faça login novamente.");
        return;
      }
      const response = await fetch(`${API_BASE_URL}/movies/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: titulo,
          coverUrl: posterUri,
          genres: [genero],
          releaseYear: Number(ano),
          durationMovie: duracaoMin ? Number(duracaoMin) : undefined,
          director: diretor || undefined,
          description: descricao || undefined,
          rating: nota,
          status,
          trailerUrl: trailerUrl || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showError(data.error ?? "Não foi possível salvar o filme.");
        return;
      }

      showSuccess("Filme adicionado com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar filme:", error);
      showError("Falha de conexão com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LoadingOverlay visible={isSubmitting} message="Salvando filme..." />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.title}>Novo Filme</Text>
        </View>

        <TouchableOpacity
          style={styles.coverBox}
          onPress={escolherDaGaleria}
          activeOpacity={0.85}>
          {posterUri ? (
            <Image source={{ uri: posterUri }} style={styles.coverImage} />
          ) : (
            <Ionicons name="film-outline" size={32} color={COLORS.muted} />
          )}
        </TouchableOpacity>
        <Text style={styles.coverHint}>Adicionar capa do filme</Text>
        <View
          style={[
            styles.coverActionsRow,
            { justifyContent: "center", marginTop: -8, marginBottom: 20 },
          ]}>
          <TouchableOpacity
            style={styles.coverActionButton}
            onPress={escolherDaGaleria}>
            <Ionicons name="images-outline" size={16} color={COLORS.gold} />
            <Text style={styles.coverActionText}>Galeria</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.coverActionButton}
            onPress={tirarFoto}>
            <Ionicons name="camera-outline" size={16} color={COLORS.gold} />
            <Text style={styles.coverActionText}>Câmera</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Título *</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o título do filme"
            placeholderTextColor={COLORS.placeholder}
            value={titulo}
            onChangeText={setTitulo}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Gênero *</Text>
          <SelectField
            label="Selecione o gênero"
            placeholder="Selecione o gênero"
            value={genero}
            options={GENEROS}
            onSelect={setGenero}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.fieldGroup, styles.rowItem]}>
            <Text style={styles.label}>Ano *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: 2024"
              placeholderTextColor={COLORS.placeholder}
              value={ano}
              onChangeText={setAno}
              keyboardType="number-pad"
              maxLength={4}
            />
          </View>
          <View style={[styles.fieldGroup, styles.rowItem]}>
            <Text style={styles.label}>Duração (min)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: 142"
              placeholderTextColor={COLORS.placeholder}
              value={duracaoMin}
              onChangeText={setDuracaoMin}
              keyboardType="number-pad"
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Diretor</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome do diretor"
            placeholderTextColor={COLORS.placeholder}
            value={diretor}
            onChangeText={setDiretor}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Fale sobre o filme..."
            placeholderTextColor={COLORS.placeholder}
            value={descricao}
            onChangeText={setDescricao}
            multiline
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.fieldGroup, styles.rowItem]}>
            <Text style={styles.label}>Nota (0 a 5)</Text>
            <StarRatingInput value={nota} onChange={setNota} />
          </View>
          <View style={[styles.fieldGroup, styles.rowItem]}>
            <Text style={styles.label}>Status *</Text>
            <SelectField
              label="Selecione o status"
              placeholder="Selecione o status"
              value={statusLabel}
              options={STATUS_OPTIONS.map((s) => s.label)}
              onSelect={(label) => {
                const found = STATUS_OPTIONS.find((s) => s.label === label);
                setStatus(found?.value ?? null);
              }}
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Trailer (YouTube)</Text>
          <TextInput
            style={styles.input}
            placeholder="Cole o link do trailer (opcional)"
            placeholderTextColor={COLORS.placeholder}
            value={trailerUrl}
            onChangeText={setTrailerUrl}
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, isSubmitting && { opacity: 0.6 }]}
          onPress={handleSalvar}
          disabled={isSubmitting}>
          <Text style={styles.primaryButtonText}>
            {isSubmitting ? "Salvando..." : "Salvar Filme"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
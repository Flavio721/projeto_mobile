import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import criarStyles from './styles'
import type { Filme } from "../../../types/Filme";
import { useStyles, useTema } from "../../../contexts/TemaContext";

interface FilmeCardProps {
  filme: Filme;
  onToggleFavorito: (id: string) => void;
  onPress?: (filme: Filme) => void;
  showRating?: boolean;
}



export default function FilmeCard({
  filme,
  onToggleFavorito,
  onPress,
  showRating = true,
}: FilmeCardProps) {

  const styles = useStyles(criarStyles)
  const { cores } = useTema()
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(filme)}
      activeOpacity={0.8}
    >
      <View style={styles.posterWrapper}>
        {filme.posterUri ? (
          <Image
            source={{ uri: filme.posterUri }}
            style={styles.poster}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.posterFallbackIcon}>
            <MaterialCommunityIcons
              name="movie-open-outline"
              size={36}
              color={cores.muted}
            />
          </View>
        )}

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => onToggleFavorito(filme.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={filme.favorito ? "heart" : "heart-outline"}
            size={16}
            color={filme.favorito ? cores.heartOn : cores.heartOff}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {filme.titulo}
      </Text>
      <Text style={styles.metaText}>
        {filme.ano} · {filme.genero}
      </Text>

      {showRating && (
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={12} color={cores.gold} />
          <Text style={styles.ratingText}>{filme.nota.toFixed(1)}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

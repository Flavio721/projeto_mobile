import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import styles, { COLORS } from "./styles";
import type { Filme } from "../../types/Filme";

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
              color={COLORS.muted}
            />
          </View>
        )}

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => onToggleFavorito(filme.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={filme.favorito ? "heart-outline" : "heart"}
            size={16}
            color={filme.favorito ? COLORS.heartOff : COLORS.heartOn}
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
          <Ionicons name="star" size={12} color={COLORS.gold} />
          <Text style={styles.ratingText}>{filme.nota.toFixed(1)}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

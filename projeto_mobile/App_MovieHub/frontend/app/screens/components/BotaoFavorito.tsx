import React from 'react';
import { TouchableOpacity, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '../../contexts/TemaContext';

interface BotaoFavoritoProps {
  title: string;
  isFavorite: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

/** Shared favorite action with screen-reader text and isolated card presses. */
export default function BotaoFavorito({ title, isFavorite, onPress, style }: BotaoFavoritoProps) {
  const { cores } = useTema();

  return (
    <TouchableOpacity
      style={style}
      accessibilityRole="button"
      accessibilityLabel={isFavorite ? `Remover ${title} dos favoritos` : `Adicionar ${title} aos favoritos`}
      accessibilityState={{ selected: isFavorite }}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      onPress={(event) => {
        event.stopPropagation();
        onPress();
      }}
    >
      <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={16} color={isFavorite ? cores.heartOn : cores.heartOff} />
    </TouchableOpacity>
  );
}

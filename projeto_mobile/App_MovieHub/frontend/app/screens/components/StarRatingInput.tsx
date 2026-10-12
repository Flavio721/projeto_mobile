import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTema } from '../../contexts/TemaContext';

interface StarRatingInputProps {
  value: number; // 0 a 5
  onChange: (value: number) => void;
  size?: number;
}

export default function StarRatingInput({
  value,
  onChange,
  size = 26,
}: StarRatingInputProps) {
  const { cores } = useTema();
  return (
    <View style={{ flexDirection: "row" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => onChange(star === value ? 0 : star)}
          hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
        >
          <Ionicons
            name={star <= value ? "star" : "star-outline"}
            size={size}
            color={star <= value ? cores.gold : cores.placeholder}
            style={{ marginRight: 4 }}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

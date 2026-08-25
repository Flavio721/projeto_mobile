import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles, { COLORS } from "./styles";

interface SelectFieldProps {
  label: string;
  placeholder: string;
  value: string | null;
  options: string[];
  onSelect: (value: string) => void;
}

export default function SelectField({
  label,
  placeholder,
  value,
  options,
  onSelect,
}: SelectFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity style={styles.trigger} onPress={() => setVisible(true)}>
        <Text style={[styles.triggerText, !value && styles.placeholderText]}>
          {value ?? placeholder}
        </Text>
        <Ionicons name="chevron-down" size={16} color={COLORS.placeholder} />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <Pressable style={styles.sheet}>
            <Text style={styles.sheetTitle}>{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    onSelect(item);
                    setVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item === value && styles.optionTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                  {item === value && (
                    <Ionicons name="checkmark" size={18} color={COLORS.gold} />
                  )}
                </TouchableOpacity>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

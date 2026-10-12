import Text from '../TextoLocalizado';
import React from 'react';
import { View, TouchableOpacity, Modal, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '../../../contexts/TemaContext';
import type { Paleta } from '../../../theme/paletas';

export interface ActionMenuOption {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  danger?: boolean;
}

interface ActionMenuProps {
  visible: boolean;
  onClose: () => void;
  options: ActionMenuOption[];
}

export default function ActionMenu({ visible, onClose, options }: ActionMenuProps) {
  const { cores } = useTema();
  const styles = criarStyles(cores);
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.menu}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={option.label}
              style={[styles.option, index < options.length - 1 && styles.optionBorder]}
              onPress={() => {
                onClose();
                option.onPress();
              }}
            >
              <Ionicons
                name={option.icon}
                size={18}
                color={option.danger ? cores.danger : cores.text}
              />
              <Text style={[styles.optionText, option.danger && { color: cores.danger }]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}

const criarStyles = (cores: Paleta) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: cores.overlay,
    alignItems: 'flex-end',
    paddingTop: 90,
    paddingRight: 20,
  },
  menu: {
    backgroundColor: cores.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: cores.border,
    minWidth: 170,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: cores.border,
  },
  optionText: {
    color: cores.text,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
  },
});

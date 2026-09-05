import React from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  overlay: 'rgba(0,0,0,0.4)',
  sheet: '#1E1B38',
  border: 'rgba(255,255,255,0.12)',
  white: '#FFFFFF',
  danger: '#E5484D',
};

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
                color={option.danger ? COLORS.danger : COLORS.white}
              />
              <Text style={[styles.optionText, option.danger && { color: COLORS.danger }]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    alignItems: 'flex-end',
    paddingTop: 90,
    paddingRight: 20,
  },
  menu: {
    backgroundColor: COLORS.sheet,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    borderBottomColor: COLORS.border,
  },
  optionText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
  },
});
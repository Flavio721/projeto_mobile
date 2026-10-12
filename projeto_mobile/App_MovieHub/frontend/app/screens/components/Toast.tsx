import Text from './TextoLocalizado';
import React from 'react';
import { Animated, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '../../contexts/TemaContext';
import type { Paleta } from '../../theme/paletas';

export type ToastType = 'success' | 'error';

interface ToastProps {
  type: ToastType;
  message: string;
  opacity: Animated.Value;
  translateY: Animated.Value;
  onDismiss: () => void;
}

export default function Toast({ type, message, opacity, translateY, onDismiss }: ToastProps) {
  const isSuccess = type === 'success';
  const { cores } = useTema();
  const styles = criarStyles(cores);

  return (
    <Animated.View
      style={[
        styles.container,
        isSuccess ? styles.success : styles.error,
        { opacity, transform: [{ translateY }] },
      ]}
    >
      <Ionicons
        name={isSuccess ? 'checkmark-circle' : 'alert-circle'}
        size={20}
        color={isSuccess ? cores.success : cores.danger}
      />
      <Text style={styles.message} numberOfLines={3}>
        {message}
      </Text>
      <TouchableOpacity onPress={onDismiss} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Ionicons name="close" size={16} color={cores.text} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const criarStyles = (cores: Paleta) => StyleSheet.create({
  container: {
    position: 'absolute',
    top: 56,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    zIndex: 999,
    elevation: 10,
  },
  success: {
    backgroundColor: cores.successSurface,
    borderColor: cores.success,
  },
  error: {
    backgroundColor: cores.dangerSurface,
    borderColor: cores.danger,
  },
  message: {
    flex: 1,
    color: cores.text,
    fontSize: 13,
    fontWeight: '600',
    marginHorizontal: 10,
  },
});

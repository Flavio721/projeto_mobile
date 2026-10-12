import Text from './TextoLocalizado';
import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import { useTema } from '../../contexts/TemaContext';
import type { Paleta } from '../../theme/paletas';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export default function LoadingOverlay({ visible, message }: LoadingOverlayProps) {
  const { cores } = useTema();
  const styles = criarStyles(cores);
  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <ActivityIndicator size="large" color={cores.gold} />
          {message && <Text style={styles.message}>{message}</Text>}
        </View>
      </View>
    </Modal>
  );
}

const criarStyles = (cores: Paleta) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: cores.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: cores.surface,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 32,
    alignItems: 'center',
    minWidth: 140,
  },
  message: {
    color: cores.text,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
});

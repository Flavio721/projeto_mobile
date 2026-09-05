import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Modal } from 'react-native';

const COLORS = {
<<<<<<< HEAD:projeto_mobile/App_MovieHub/frontend/app/screens/components/LoadingOverlay.tsx
  overlay: 'rgba(21, 19, 39, 0.75)',
  gold: '#F4B400',
  white: '#FFFFFF',
};

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export default function LoadingOverlay({ visible, message }: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <ActivityIndicator size="large" color={COLORS.gold} />
          {message && <Text style={styles.message}>{message}</Text>}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#1E1B38',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 32,
    alignItems: 'center',
    minWidth: 140,
  },
  message: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
=======
    overlay: 'rgba(21, 19, 39, 0.75)',
    gold: '#F4B400',
    white: '#FFFFFF',
};

interface LoadingOverlayProps {
    visible: boolean;
    message?: string;
}

export default function LoadingOverlay({ visible, message }: LoadingOverlayProps) {
    if (!visible) return null;

    return (
        <Modal transparent animationType="fade" visible={visible}>
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <ActivityIndicator size="large" color={COLORS.gold} />
                    {message && <Text style={styles.message}>{message}</Text>}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: COLORS.overlay,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        backgroundColor: '#1E1B38',
        borderRadius: 16,
        paddingVertical: 24,
        paddingHorizontal: 32,
        alignItems: 'center',
        minWidth: 140,
    },
    message: {
        color: COLORS.white,
        fontSize: 13,
        fontWeight: '600',
        marginTop: 12,
        textAlign: 'center',
    },
>>>>>>> f6ceb3456ca8f4318e87720b444c106db1f085ab:projeto_mobile/App_MovieHub/frontend/app/screens/Adicionar/components/LoadingOverlay.tsx
});
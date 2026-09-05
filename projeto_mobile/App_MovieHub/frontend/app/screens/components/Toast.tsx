import React from 'react';
import { Animated, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type ToastType = 'success' | 'error';

const COLORS = {
<<<<<<< HEAD:projeto_mobile/App_MovieHub/frontend/app/screens/components/Toast.tsx
  successBg: '#1E3A2E',
  successBorder: '#3DDC97',
  errorBg: '#3A1E22',
  errorBorder: '#E5484D',
  white: '#FFFFFF',
};

interface ToastProps {
  type: ToastType;
  message: string;
  opacity: Animated.Value;
  translateY: Animated.Value;
  onDismiss: () => void;
}

export default function Toast({ type, message, opacity, translateY, onDismiss }: ToastProps) {
  const isSuccess = type === 'success';

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
        color={isSuccess ? COLORS.successBorder : COLORS.errorBorder}
      />
      <Text style={styles.message} numberOfLines={3}>
        {message}
      </Text>
      <TouchableOpacity onPress={onDismiss} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Ionicons name="close" size={16} color={COLORS.white} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: COLORS.successBg,
    borderColor: COLORS.successBorder,
  },
  error: {
    backgroundColor: COLORS.errorBg,
    borderColor: COLORS.errorBorder,
  },
  message: {
    flex: 1,
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
    marginHorizontal: 10,
  },
=======
    successBg: '#1E3A2E',
    successBorder: '#3DDC97',
    errorBg: '#3A1E22',
    errorBorder: '#E5484D',
    white: '#FFFFFF',
};

interface ToastProps {
    type: ToastType;
    message: string;
    opacity: Animated.Value;
    translateY: Animated.Value;
    onDismiss: () => void;
}

export default function Toast({ type, message, opacity, translateY, onDismiss }: ToastProps) {
    const isSuccess = type === 'success';

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
                color={isSuccess ? COLORS.successBorder : COLORS.errorBorder}
            />
            <Text style={styles.message} numberOfLines={3}>
                {message}
            </Text>
            <TouchableOpacity onPress={onDismiss} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close" size={16} color={COLORS.white} />
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
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
        backgroundColor: COLORS.successBg,
        borderColor: COLORS.successBorder,
    },
    error: {
        backgroundColor: COLORS.errorBg,
        borderColor: COLORS.errorBorder,
    },
    message: {
        flex: 1,
        color: COLORS.white,
        fontSize: 13,
        fontWeight: '600',
        marginHorizontal: 10,
    },
>>>>>>> f6ceb3456ca8f4318e87720b444c106db1f085ab:projeto_mobile/App_MovieHub/frontend/app/screens/Adicionar/components/Toast.tsx
});
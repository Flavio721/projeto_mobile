import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Animated } from 'react-native';
import Toast, { ToastType } from '../screens/components/Toast';

interface ToastState {
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const DURACAO_SUCESSO = 2500;
const DURACAO_ERRO = 4000;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const esconder = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: -20, duration: 200, useNativeDriver: true }),
    ]).start(() => setToast(null));
  }, [opacity, translateY]);

  const mostrar = useCallback(
    (type: ToastType, message: string) => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current);

      setToast({ type, message });
      opacity.setValue(0);
      translateY.setValue(-20);

      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();

      const duracao = type === 'success' ? DURACAO_SUCESSO : DURACAO_ERRO;
      dismissTimer.current = setTimeout(esconder, duracao);
    },
    [opacity, translateY, esconder],
  );

  const showSuccess = useCallback((message: string) => mostrar('success', message), [mostrar]);
  const showError = useCallback((message: string) => mostrar('error', message), [mostrar]);

  return (
    <ToastContext.Provider value={{ showSuccess, showError }}>
      {children}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          opacity={opacity}
          translateY={translateY}
          onDismiss={esconder}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast precisa ser usado dentro de um <ToastProvider>');
  }
  return context;
}
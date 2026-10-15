import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Text from '../components/TextoLocalizado';
import { useTema } from '../../contexts/TemaContext';

WebBrowser.maybeCompleteAuthSession();

const CLIENT_IDS = {
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
};

function clientIdDaPlataforma(): string | undefined {
  if (Platform.OS === 'web') return CLIENT_IDS.webClientId;
  if (Platform.OS === 'android') return CLIENT_IDS.androidClientId;
  if (Platform.OS === 'ios') return CLIENT_IDS.iosClientId;
  return undefined;
}

interface Props {
  onToken: (token: string) => void;
  onError: (message: string) => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function GoogleLoginButton(props: Props) {
  // Don't invoke the provider hook until a client ID exists for this platform.
  if (!clientIdDaPlataforma()) return null;
  return <ConfiguredGoogleLoginButton {...props} />;
}

function ConfiguredGoogleLoginButton({ onToken, onError, disabled, loading }: Props) {
  const { cores } = useTema();
  const lastResponse = useRef<string | null>(null);
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(CLIENT_IDS, { scheme: 'moviehub' });

  useEffect(() => {
    if (!response || response.type === 'dismiss' || response.type === 'cancel') return;
    const idToken = response.type === 'success' ? response.params.id_token : undefined;
    const responseKey = `${response.type}:${idToken ?? response.type}`;
    if (lastResponse.current === responseKey) return;
    lastResponse.current = responseKey;

    if (idToken) onToken(idToken);
    else onError('Não foi possível concluir o login com Google.');
  }, [response, onToken, onError]);

  const iniciarLogin = async () => {
    try {
      await promptAsync();
    } catch {
      onError('Não foi possível abrir o login do Google.');
    }
  };

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel="Continuar com Google"
      disabled={!request || disabled || loading}
      onPress={() => void iniciarLogin()}
      style={[styles.button, { borderColor: cores.border, backgroundColor: cores.card }, (!request || disabled || loading) && styles.disabled]}
    >
      {loading ? <ActivityIndicator color={cores.text} /> : (
        <View style={styles.content}>
          <MaterialCommunityIcons name="google" size={19} color={cores.text} />
          <Text style={[styles.label, { color: cores.text }]}>Continuar com Google</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  label: { fontSize: 14, fontWeight: '600' },
  disabled: { opacity: 0.55 },
});

import { StyleSheet } from 'react-native';
import type { Paleta } from '../../theme/paletas';

export const criarStyles = (cores: Paleta) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: cores.background,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: 32,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 12,
      marginBottom: 24,
    },
    backButton: {
      marginRight: 12,
    },
    title: {
      color: cores.text,
      fontSize: 18,
      fontWeight: '700',
    },
    avisoBox: {
      flexDirection: 'row',
      backgroundColor: cores.card,
      borderWidth: 1,
      borderColor: cores.border,
      borderRadius: 14,
      padding: 14,
      marginBottom: 24,
    },
    avisoTexto: {
      flex: 1,
      color: cores.muted,
      fontSize: 12,
      lineHeight: 17,
      marginLeft: 10,
    },
    fieldGroup: {
      marginBottom: 18,
    },
    label: {
      color: cores.text,
      fontSize: 13,
      fontWeight: '600',
      marginBottom: 8,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: cores.card,
      borderWidth: 1,
      borderColor: cores.border,
      borderRadius: 12,
      paddingHorizontal: 14,
      height: 50,
    },
    inputIcon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      color: cores.text,
      fontSize: 14,
    },
    forcaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    forcaBarra: {
      flex: 1,
      height: 4,
      borderRadius: 2,
      backgroundColor: cores.border,
      marginRight: 8,
      overflow: 'hidden',
    },
    forcaPreenchimento: {
      height: '100%',
      borderRadius: 2,
    },
    forcaTexto: {
      fontSize: 11,
      fontWeight: '600',
      width: 54,
    },
    primaryButton: {
      backgroundColor: cores.gold,
      borderRadius: 12,
      height: 52,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 12,
      marginBottom: 10,
    },
    primaryButtonText: {
      color: cores.onGold,
      fontSize: 15,
      fontWeight: '700',
    },
    secondaryButton: {
      borderRadius: 12,
      height: 52,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: cores.border,
    },
    secondaryButtonText: {
      color: cores.muted,
      fontSize: 15,
      fontWeight: '600',
    },
  });
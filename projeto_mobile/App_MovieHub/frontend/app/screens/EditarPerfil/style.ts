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
    avatarSection: {
      alignItems: 'center',
      marginBottom: 28,
    },
    avatarCircle: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: cores.posterFallback,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: cores.gold,
      overflow: 'hidden',
    },
    avatarImage: {
      width: '100%',
      height: '100%',
    },
    avatarBadge: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: cores.gold,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: cores.background,
    },
    avatarHint: {
      color: cores.gold,
      fontSize: 12,
      fontWeight: '600',
      marginTop: 10,
    },
    removerFotoText: {
      color: cores.danger,
      fontSize: 12,
      fontWeight: '600',
      marginTop: 6,
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
    inputWrapperDisabled: {
      opacity: 0.6,
    },
    inputIcon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      color: cores.text,
      fontSize: 14,
    },
    hint: {
      color: cores.muted,
      fontSize: 11,
      marginTop: 6,
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
import { StyleSheet } from "react-native";
import { Paleta } from "../../theme/paletas";

const criarStyles = (cores: Paleta) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: cores.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 32,
    },
    topBar: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    backButton: {
      marginRight: 12,
    },
    topBarTitles: {
      flex: 1,
    },
    title: {
      color: cores.white,
      fontSize: 20,
      fontWeight: "700",
    },
    subtitle: {
      color: cores.muted,
      fontSize: 13,
      marginTop: 2,
    },
    avatarSection: {
      alignItems: "center",
      marginBottom: 24,
    },
    avatarCircle: {
      width: 90,
      height: 90,
      borderRadius: 45,
      backgroundColor: cores.background,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarBadge: {
      position: "absolute",
      right: 0,
      bottom: 4,
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: cores.gold,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: cores.background,
    },
    avatarHint: {
      color: cores.gold,
      fontSize: 12,
      fontWeight: "600",
      marginTop: 10,
    },
    fieldGroup: {
      marginBottom: 18,
    },
    label: {
      color: cores.white,
      fontSize: 13,
      fontWeight: "600",
      marginBottom: 8,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
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
      color: cores.white,
      fontSize: 14,
    },
    primaryButton: {
      backgroundColor: cores.gold,
      borderRadius: 12,
      height: 52,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 8,
      marginBottom: 20,
    },
    primaryButtonText: {
      color: "#241C00",
      fontSize: 15,
      fontWeight: "700",
    },
    footerRow: {
      flexDirection: "row",
      justifyContent: "center",
    },
    footerText: {
      color: cores.muted,
      fontSize: 13,
    },
    footerLink: {
      color: cores.gold,
      fontSize: 13,
      fontWeight: "700",
    },
  });

export default criarStyles;

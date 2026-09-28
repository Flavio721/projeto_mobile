import { StyleSheet } from "react-native";
import { Paleta } from "../../theme/paletas";

const criarStyles = (cores: Paleta) =>
  StyleSheet.create({
    container: {
      width: 120,
      margin: 10,
    },
    posterWrapper: {
      width: 120,
      height: 168,
      borderRadius: 12,
      backgroundColor: cores.posterFallback,
      overflow: "hidden",
    },
    poster: {
      width: "100%",
      height: "100%",
    },
    posterFallbackIcon: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    favoriteButton: {
      position: "absolute",
      top: 6,
      right: 6,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: "rgba(0,0,0,0.55)",
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      color: cores.white,
      fontSize: 13,
      fontWeight: "600",
      marginTop: 8,
    },
    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 2,
    },
    metaText: {
      color: cores.muted,
      fontSize: 11,
    },
    ratingRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 3,
    },
    ratingText: {
      color: cores.muted,
      fontSize: 11,
      marginLeft: 3,
    },
  });

export default criarStyles;

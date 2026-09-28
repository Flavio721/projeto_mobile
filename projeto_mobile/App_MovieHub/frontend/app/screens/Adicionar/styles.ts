import { StyleSheet } from "react-native";
import type { Paleta } from '../../theme/paletas';


const criarStyles = (cores: Paleta) =>
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
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    marginBottom: 20,
  },
  backButton: {
    marginRight: 14,
  },
  title: {
    color: cores.white,
    fontSize: 18,
    fontWeight: "700",
  },
  coverBox: {
    height: 140,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: cores.border,
    backgroundColor: cores.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  coverHint: {
    color: cores.muted,
    fontSize: 12,
    marginTop: 8,
    marginBottom: 12,
  },
  coverActionsRow: {
    flexDirection: "row",
  },
  coverActionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(244,180,0,0.12)",
    marginHorizontal: 6,
  },
  coverActionText: {
    color: cores.gold,
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    color: cores.white,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    color: cores.white,
    fontSize: 14,
  },
  textArea: {
    minHeight: 90,
    paddingTop: 14,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    marginHorizontal: -6,
  },
  rowItem: {
    flex: 1,
    marginHorizontal: 6,
  },
  primaryButton: {
    backgroundColor: cores.gold,
    borderRadius: 12,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: "#241C00",
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryButton: {
    borderRadius: 12,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: cores.border,
  },
  secondaryButtonText: {
    color: cores.muted,
    fontSize: 15,
    fontWeight: "600",
  },
});

export default criarStyles
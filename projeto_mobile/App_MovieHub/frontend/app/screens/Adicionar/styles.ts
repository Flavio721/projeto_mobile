import { StyleSheet } from "react-native";

const COLORS = {
  background: "#151327",
  card: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.12)",
  gold: "#F4B400",
  white: "#FFFFFF",
  muted: "#9C97B8",
  placeholder: "#6E6A8C",
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "700",
  },
  coverBox: {
    height: 140,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
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
    color: COLORS.muted,
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
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    color: COLORS.white,
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
    backgroundColor: COLORS.gold,
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
    borderColor: COLORS.border,
  },
  secondaryButtonText: {
    color: COLORS.muted,
    fontSize: 15,
    fontWeight: "600",
  },
});

export { COLORS };
export default styles;

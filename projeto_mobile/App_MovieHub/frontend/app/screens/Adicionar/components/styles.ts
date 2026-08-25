import { StyleSheet } from "react-native";

const COLORS = {
  card: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.12)",
  white: "#FFFFFF",
  muted: "#9C97B8",
  placeholder: "#6E6A8C",
  gold: "#F4B400",
  overlay: "rgba(0,0,0,0.55)",
  sheet: "#1E1B38",
};

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
  },
  triggerText: {
    fontSize: 14,
    color: COLORS.white,
  },
  placeholderText: {
    color: COLORS.placeholder,
  },
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: COLORS.sheet,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingBottom: 24,
    maxHeight: "60%",
  },
  sheetTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  optionText: {
    color: COLORS.white,
    fontSize: 14,
  },
  optionTextActive: {
    color: COLORS.gold,
    fontWeight: "700",
  },
});

export { COLORS };
export default styles;

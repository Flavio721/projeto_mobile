import { StyleSheet } from "react-native";

import type { Paleta } from '../../theme/paletas';

const criarStyles = (cores: Paleta) => StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
  },
  triggerText: {
    fontSize: 14,
    color: cores.text,
  },
  placeholderText: {
    color: cores.placeholder,
  },
  overlay: {
    flex: 1,
    backgroundColor: cores.overlay,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: cores.surface,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingBottom: 24,
    maxHeight: "60%",
  },
  sheetTitle: {
    color: cores.text,
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
    color: cores.text,
    fontSize: 14,
  },
  optionTextActive: {
    color: cores.gold,
    fontWeight: "700",
  },
});


export default criarStyles;

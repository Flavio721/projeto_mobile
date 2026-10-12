import { StyleSheet } from "react-native";

import type { Paleta } from '../../theme/paletas';

const criarStyles = (cores: Paleta) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: cores.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    marginBottom: 16,
  },
  headerTitle: {
    color: cores.text,
    fontSize: 20,
    fontWeight: "700",
  },
  iconButton: {
    padding: 4,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: cores.text,
    fontSize: 14,
  },
  sortButton: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  tabsRow: {
    marginBottom: 16,
    flexGrow: 0,
  },

  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
  },
  tabButtonActive: {
    backgroundColor: cores.gold,
    borderColor: cores.gold,
  },
  tabButtonText: {
    color: cores.muted,
    fontSize: 12,
    fontWeight: "600",
  },
  tabButtonTextActive: {
    color: cores.onGold,
  },
  listContent: {
    paddingBottom: 24,
  },
  cardSpacing: {
    marginBottom: 10,
  },
  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  emptyText: {
    color: cores.muted,
    fontSize: 13,
    marginTop: 10,
    textAlign: "center",
  },
});


export default criarStyles;

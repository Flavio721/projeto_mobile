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
    color: COLORS.white,
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
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.white,
    fontSize: 14,
  },
  sortButton: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabButtonActive: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },
  tabButtonText: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "600",
  },
  tabButtonTextActive: {
    color: "#241C00",
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
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 10,
    textAlign: "center",
  },
});

export { COLORS };
export default styles;

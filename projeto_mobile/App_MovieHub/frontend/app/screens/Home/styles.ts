import { StyleSheet } from "react-native";

const COLORS = {
  background: "#151327",
  placeholder: "#6E6A8C",
  card: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.12)",
  white: "#FFFFFF",
  muted: "#9C97B8",
  gold: "#F4B400",
  heartInactive: "#6E6A8C",
  heartActive: "#E5484D",
  posterFallback: "#3B3566",
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
    justifyContent: "space-between",
    paddingTop: 8,
    paddingBottom: 16,
  },
  topBarTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "700",
  },
  iconButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  greeting: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 13,
    marginBottom: 18,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },
  searchWrapper: {
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
  searchPlaceholderText: {
    flex: 1,
    color: COLORS.placeholder,
    fontSize: 14,
  },
  addButton: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: COLORS.gold,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 26,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 12,
    marginRight: 8,
  },
  summaryBoxLast: {
    marginRight: 0,
  },
  summaryNumber: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 6,
  },
  summaryLabel: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 2,
    textAlign: "center",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  seeAllText: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: "600",
  },
  section: {
    marginBottom: 26,
  },
  horizontalList: {
    paddingRight: 6,
  },
  cardItem: {
    width: "auto",
    marginRight: 20,
  },
  emptyStateBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  emptyStateText: {
    color: COLORS.muted,
    fontSize: 14,
    marginTop: 12,
    textAlign: "center",
  },
  emptySectionText: {
    color: COLORS.muted,
    fontSize: 12,
  },
  emptyGeneralBox: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingVertical: 60,
    marginTop: 8,
  },
  emptyGeneralEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyGeneralText: {
    color: COLORS.muted,
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 10,
  },
  poster: {
    width: 56,
    height: 78,
    borderRadius: 8,
    backgroundColor: COLORS.posterFallback,
  },
  posterFallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  titulo: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
  },
  meta: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  ratingText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  heartButton: {
    padding: 6,
  },
});

export { COLORS };
export default styles;
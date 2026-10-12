import { StyleSheet } from "react-native";
import type { Paleta } from "../../theme/paletas";

const criarStyles = (cores: Paleta) => StyleSheet.create({
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
    justifyContent: "space-between",
    paddingTop: 8,
    paddingBottom: 16,
  },
  topBarTitle: {
    color: cores.text,
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
    color: cores.text,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    color: cores.muted,
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
  searchPlaceholderText: {
    flex: 1,
    color: cores.placeholder,
    fontSize: 14,
  },
  addButton: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: cores.gold,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  sectionTitle: {
    color: cores.text,
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
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 12,
    marginRight: 8,
  },
  summaryBoxLast: {
    marginRight: 0,
  },
  summaryNumber: {
    color: cores.text,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 6,
  },
  summaryLabel: {
    color: cores.muted,
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
  popularSubtitle: {
    color: cores.muted,
    fontSize: 11,
    marginTop: -8,
    marginBottom: 12,
  },
  popularCard: {
    width: 112,
    marginRight: 12,
  },
  popularPoster: {
    width: 112,
    height: 158,
    borderRadius: 10,
    backgroundColor: cores.posterFallback,
  },
  popularTitle: {
    color: cores.text,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 7,
  },
  popularRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  popularRatingText: {
    color: cores.muted,
    fontSize: 10,
    marginLeft: 4,
  },
  seeAllText: {
    color: cores.gold,
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
    color: cores.muted,
    fontSize: 14,
    marginTop: 12,
    textAlign: "center",
  },
  emptySectionText: {
    color: cores.muted,
    fontSize: 12,
  },
  emptyGeneralBox: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 16,
    paddingVertical: 60,
    marginTop: 8,
  },
  emptyGeneralEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyGeneralText: {
    color: cores.muted,
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 14,
    padding: 10,
  },
  poster: {
    width: 56,
    height: 78,
    borderRadius: 8,
    backgroundColor: cores.posterFallback,
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
    color: cores.text,
    fontSize: 15,
    fontWeight: "700",
  },
  meta: {
    color: cores.muted,
    fontSize: 12,
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  ratingText: {
    color: cores.text,
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  heartButton: {
    padding: 6,
  },
});

export default criarStyles;

import { StyleSheet } from 'react-native';

const COLORS = {
  background: '#151327',
  card: 'rgba(255,255,255,0.06)',
  border: 'rgba(255,255,255,0.12)',
  gold: '#F4B400',
  white: '#FFFFFF',
  muted: '#9C97B8',
  placeholder: '#6E6A8C',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 16,
  },
  topBarTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },
  iconButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 13,
    marginBottom: 18,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
  addButton: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 26,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 12,
    marginRight: 8,
  },
  summaryBoxLast: {
    marginRight: 0,
  },
  summaryNumber: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 6,
  },
  summaryLabel: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  seeAllText: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 26,
  },
  horizontalList: {
    paddingRight: 6,
  },
  emptyStateBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyStateText: {
    color: COLORS.muted,
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },
  emptySectionText: {
    color: COLORS.muted,
    fontSize: 12,
  },
});

export { COLORS };
export default styles;
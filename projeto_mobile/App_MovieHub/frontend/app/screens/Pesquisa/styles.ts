import { StyleSheet } from 'react-native';

const COLORS = {
  background: '#151327',
  card: 'rgba(255,255,255,0.06)',
  border: 'rgba(255,255,255,0.12)',
  gold: '#F4B400',
  white: '#FFFFFF',
  muted: '#9C97B8',
  placeholder: '#6E6A8C',
  hintBg: 'rgba(244,180,0,0.08)',
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    marginBottom: 16,
  },
  backButton: {
    marginRight: 12,
  },
  title: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  filterButton: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  filterButtonActive: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },
  filterDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.gold,
    borderWidth: 1,
    borderColor: COLORS.background,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  limparTudoText: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '600',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  tagText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
    marginRight: 6,
  },
  resultadosTitle: {
    color: COLORS.muted,
    fontSize: 13,
    marginBottom: 12,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
  },
  poster: {
    width: 50,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#3B3566',
  },
  posterFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultInfo: {
    flex: 1,
    marginLeft: 12,
  },
  resultTitulo: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  resultMeta: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 4,
  },
  resultRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  resultRatingText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  hintBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.hintBg,
    borderRadius: 14,
    padding: 14,
    marginTop: 8,
  },
  hintTextWrapper: {
    flex: 1,
    marginLeft: 10,
  },
  hintTitle: {
    color: COLORS.gold,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  hintText: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 17,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 10,
    textAlign: 'center',
  },
});

export { COLORS };
export default styles;
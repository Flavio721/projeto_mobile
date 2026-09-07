import { StyleSheet } from 'react-native';

const COLORS = {
  background: '#151327',
  card: 'rgba(255,255,255,0.06)',
  border: 'rgba(255,255,255,0.12)',
  gold: '#F4B400',
  white: '#FFFFFF',
  muted: '#9C97B8',
  posterFallback: '#3B3566',
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
    marginBottom: 20,
  },
  backButton: {
    marginRight: 12,
  },
  title: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },
  filmeCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 24,
  },
  poster: {
    width: 80,
    height: 112,
    borderRadius: 10,
    backgroundColor: COLORS.posterFallback,
  },
  posterFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  filmeInfo: {
    flex: 1,
    marginLeft: 14,
  },
  filmeTitulo: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  filmeMeta: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  ratingText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 4,
  },
  statusBadge: {
    backgroundColor: COLORS.gold,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  statusBadgeText: {
    color: '#241C00',
    fontSize: 10,
    fontWeight: '700',
  },
  filmeDescricao: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 8,
    lineHeight: 17,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 24,
  },
  gridItem: {
    width: '33.33%',
    paddingHorizontal: 6,
    marginBottom: 16,
    alignItems: 'center',
  },
  gridIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  gridLabel: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  cancelButton: {
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
  },
  cancelButtonText: {
    color: COLORS.muted,
    fontSize: 15,
    fontWeight: '600',
  },
});

export { COLORS };
export default styles;
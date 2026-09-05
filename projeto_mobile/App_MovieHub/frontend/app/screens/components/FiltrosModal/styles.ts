import { StyleSheet } from 'react-native';

const COLORS = {
  background: '#151327',
  card: 'rgba(255,255,255,0.06)',
  border: 'rgba(255,255,255,0.12)',
  gold: '#F4B400',
  white: '#FFFFFF',
  muted: '#9C97B8',
  placeholder: '#6E6A8C',
  overlay: 'rgba(0,0,0,0.55)',
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '700',
  },
  limparText: {
    color: COLORS.gold,
    fontSize: 13,
    fontWeight: '600',
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusPill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusPillActive: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },
  statusPillText: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  statusPillTextActive: {
    color: '#241C00',
  },
  rangeRow: {
    flexDirection: 'row',
    marginHorizontal: -6,
  },
  rangeItem: {
    flex: 1,
    marginHorizontal: 6,
  },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    color: COLORS.white,
    fontSize: 14,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingHint: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  toggleLabel: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.gold,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: '#241C00',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
  secondaryButton: {
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryButtonText: {
    color: COLORS.muted,
    fontSize: 15,
    fontWeight: '600',
  },
});

export { COLORS };
export default styles;
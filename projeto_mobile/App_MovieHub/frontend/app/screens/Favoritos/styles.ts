import { StyleSheet } from 'react-native';

const COLORS = {
  background: '#151327',
  card: 'rgba(255,255,255,0.06)',
  border: 'rgba(255,255,255,0.12)',
  gold: '#F4B400',
  white: '#FFFFFF',
  muted: '#9C97B8',
  placeholder: '#6E6A8C',
  danger: '#E5484D',
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
    justifyContent: 'space-between',
    paddingTop: 12,
    marginBottom: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 8,
  },
  iconButton: {
    padding: 4,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 13,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  cardSpacing: {
    marginBottom: 10,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export { COLORS };
export default styles;
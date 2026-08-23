import { StyleSheet } from 'react-native';

const COLORS = {
  card: '#1E1B33',
  white: '#FFFFFF',
  muted: '#9C97B8',
  gold: '#F4B400',
  heartOff: '#6E6A8C',
  heartOn: '#E24C4C',
  posterFallback: '#3B3566',
};

const styles = StyleSheet.create({
  container: {
    width: 120,
    marginRight: 14,
  },
  posterWrapper: {
    width: 120,
    height: 168,
    borderRadius: 12,
    backgroundColor: COLORS.posterFallback,
    overflow: 'hidden',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  posterFallbackIcon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  metaText: {
    color: COLORS.muted,
    fontSize: 11,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  ratingText: {
    color: COLORS.muted,
    fontSize: 11,
    marginLeft: 3,
  },
});

export { COLORS };
export default styles;
import { StyleSheet } from 'react-native';

const COLORS = {
  background: '#151327',
  backgroundGlow: '#241f42',
  gold: '#F4B400',
  white: '#FFFFFF',
  muted: '#9C97B8',
  track: 'rgba(255,255,255,0.15)',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowCircle: {
    position: 'absolute',
    top: '18%',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: COLORS.backgroundGlow,
    opacity: 0.55,
  },
  iconStack: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  clapperIcon: {
    transform: [{ rotate: '-8deg' }],
  },
  popcornIcon: {
    position: 'absolute',
    right: -34,
    bottom: -18,
    transform: [{ rotate: '10deg' }],
  },
  appName: {
    color: COLORS.white,
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tagline: {
    color: COLORS.muted,
    fontSize: 14,
    marginTop: 6,
    marginBottom: 60,
  },
  loadingSection: {
    position: 'absolute',
    bottom: 70,
    width: '100%',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.white,
    fontSize: 14,
    marginTop: 14,
    fontWeight: '600',
  },
  loadingSubtext: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 22,
  },
  progressTrack: {
    width: 120,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.track,
    overflow: 'hidden',
  },
  progressFill: {
    width: '55%',
    height: '100%',
    borderRadius: 2,
    backgroundColor: COLORS.white,
  },
});

export { COLORS };
export default styles;
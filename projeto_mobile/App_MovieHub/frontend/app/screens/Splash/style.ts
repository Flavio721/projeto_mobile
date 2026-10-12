import { StyleSheet } from 'react-native';

import type { Paleta } from '../../theme/paletas';

const criarStyles = (cores: Paleta) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowCircle: {
    position: 'absolute',
    top: '18%',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: cores.surface,
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
    color: cores.text,
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tagline: {
    color: cores.muted,
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
    color: cores.text,
    fontSize: 14,
    marginTop: 14,
    fontWeight: '600',
  },
  loadingSubtext: {
    color: cores.muted,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 22,
  },
  progressTrack: {
    width: 120,
    height: 4,
    borderRadius: 2,
    backgroundColor: cores.border,
    overflow: 'hidden',
  },
  progressFill: {
    width: '55%',
    height: '100%',
    borderRadius: 2,
    backgroundColor: cores.text,
  },

  
});


export default criarStyles;
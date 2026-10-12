import { StyleSheet } from 'react-native';

import type { Paleta } from '../../theme/paletas';

const criarStyles = (cores: Paleta) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: cores.background,
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
    color: cores.text,
    fontSize: 18,
    fontWeight: '700',
  },
  tabsRow: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: cores.border,
  },
  tabButton: {
    paddingVertical: 10,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: cores.gold,
  },
  tabButtonText: {
    color: cores.muted,
    fontSize: 14,
    fontWeight: '600',
  },
  tabButtonTextActive: {
    color: cores.gold,
  },
  sectionTitle: {
    color: cores.text,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 12,
  },
  grid: {
    paddingBottom: 12,
  },
  gridItem: {
    flex: 1 / 3,
    aspectRatio: 0.7,
    margin: 4,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: cores.card,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  gridItemSelected: {
    borderColor: cores.gold,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  selectedBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: cores.gold,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  cameraIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  cameraText: {
    color: cores.muted,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 30,
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.gold,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  cameraButtonText: {
    color: cores.onGold,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
  emptyBox: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    color: cores.muted,
    fontSize: 13,
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  footer: {
    paddingVertical: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: cores.gold,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: cores.onGold,
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
    borderColor: cores.border,
  },
  secondaryButtonText: {
    color: cores.muted,
    fontSize: 15,
    fontWeight: '600',
  },
});


export default criarStyles;
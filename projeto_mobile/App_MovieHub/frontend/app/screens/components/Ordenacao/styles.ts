import { StyleSheet } from 'react-native';

import type { Paleta } from '../../../theme/paletas';

const criarStyles = (cores: Paleta) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: cores.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: cores.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: cores.border,
  },
  title: {
    color: cores.text,
    fontSize: 17,
    fontWeight: '700',
  },
  subtitle: {
    color: cores.muted,
    fontSize: 12,
    marginTop: 4,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: cores.border,
  },
  optionIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: cores.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionTextWrapper: {
    flex: 1,
  },
  optionLabel: {
    color: cores.text,
    fontSize: 14,
    fontWeight: '600',
  },
  optionHint: {
    color: cores.muted,
    fontSize: 11,
    marginTop: 2,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  primaryButton: {
    backgroundColor: cores.gold,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: cores.onGold,
    fontSize: 15,
    fontWeight: '700',
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
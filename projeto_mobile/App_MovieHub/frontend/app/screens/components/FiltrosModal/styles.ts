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
    borderBottomColor: cores.border,
  },
  title: {
    color: cores.text,
    fontSize: 17,
    fontWeight: '700',
  },
  limparText: {
    color: cores.gold,
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
    color: cores.text,
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
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
  },
  statusPillActive: {
    backgroundColor: cores.gold,
    borderColor: cores.gold,
  },
  statusPillText: {
    color: cores.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  statusPillTextActive: {
    color: cores.onGold,
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
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    color: cores.text,
    fontSize: 14,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingHint: {
    color: cores.gold,
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
    color: cores.text,
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
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
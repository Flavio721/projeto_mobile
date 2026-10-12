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
    marginBottom: 20,
  },
  backButton: {
    marginRight: 12,
  },
  title: {
    color: cores.text,
    fontSize: 18,
    fontWeight: '700',
  },
  filmeCard: {
    flexDirection: 'row',
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 24,
  },
  poster: {
    width: 80,
    height: 112,
    borderRadius: 10,
    backgroundColor: cores.posterFallback,
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
    color: cores.text,
    fontSize: 16,
    fontWeight: '700',
  },
  filmeMeta: {
    color: cores.muted,
    fontSize: 12,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  ratingText: {
    color: cores.text,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 4,
  },
  statusBadge: {
    backgroundColor: cores.gold,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  statusBadgeText: {
    color: cores.onGold,
    fontSize: 10,
    fontWeight: '700',
  },
  filmeDescricao: {
    color: cores.muted,
    fontSize: 12,
    marginTop: 8,
    lineHeight: 17,
  },
  sectionTitle: {
    color: cores.text,
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
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  gridLabel: {
    color: cores.text,
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
    borderColor: cores.border,
    marginBottom: 24,
  },
  cancelButtonText: {
    color: cores.muted,
    fontSize: 15,
    fontWeight: '600',
  },
});


export default criarStyles;
import { StyleSheet } from 'react-native';

import type { Paleta } from '../../theme/paletas';

const criarStyles = (cores: Paleta) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: cores.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    marginBottom: 12,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
  },
  title: {
    color: cores.text,
    fontSize: 18,
    fontWeight: '700',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
  },
  locationText: {
    color: cores.text,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
    flex: 1,
  },
  radiusText: {
    color: cores.muted,
    fontSize: 11,
    marginLeft: 8,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultCount: {
    color: cores.muted,
    fontSize: 12,
    marginLeft: 8,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: cores.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 0,
  },
  cinemaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  cinemaLogoBox: {
    width: 46,
    height: 46,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cinemaInfo: {
    flex: 1,
  },
  cinemaNomeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  cinemaNome: {
    color: cores.text,
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  cinemaDistancia: {
    color: cores.gold,
    fontSize: 12,
    fontWeight: '700',
  },
  cinemaEndereco: {
    color: cores.muted,
    fontSize: 12,
    marginTop: 3,
    lineHeight: 17,
  },
  routeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 9,
    paddingVertical: 5,
  },
  routeLabel: {
    color: cores.gold,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 5,
  },
  emptyBox: {
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    color: cores.muted,
    fontSize: 13,
    marginTop: 10,
    textAlign: 'center',
  },
  emptyTitle: {
    color: cores.text,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 14,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  listContent: {
    paddingBottom: 18,
  },
  retryButton: {
    backgroundColor: cores.gold,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 16,
  },
  retryLabel: {
    color: cores.onGold,
    fontSize: 13,
    fontWeight: '700',
  },
  sourceNotice: {
    color: cores.muted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 18,
    lineHeight: 16,
  },
});


export default criarStyles;

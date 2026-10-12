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
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    color: cores.text,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  mapWrapper: {
    height: 260,
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: cores.card,
  },
  map: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  mapPlaceholderText: {
    color: cores.muted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 17,
  },
  recenterButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: cores.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: cores.border,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: cores.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
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
  cinemaLogoText: {
    color: cores.text,
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'center',
  },
  cinemaInfo: {
    flex: 1,
  },
  cinemaNomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cinemaNome: {
    color: cores.text,
    fontSize: 14,
    fontWeight: '700',
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
  mockNotice: {
    color: cores.muted,
    fontSize: 11,
    textAlign: 'center',
    marginVertical: 12,
    fontStyle: 'italic',
  },
});


export default criarStyles;
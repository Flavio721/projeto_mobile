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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: cores.text,
    fontSize: 14,
  },
  filterButton: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  filterButtonActive: {
    backgroundColor: cores.gold,
    borderColor: cores.gold,
  },
  filterDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: cores.gold,
    borderWidth: 1,
    borderColor: cores.background,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: cores.text,
    fontSize: 14,
    fontWeight: '700',
  },
  limparTudoText: {
    color: cores.gold,
    fontSize: 12,
    fontWeight: '600',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  tagText: {
    color: cores.text,
    fontSize: 12,
    fontWeight: '600',
    marginRight: 6,
  },
  resultadosTitle: {
    color: cores.muted,
    fontSize: 13,
    marginBottom: 12,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
  },
  poster: {
    width: 50,
    height: 70,
    borderRadius: 8,
    backgroundColor: cores.posterFallback,
  },
  posterFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultInfo: {
    flex: 1,
    marginLeft: 12,
  },
  resultTitulo: {
    color: cores.text,
    fontSize: 14,
    fontWeight: '700',
  },
  resultMeta: {
    color: cores.muted,
    fontSize: 12,
    marginTop: 4,
  },
  resultRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  resultRatingText: {
    color: cores.text,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  hintBox: {
    flexDirection: 'row',
    backgroundColor: cores.card,
    borderRadius: 14,
    padding: 14,
    marginTop: 8,
  },
  hintTextWrapper: {
    flex: 1,
    marginLeft: 10,
  },
  hintTitle: {
    color: cores.gold,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  hintText: {
    color: cores.muted,
    fontSize: 12,
    lineHeight: 17,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: cores.muted,
    fontSize: 13,
    marginTop: 10,
    textAlign: 'center',
  },
});


export default criarStyles;
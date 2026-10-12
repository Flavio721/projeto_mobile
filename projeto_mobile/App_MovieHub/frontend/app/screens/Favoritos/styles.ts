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
    justifyContent: 'space-between',
    paddingTop: 12,
    marginBottom: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: cores.text,
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 8,
  },
  iconButton: {
    padding: 4,
  },
  subtitle: {
    color: cores.muted,
    fontSize: 13,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  cardSpacing: {
    marginBottom: 10,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    color: cores.muted,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});


export default criarStyles;
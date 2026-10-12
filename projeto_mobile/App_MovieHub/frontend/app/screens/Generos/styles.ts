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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  emojiCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: cores.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  emoji: {
    fontSize: 18,
  },
  rowInfo: {
    flex: 1,
  },
  rowLabel: {
    color: cores.text,
    fontSize: 15,
    fontWeight: '700',
  },
  rowCount: {
    color: cores.muted,
    fontSize: 12,
    marginTop: 2,
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
  },
});


export default criarStyles;
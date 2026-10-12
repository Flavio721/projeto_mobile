import { StyleSheet } from 'react-native';
import type { Paleta } from '../../theme/paletas';

const criarStyles = (cores: Paleta) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: cores.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
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
  sectionLabel: {
    color: cores.muted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 16,
  },
  sectionCard: {
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 14,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: cores.border,
  },
  rowIcon: {
    width: 22,
    alignItems: 'center',
  },
  rowLabel: {
    flex: 1,
    color: cores.text,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 12,
  },
  rowValue: {
    color: cores.muted,
    fontSize: 13,
    marginRight: 6,
  },
});

export default criarStyles;

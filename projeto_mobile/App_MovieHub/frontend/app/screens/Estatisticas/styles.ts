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
    justifyContent: 'space-between',
    paddingTop: 12,
    marginBottom: 20,
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
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  summaryCardTitle: {
    color: cores.text,
    fontSize: 15,
    fontWeight: '700',
  },
  summaryCardSubtitle: {
    color: cores.muted,
    fontSize: 12,
    marginTop: 2,
  },
  summaryIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: cores.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
    marginBottom: 20,
  },
  statBox: {
    width: '50%',
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  statBoxInner: {
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  statIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    color: cores.text,
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    color: cores.muted,
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
  statStarsRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    color: cores.text,
    fontSize: 14,
    fontWeight: '700',
  },
  verTodosText: {
    color: cores.gold,
    fontSize: 12,
    fontWeight: '600',
  },
  proporcaoBar: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 14,
  },
  legendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  legendaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendaDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 8,
  },
  legendaLabel: {
    color: cores.text,
    fontSize: 12,
  },
  legendaValue: {
    color: cores.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  barChartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 110,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barValue: {
    color: cores.muted,
    fontSize: 10,
    marginBottom: 4,
  },
  bar: {
    width: 16,
    borderRadius: 4,
    backgroundColor: cores.gold,
  },
  barLabel: {
    color: cores.muted,
    fontSize: 10,
    marginTop: 6,
  },
  mockNotice: {
    color: cores.muted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
});


export default criarStyles;
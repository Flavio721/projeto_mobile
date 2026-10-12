import { StyleSheet } from 'react-native';

import type { Paleta } from '../../theme/paletas';

const criarStyles = (cores: Paleta) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: cores.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 16,
  },
  topBarTitle: {
    color: cores.text,
    fontSize: 17,
    fontWeight: '700',
  },
  iconButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  posterWrapper: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  poster: {
    width: 110,
    height: 156,
    borderRadius: 12,
    backgroundColor: cores.posterFallback,
  },
  posterFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  titulo: {
    color: cores.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  metaLine: {
    color: cores.muted,
    fontSize: 13,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingText: {
    color: cores.text,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: cores.gold,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusBadgeText: {
    color: cores.onGold,
    fontSize: 11,
    fontWeight: '700',
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    color: cores.muted,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  sectionValue: {
    color: cores.text,
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  myRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  myRatingValue: {
    color: cores.text,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
  trailerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  trailerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trailerText: {
    color: cores.text,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  actionButtonText: {
    color: cores.muted,
    fontSize: 11,
    marginTop: 6,
    fontWeight: '600',
  },
  actionButtonTextActive: {
    color: cores.gold,
  },
  actionButtonTextDanger: {
    color: cores.danger,
  },
  primaryButton: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.gold,
    borderRadius: 12,
    marginTop: 4,
  },
  primaryButtonText: {
    color: cores.onGold,
    fontSize: 15,
    fontWeight: '700',
  },
  errorText: {
    color: cores.muted,
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },
});


export default criarStyles;

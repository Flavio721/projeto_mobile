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
  title: {
    color: cores.text,
    fontSize: 18,
    fontWeight: '700',
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCard: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarWrapper: {
    marginBottom: 12,
  },
  avatarCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: cores.posterFallback,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: cores.gold,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarCameraBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: cores.gold,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: cores.background,
  },
  nome: {
    color: cores.text,
    fontSize: 18,
    fontWeight: '700',
  },
  email: {
    color: cores.muted,
    fontSize: 13,
    marginTop: 2,
  },
  membroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  membroText: {
    color: cores.muted,
    fontSize: 12,
    marginLeft: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 14,
    paddingVertical: 14,
    marginRight: 8,
  },
  statBoxLast: {
    marginRight: 0,
  },
  statIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statValue: {
    color: cores.text,
    fontSize: 17,
    fontWeight: '700',
  },
  statLabel: {
    color: cores.muted,
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
  menuCard: {
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 14,
    marginBottom: 20,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: cores.border,
  },
  menuIcon: {
    width: 22,
    alignItems: 'center',
  },
  menuLabel: {
    flex: 1,
    color: cores.text,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: cores.danger,
    borderRadius: 14,
    paddingVertical: 14,
  },
  logoutText: {
    color: cores.danger,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
});


export default criarStyles;
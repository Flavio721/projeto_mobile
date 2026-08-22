import { StyleSheet } from 'react-native';

const COLORS = {
  background: '#151327',
  card: 'rgba(255,255,255,0.06)',
  border: 'rgba(255,255,255,0.12)',
  gold: '#F4B400',
  white: '#FFFFFF',
  muted: '#9C97B8',
  placeholder: '#6E6A8C',
  avatarBg: '#3B3566',
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 12,
  },
  topBarTitles: {
    flex: 1,
  },
  title: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 2,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.avatarBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBadge: {
    position: 'absolute',
    right: 0,
    bottom: 4,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  avatarHint: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 10,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: COLORS.white,
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: COLORS.gold,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  primaryButtonText: {
    color: '#241C00',
    fontSize: 15,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: COLORS.muted,
    fontSize: 13,
  },
  footerLink: {
    color: COLORS.gold,
    fontSize: 13,
    fontWeight: '700',
  },
});

export { COLORS };
export default styles;
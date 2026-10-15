import Text from './TextoLocalizado';
import React, { useEffect, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTema } from '../../contexts/TemaContext';
import { useIdioma } from '../../contexts/IdiomaContext';
import type { Paleta } from '../../theme/paletas';
import { normalizarUrlImagem } from '../../lib/uploadImagem';

export type AppMenuRoute = 'Home' | 'Filmes' | 'Favoritos' | 'Perfil' | 'Pesquisa' | 'Generos' | 'Estatisticas' | 'Cinemas' | 'Configuracoes';

interface AppMenuProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (route: AppMenuRoute) => void;
  user: { name: string; email: string; avatarUrl?: string | null } | null;
}

const TAB_ITEMS: { label: string; icon: keyof typeof Ionicons.glyphMap; route: AppMenuRoute }[] = [
  { label: 'home', icon: 'home-outline', route: 'Home' },
  { label: 'movies', icon: 'film-outline', route: 'Filmes' },
  { label: 'favorites', icon: 'heart-outline', route: 'Favoritos' },
  { label: 'profile', icon: 'person-outline', route: 'Perfil' },
];

const MORE_ITEMS: { label: string; icon: keyof typeof Ionicons.glyphMap; route: AppMenuRoute }[] = [
  { label: 'searchTitle', icon: 'search-outline', route: 'Pesquisa' },
  { label: 'genres', icon: 'albums-outline', route: 'Generos' },
  { label: 'stats', icon: 'stats-chart-outline', route: 'Estatisticas' },
  { label: 'nearbyCinemas', icon: 'location-outline', route: 'Cinemas' },
  { label: 'settings', icon: 'settings-outline', route: 'Configuracoes' },
];

export default function AppMenu({ visible, onClose, onSelect, user }: AppMenuProps) {
  const { cores } = useTema();
  const { t } = useIdioma();
  const styles = criarStyles(cores);
  const [avatarComErro, setAvatarComErro] = useState(false);
  useEffect(() => setAvatarComErro(false), [user?.avatarUrl]);

  const renderItem = (item: (typeof TAB_ITEMS)[number]) => (
    <TouchableOpacity key={item.route} style={styles.item} onPress={() => onSelect(item.route)} accessibilityRole="button">
      <Ionicons name={item.icon} size={20} color={cores.text} />
      <Text style={styles.itemLabel}>{t(item.label as never)}</Text>
      <Ionicons name="chevron-forward" size={16} color={cores.muted} />
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.drawer}>
          <View style={styles.header}>
            <View style={styles.brandMark}><Ionicons name="film" size={22} color={cores.onGold} /></View>
            <View style={styles.brandCopy}>
              <Text style={styles.brand}>MovieHub</Text>
              <Text style={styles.subtitle}>{t('subtitle')}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton} accessibilityRole="button" accessibilityLabel={t('close')}>
              <Ionicons name="close" size={22} color={cores.text} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.menuScroll} contentContainerStyle={styles.content}>
            <Text style={styles.section}>{t('navigation')}</Text>
            {TAB_ITEMS.map(renderItem)}
            <Text style={[styles.section, styles.moreSection]}>{t('explore')}</Text>
            {MORE_ITEMS.map(renderItem)}
          </ScrollView>
          <TouchableOpacity style={styles.userFooter} onPress={() => onSelect('Perfil')} accessibilityRole="button">
            {user?.avatarUrl && !avatarComErro ? (
              <Image source={{ uri: normalizarUrlImagem(user.avatarUrl) }} style={styles.userAvatar} onError={() => setAvatarComErro(true)} />
            ) : (
              <View style={[styles.userAvatar, styles.userAvatarFallback]}><Ionicons name="person" size={21} color={cores.muted} /></View>
            )}
            <View style={styles.userCopy}>
              <Text numberOfLines={1} style={styles.userName}>{user?.name || 'MovieHub'}</Text>
              <Text numberOfLines={1} style={styles.userEmail}>{user?.email || ''}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={cores.muted} />
          </TouchableOpacity>
        </SafeAreaView>
        <Pressable style={styles.dismissArea} onPress={onClose} accessibilityLabel={t('close')} />
      </View>
    </Modal>
  );
}

const criarStyles = (cores: Paleta) => StyleSheet.create({
  overlay: { flex: 1, flexDirection: 'row', backgroundColor: cores.overlay },
  dismissArea: { flex: 1 },
  drawer: { flex: 1, width: '84%', maxWidth: 360, backgroundColor: cores.background, borderRightWidth: 1, borderColor: cores.border },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 18, borderBottomWidth: 1, borderColor: cores.border },
  brandMark: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: cores.gold },
  brandCopy: { flex: 1, marginLeft: 12 },
  brand: { color: cores.text, fontSize: 17, fontWeight: '800' },
  subtitle: { color: cores.muted, fontSize: 11, marginTop: 3 },
  closeButton: { padding: 8 },
  content: { paddingHorizontal: 14, paddingTop: 20, paddingBottom: 32 },
  menuScroll: { flex: 1 },
  section: { color: cores.muted, fontSize: 11, fontWeight: '800', letterSpacing: 1, paddingHorizontal: 10, marginBottom: 8 },
  moreSection: { marginTop: 24 },
  item: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, minHeight: 50, borderRadius: 12, marginBottom: 3 },
  itemLabel: { flex: 1, color: cores.text, fontSize: 14, fontWeight: '600', marginLeft: 13 },
  userFooter: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14, borderTopWidth: 1, borderColor: cores.border, gap: 11 },
  userAvatar: { width: 42, height: 42, borderRadius: 21 },
  userAvatarFallback: { alignItems: 'center', justifyContent: 'center', backgroundColor: cores.card },
  userCopy: { flex: 1, minWidth: 0 },
  userName: { color: cores.text, fontSize: 14, fontWeight: '700' },
  userEmail: { color: cores.muted, fontSize: 11, marginTop: 3 },
});

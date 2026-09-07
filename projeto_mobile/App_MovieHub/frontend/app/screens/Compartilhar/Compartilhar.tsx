import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Linking, Share, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import styles, { COLORS } from './styles';
import { useToast } from '../../contexts/ToastContext';
import type { MainStackParamList } from '../../navigation/MainStack';

type CompartilharNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Compartilhar'>;
type CompartilharRouteProp = RouteProp<MainStackParamList, 'Compartilhar'>;

export default function Compartilhar() {
  const navigation = useNavigation<CompartilharNavigationProp>();
  const route = useRoute<CompartilharRouteProp>();
  const { filme } = route.params;
  const { showSuccess, showError } = useToast();

  // Não existe deep link/URL pública do app ainda — o que é compartilhado é
  // um resumo em texto do filme, não um link clicável de verdade.
  const textoCompartilhamento =
    `🎬 ${filme.titulo} (${filme.ano})\n` +
    `⭐ ${filme.nota.toFixed(1)}/5 • ${filme.genero}\n\n` +
    (filme.descricao ? `${filme.descricao}\n\n` : '') +
    `Compartilhado via MovieHub`;

  const abrirUrlOuAvisar = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      showError('Não foi possível abrir esse aplicativo. Ele está instalado?');
    }
  };

  const handleWhatsApp = () => abrirUrlOuAvisar(`whatsapp://send?text=${encodeURIComponent(textoCompartilhamento)}`);
  const handleTelegram = () => abrirUrlOuAvisar(`tg://msg?text=${encodeURIComponent(textoCompartilhamento)}`);
  const handleEmail = () => abrirUrlOuAvisar(`mailto:?subject=${encodeURIComponent(`Confira: ${filme.titulo}`)}&body=${encodeURIComponent(textoCompartilhamento)}`);
  const handleSms = () => {
    const separador = Platform.OS === 'ios' ? '&' : '?';
    abrirUrlOuAvisar(`sms:${separador}body=${encodeURIComponent(textoCompartilhamento)}`);
  };

  const handleCopiarLink = async () => {
    // Não existe link de verdade — copia o texto-resumo mesmo.
    await Clipboard.setStringAsync(textoCompartilhamento);
    showSuccess('Copiado para a área de transferência!');
  };

  const handleShareNativo = async () => {
    try {
      await Share.share({ message: textoCompartilhamento });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  const opcoes = [
    { label: 'WhatsApp', icon: 'logo-whatsapp' as const, cor: '#25D366', onPress: handleWhatsApp },
    { label: 'Instagram', icon: 'logo-instagram' as const, cor: '#E1306C', onPress: handleShareNativo },
    { label: 'Facebook', icon: 'logo-facebook' as const, cor: '#1877F2', onPress: handleShareNativo },
    { label: 'Telegram', icon: 'paper-plane-outline' as const, cor: '#29A9EA', onPress: handleTelegram },
    { label: 'E-mail', icon: 'mail-outline' as const, cor: COLORS.muted, onPress: handleEmail },
    { label: 'Copiar link', icon: 'link-outline' as const, cor: COLORS.gold, onPress: handleCopiarLink },
    { label: 'Mensagens', icon: 'chatbox-outline' as const, cor: '#4EA1F3', onPress: handleSms },
    { label: 'Mais opções', icon: 'ellipsis-horizontal-circle-outline' as const, cor: COLORS.white, onPress: handleShareNativo },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.title}>Compartilhar Filme</Text>
        </View>

        <View style={styles.filmeCard}>
          {filme.posterUri ? (
            <Image source={{ uri: filme.posterUri }} style={styles.poster} />
          ) : (
            <View style={[styles.poster, styles.posterFallback]}>
              <Ionicons name="film-outline" size={24} color={COLORS.white} />
            </View>
          )}
          <View style={styles.filmeInfo}>
            <Text style={styles.filmeTitulo} numberOfLines={1}>{filme.titulo}</Text>
            <Text style={styles.filmeMeta}>{filme.ano} • {filme.genero}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color={COLORS.gold} />
              <Text style={styles.ratingText}>{filme.nota.toFixed(1)}/5</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>
                  {filme.status === 'WATCHED' ? 'Assistido' : 'Quero assistir'}
                </Text>
              </View>
            </View>
            {!!filme.descricao && (
              <Text style={styles.filmeDescricao} numberOfLines={2}>{filme.descricao}</Text>
            )}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Compartilhar via</Text>
        <View style={styles.grid}>
          {opcoes.map((opcao) => (
            <TouchableOpacity key={opcao.label} style={styles.gridItem} onPress={opcao.onPress}>
              <View style={styles.gridIconBox}>
                <Ionicons name={opcao.icon} size={24} color={opcao.cor} />
              </View>
              <Text style={styles.gridLabel}>{opcao.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
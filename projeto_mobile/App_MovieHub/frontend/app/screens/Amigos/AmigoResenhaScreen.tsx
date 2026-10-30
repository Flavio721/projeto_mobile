import React from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Text from '../components/TextoLocalizado';
import { useTema, useStyles } from '../../contexts/TemaContext';
import { useIdioma } from '../../contexts/IdiomaContext';
import type { MainStackParamList } from '../../navigation/MainStack';
import type { Paleta } from '../../theme/paletas';
import { normalizarUrlImagem } from '../../lib/uploadImagem';

const criarStyles = (cores: Paleta) => ({
  safeArea: { flex: 1, backgroundColor: cores.background },
  content: { flexGrow: 1, padding: 20, paddingBottom: 36 },
  header: { minHeight: 48, flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const },
  backButton: { width: 42, height: 42, borderRadius: 14, alignItems: 'center' as const, justifyContent: 'center' as const, backgroundColor: cores.card },
  headerTitle: { color: cores.text, fontSize: 17, fontWeight: '800' as const },
  coverFrame: { alignSelf: 'center' as const, width: 150, height: 218, marginTop: 22, marginBottom: 18, borderRadius: 16, overflow: 'hidden' as const, alignItems: 'center' as const, justifyContent: 'center' as const, backgroundColor: cores.card },
  cover: { width: '100%' as const, height: '100%' as const },
  workTitle: { color: cores.text, fontSize: 22, fontWeight: '800' as const, textAlign: 'center' as const },
  creator: { color: cores.muted, fontSize: 14, textAlign: 'center' as const, marginTop: 6 },
  reviewer: { color: cores.muted, fontSize: 13, textAlign: 'center' as const, marginTop: 16 },
  ratingCard: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, gap: 9, alignSelf: 'center' as const, marginTop: 18, paddingHorizontal: 18, paddingVertical: 11, borderRadius: 14, backgroundColor: cores.surface, borderWidth: 1, borderColor: cores.border },
  rating: { color: cores.text, fontSize: 17, fontWeight: '800' as const },
  reviewCard: { marginTop: 18, padding: 18, borderRadius: 18, borderWidth: 1, borderColor: cores.border, backgroundColor: cores.surface },
  reviewHeading: { color: cores.text, fontSize: 16, fontWeight: '800' as const, marginBottom: 10 },
  reviewText: { color: cores.text, fontSize: 15, lineHeight: 24 },
  empty: { color: cores.muted, fontSize: 14, lineHeight: 21 },
});

export default function AmigoResenhaScreen() {
  const styles = useStyles(criarStyles);
  const { cores } = useTema();
  const { traduzir } = useIdioma();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const route = useRoute<RouteProp<MainStackParamList, 'AmigoResenha'>>();
  const { kind, title, creator, coverUrl, rating, comment, reviewerName, reviewsVisible } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel={traduzir('Voltar')} onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={21} color={cores.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{traduzir(kind === 'book' ? 'Resenha de livro' : 'Resenha de filme')}</Text>
          <View style={{ width: 42 }} />
        </View>

        <View style={styles.coverFrame}>
          {coverUrl ? <Image source={{ uri: normalizarUrlImagem(coverUrl) }} style={styles.cover} resizeMode="cover" /> : (
            <Ionicons name={kind === 'book' ? 'book-outline' : 'film-outline'} size={42} color={cores.muted} />
          )}
        </View>
        <Text style={styles.workTitle}>{title}</Text>
        {creator ? <Text style={styles.creator}>{creator}</Text> : null}
        <Text style={styles.reviewer}>{traduzir('Resenha de')} {reviewerName}</Text>

        {reviewsVisible ? (
          <>
            {typeof rating === 'number' ? (
              <View style={styles.ratingCard}>
                <Ionicons name="star" size={20} color={cores.gold} />
                <Text style={styles.rating}>{rating}/5</Text>
                <Text style={styles.creator}>{traduzir('Nota')}</Text>
              </View>
            ) : null}
            <View style={styles.reviewCard}>
              <Text style={styles.reviewHeading}>{traduzir('Resenha')}</Text>
              <Text style={styles.reviewText}>{comment?.trim() || traduzir('Este usuário ainda não escreveu uma resenha para esta obra.')}</Text>
            </View>
          </>
        ) : (
          <View style={styles.reviewCard}>
            <Text style={styles.reviewHeading}>{traduzir('Resenha')}</Text>
            <Text style={styles.empty}>{traduzir('Este usuário não compartilha notas e resenhas.')}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

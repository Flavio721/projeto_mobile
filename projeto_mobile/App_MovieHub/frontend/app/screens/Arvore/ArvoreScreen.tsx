import Text from '../components/TextoLocalizado';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useTema, useStyles } from '../../contexts/TemaContext';
import { useIdioma } from '../../contexts/IdiomaContext';
import { buscarItem } from '../../lib/storage';
import criarStyles from './styles';
import type { MainTabsParamList } from '../../navigation/MainTabs';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const MARCOS = [0, 1, 3, 5, 10, 20, 35, 50];
type Percentual = `${number}%`;
const FLORES: { emoji: string; top: number; left?: Percentual; right?: Percentual }[] = [
  { emoji: '🌼', top: 169, left: '16%' },
  { emoji: '🌸', top: 201, left: '31%' },
  { emoji: '🌷', top: 177, right: '21%' },
  { emoji: '🌼', top: 212, right: '10%' },
  { emoji: '🌸', top: 149, right: '33%' },
  { emoji: '🌷', top: 229, left: '22%' },
];

export default function ArvoreScreen() {
  const styles = useStyles(criarStyles);
  const { cores } = useTema();
  const { traduzir, idioma } = useIdioma();
  const navigation = useNavigation<BottomTabNavigationProp<MainTabsParamList>>();
  const [assistidos, setAssistidos] = useState(0);
  const [livrosLidos, setLivrosLidos] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [instrucoesVisiveis, setInstrucoesVisiveis] = useState(false);

  const carregarProgresso = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      const token = await buscarItem('token');
      if (!token) throw new Error(traduzir('Sua sessão expirou. Faça login novamente.'));
      const headers = { Authorization: `Bearer ${token}` };
      const [response, booksResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/movies/stats`, { headers }),
        fetch(`${API_BASE_URL}/books/stats`, { headers }).catch(() => null),
      ]);
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !Number.isInteger(data.assistidos) || data.assistidos < 0) {
        throw new Error(data.error ?? traduzir('Não foi possível carregar a árvore. Tente novamente.'));
      }
      const booksData = booksResponse?.ok ? await booksResponse.json().catch(() => ({})) : {};
      setAssistidos(data.assistidos);
      setLivrosLidos(Number.isInteger(booksData.read) && booksData.read >= 0 ? booksData.read : 0);
    } catch (error) {
      setErro(error instanceof Error ? error.message : traduzir('Não foi possível carregar a árvore. Tente novamente.'));
    } finally {
      setCarregando(false);
    }
  }, [traduzir]);

  useFocusEffect(useCallback(() => { void carregarProgresso(); }, [carregarProgresso]));

  const crescimento = assistidos + livrosLidos;
  const progresso = useMemo(() => {
    const marcoAtual = [...MARCOS].reverse().find((marco) => crescimento >= marco) ?? 0;
    const proximoMarco = MARCOS.find((marco) => marco > crescimento);
    if (proximoMarco === undefined) return { marcoAtual, proximoMarco: null, percentual: 1, faltam: 0 };
    const intervalo = proximoMarco - marcoAtual;
    return {
      marcoAtual,
      proximoMarco,
      percentual: intervalo ? (crescimento - marcoAtual) / intervalo : 1,
      faltam: proximoMarco - crescimento,
    };
  }, [crescimento]);

  const emojiArvore = crescimento === 0 ? '🌱' : crescimento < 5 ? '🌿' : '🌳';
  const tamanhoArvore = crescimento === 0 ? 82 : crescimento < 3 ? 94 : crescimento < 5 ? 106 : crescimento < 10 ? 116 : crescimento < 20 ? 126 : 136;
  const floresVisiveis = Math.min(Math.floor(crescimento / 5), FLORES.length);
  const mensagemArvore = crescimento === 0
    ? 'Sua árvore está começando'
    : crescimento >= 20
      ? 'Sua árvore está florescendo'
      : 'Sua árvore está crescendo';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>MovieHub</Text>
            <Text style={styles.title}>Minha árvore de filmes</Text>
          </View>
          <TouchableOpacity
            onPress={() => setInstrucoesVisiveis(true)}
            style={styles.helpButton}
            accessibilityRole="button"
            accessibilityLabel={traduzir('Como funciona a árvore')}
          >
            <Ionicons name="help-circle-outline" size={25} color={cores.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.scene}>
          <View style={styles.sun} />
          <View style={styles.cloudOne} />
          <View style={styles.cloudTwo} />
          <View style={styles.hillBack} />
          <View style={styles.hillFront} />
          <Text style={[styles.treeEmoji, { fontSize: tamanhoArvore, lineHeight: tamanhoArvore + 24 }]}>{emojiArvore}</Text>
          {FLORES.slice(0, floresVisiveis).map((flower, index) => (
            <Text key={`${flower.emoji}-${index}`} style={[styles.flower, { top: flower.top, left: flower.left, right: flower.right }]}>{flower.emoji}</Text>
          ))}
          <View style={styles.sceneCaption}>
            <Text style={styles.sceneCaptionText}>{mensagemArvore}</Text>
          </View>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.countRow}>
            <View>
              <Text style={styles.count}>{crescimento.toLocaleString(idioma)}</Text>
              <Text style={styles.countLabel}>{traduzir('Atividades de leitura e cinema')}</Text>
            </View>
            <View style={styles.leafBadge}><Ionicons name="leaf" size={20} color={cores.success} /></View>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.max(0, Math.min(100, progresso.percentual * 100))}%` }]} />
          </View>
          {progresso.proximoMarco === null ? (
            <Text style={styles.nextLabel}>Árvore completa! Continue registrando filmes para mantê-la florida.</Text>
          ) : (
            <Text style={styles.nextLabel}>
              {traduzir('Próximo marco')}: {progresso.proximoMarco} · {progresso.faltam} {traduzir('Mais atividades para o próximo estágio')}
            </Text>
          )}
          <Text style={styles.levelLabel}>{traduzir('Estágio')} {MARCOS.filter((marco) => crescimento >= marco).length} / {MARCOS.length}</Text>
          <Text style={styles.nextLabel}>{assistidos} {traduzir('Filmes assistidos')} · {livrosLidos} {traduzir('Livros lidos')}</Text>
        </View>

        <View style={styles.missionsCard}>
          <View style={styles.missionsHeading}>
            <View style={styles.missionIcon}><Ionicons name="book-outline" size={19} color={cores.success} /></View>
            <View style={styles.missionHeadingText}>
              <Text style={styles.missionTitle}>{traduzir('Missões de leitura')}</Text>
              <Text style={styles.missionSubtitle}>{traduzir('Cada livro lido faz sua árvore crescer.')}</Text>
            </View>
          </View>
          {[1, 3, 5, 10].map((goal) => {
            const current = Math.min(livrosLidos, goal);
            const completed = livrosLidos >= goal;
            return (
              <View key={goal} style={styles.missionRow}>
                <View style={styles.missionCopy}>
                  <Text style={styles.missionLabel}>{traduzir('Leia {count} livros').replace('{count}', String(goal))}</Text>
                  <Text style={styles.missionProgress}>{current} / {goal}</Text>
                  <View style={styles.missionTrack}><View style={[styles.missionFill, { width: `${(current / goal) * 100}%` }]} /></View>
                </View>
                <Ionicons name={completed ? 'checkmark-circle' : 'ellipse-outline'} size={22} color={completed ? cores.success : cores.muted} />
              </View>
            );
          })}
          <TouchableOpacity onPress={() => navigation.navigate('Livros')} style={styles.missionButton} accessibilityRole="button">
            <Text style={styles.missionButtonText}>{traduzir('Abrir biblioteca')}</Text>
            <Ionicons name="arrow-forward" size={16} color={cores.onGold} />
          </TouchableOpacity>
        </View>

        {carregando && <View style={styles.loadingRow}><ActivityIndicator color={cores.success} /><Text style={styles.loadingText}>Carregando sua árvore...</Text></View>}
        {!carregando && !!erro && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{erro}</Text>
            <TouchableOpacity onPress={() => void carregarProgresso()} style={styles.retryButton}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.noteCard}>
          <Ionicons name="sparkles-outline" size={20} color={cores.success} />
          <Text style={styles.noteText}>{traduzir('Filmes assistidos e livros lidos fazem sua árvore crescer.')}</Text>
        </View>
      </ScrollView>

      <Modal visible={instrucoesVisiveis} transparent animationType="fade" onRequestClose={() => setInstrucoesVisiveis(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setInstrucoesVisiveis(false)}>
          <Pressable style={styles.modalCard} onPress={(event) => event.stopPropagation()}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIcon}><Ionicons name="leaf" size={22} color={cores.success} /></View>
              <TouchableOpacity onPress={() => setInstrucoesVisiveis(false)} accessibilityRole="button" accessibilityLabel={traduzir('Fechar')}>
                <Ionicons name="close" size={23} color={cores.muted} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalTitle}>Como funciona a árvore</Text>
            <Text style={styles.instruction}>{traduzir('A árvore cresce com filmes assistidos e livros lidos.')}</Text>
            <Text style={styles.instruction}>{traduzir('Cada filme ou livro conta uma vez quando marcado como assistido ou lido.')}</Text>
            <Text style={styles.instruction}>{traduzir('Novos estágios e flores aparecem ao atingir marcos de crescimento.')}</Text>
            <Text style={styles.instruction}>Os dados vêm da sua lista e ficam sincronizados com sua conta.</Text>
            <TouchableOpacity style={styles.doneButton} onPress={() => setInstrucoesVisiveis(false)}>
              <Text style={styles.doneButtonText}>Entendi</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

import Text from '../components/TextoLocalizado';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTema, useStyles } from '../../contexts/TemaContext';
import { useIdioma } from '../../contexts/IdiomaContext';
import { buscarItem } from '../../lib/storage';
import criarStyles from './styles';

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
  const [assistidos, setAssistidos] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [instrucoesVisiveis, setInstrucoesVisiveis] = useState(false);

  const carregarProgresso = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      const token = await buscarItem('token');
      if (!token) throw new Error(traduzir('Sua sessão expirou. Faça login novamente.'));
      const response = await fetch(`${API_BASE_URL}/movies/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !Number.isInteger(data.assistidos) || data.assistidos < 0) {
        throw new Error(data.error ?? traduzir('Não foi possível carregar a árvore. Tente novamente.'));
      }
      setAssistidos(data.assistidos);
    } catch (error) {
      setErro(error instanceof Error ? error.message : traduzir('Não foi possível carregar a árvore. Tente novamente.'));
    } finally {
      setCarregando(false);
    }
  }, [traduzir]);

  useFocusEffect(useCallback(() => { void carregarProgresso(); }, [carregarProgresso]));

  const progresso = useMemo(() => {
    const marcoAtual = [...MARCOS].reverse().find((marco) => assistidos >= marco) ?? 0;
    const proximoMarco = MARCOS.find((marco) => marco > assistidos);
    if (proximoMarco === undefined) return { marcoAtual, proximoMarco: null, percentual: 1, faltam: 0 };
    const intervalo = proximoMarco - marcoAtual;
    return {
      marcoAtual,
      proximoMarco,
      percentual: intervalo ? (assistidos - marcoAtual) / intervalo : 1,
      faltam: proximoMarco - assistidos,
    };
  }, [assistidos]);

  const emojiArvore = assistidos === 0 ? '🌱' : assistidos < 5 ? '🌿' : '🌳';
  const tamanhoArvore = assistidos === 0 ? 82 : assistidos < 3 ? 94 : assistidos < 5 ? 106 : assistidos < 10 ? 116 : assistidos < 20 ? 126 : 136;
  const floresVisiveis = Math.min(Math.floor(assistidos / 5), FLORES.length);
  const mensagemArvore = assistidos === 0
    ? 'Sua árvore está começando'
    : assistidos >= 20
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
              <Text style={styles.count}>{assistidos.toLocaleString(idioma)}</Text>
              <Text style={styles.countLabel}>Filmes assistidos</Text>
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
              {traduzir('Próximo marco')}: {progresso.proximoMarco} · {progresso.faltam} {traduzir('Mais filmes para o próximo estágio')}
            </Text>
          )}
          <Text style={styles.levelLabel}>{traduzir('Estágio')} {MARCOS.filter((marco) => assistidos >= marco).length} / {MARCOS.length}</Text>
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
          <Text style={styles.noteText}>Novos estágios e flores aparecem ao atingir marcos de filmes assistidos.</Text>
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
            <Text style={styles.instruction}>A árvore cresce automaticamente conforme sua coleção de filmes assistidos aumenta.</Text>
            <Text style={styles.instruction}>Cada filme conta uma vez, quando você o marca como assistido.</Text>
            <Text style={styles.instruction}>Novos estágios e flores aparecem ao atingir marcos de filmes assistidos.</Text>
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

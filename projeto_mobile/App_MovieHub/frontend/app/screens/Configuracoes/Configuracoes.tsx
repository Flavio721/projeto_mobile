import Text from '../components/TextoLocalizado';
import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, ScrollView, Switch, Alert, Modal, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import criarStyles from "./styles";
import { useToast } from "../../contexts/ToastContext";
import { buscarItem, salvarItem } from "../../lib/storage";
import type { MainStackParamList } from "../../navigation/MainStack";
import { useStyles, useTema } from "../../contexts/TemaContext";
import { useIdioma, type Idioma } from "../../contexts/IdiomaContext";
import TemaModal from "../components/TemaModal/TemaModal";

const CHAVE_CONFIGURACOES = "configuracoes";

interface ConfiguracoesState {
  corDestaque: boolean;
  lembretes: boolean;
  novidades: boolean;
  sincronizarNuvem: boolean;
  atualizarAoAbrir: boolean;
}

// TEMPORÁRIO — essas preferências só ficam salvas no aparelho (junto do
// token, via o mesmo storage.ts). Notificações/Sincronização ainda não têm
// efeito real: exigiriam um serviço de push e um endpoint
//   de sync no backend, nenhum dos dois existe.
// - Limpar cache: o app não guarda nenhum cache de verdade pra limpar; o
//   "12,4 MB" é um valor de exemplo, fixo.
const PADRAO: ConfiguracoesState = {
  corDestaque: true,
  lembretes: true,
  novidades: true,
  sincronizarNuvem: true,
  atualizarAoAbrir: true,
};

type ConfiguracoesNavigationProp =
  NativeStackNavigationProp<MainStackParamList>;

export default function Configuracoes() {
  const navigation = useNavigation<ConfiguracoesNavigationProp>();
  const { showSuccess } = useToast();
  const styles = useStyles(criarStyles);
  const { cores } = useTema();
  const { idioma, definirIdioma, t, traduzir } = useIdioma();
  const [config, setConfig] = useState<ConfiguracoesState>(PADRAO);
  const [temaVisivel, setTemaVisivel] = useState(false);
  const [idiomaVisivel, setIdiomaVisivel] = useState(false);
  const { nomeTema } = useTema();

  useEffect(() => {
    (async () => {
      const salvo = await buscarItem(CHAVE_CONFIGURACOES);
      if (salvo) {
        try {
          setConfig({ ...PADRAO, ...JSON.parse(salvo) });
        } catch {
          setConfig(PADRAO);
        }
      }
    })();
  }, []);

  const atualizar = (chave: keyof ConfiguracoesState, valor: boolean) => {
    setConfig((prev) => {
      const novo = { ...prev, [chave]: valor };
      salvarItem(CHAVE_CONFIGURACOES, JSON.stringify(novo));
      return novo;
    });
  };

  const handleLimparCache = () => {
    Alert.alert(traduzir("Limpar cache"), traduzir("Isso vai liberar 12,4 MB de espaço."), [
      { text: traduzir("Cancelar"), style: "cancel" },
      {
        text: traduzir("Limpar"),
        onPress: () => showSuccess("Cache limpo com sucesso!"),
      },
    ]);
  };

  const handleSobre = () => {
    Alert.alert(
      traduzir("Sobre o MovieHub"),
      traduzir("MovieHub — gerenciador pessoal de filmes.\nVersão 1.0.0 (projeto de estudo).\n\nEste aplicativo usa TMDB e as APIs do TMDB, mas não é endossado, certificado ou aprovado pelo TMDB.\n\nDados e imagens de filmes fornecidos pelo TMDB (The Movie Database).\nthemoviedb.org"),
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={cores.text} />
          </TouchableOpacity>
          <Text style={styles.title}>{t('settings')}</Text>
        </View>

        <Text style={styles.sectionLabel}>{t('appearance')}</Text>
        <View style={styles.sectionCard}>
          <TouchableOpacity
            style={[styles.row, styles.rowBorder]}
            onPress={() => setTemaVisivel(true)}>
            <View style={styles.rowIcon}>
              <Ionicons name={nomeTema === 'escuro' ? 'moon-outline' : 'sunny-outline'} size={18} color={cores.text} />
            </View>
           <Text style={styles.rowValue}>{nomeTema === 'escuro' ? t('dark') : t('light')}</Text>
            <Ionicons name="chevron-forward" size={16} color={cores.muted} />
          </TouchableOpacity>
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <Ionicons
                name="color-palette-outline"
                size={18}
                color={cores.text}
              />
            </View>
            <Text style={styles.rowLabel}>{t('accent')}</Text>
            <Switch
              value={config.corDestaque}
              onValueChange={(v) => atualizar("corDestaque", v)}
              trackColor={{ false: cores.border, true: cores.gold }}
              thumbColor={cores.surface}
            />
          </View>
        </View>

        <Text style={styles.sectionLabel}>{t('notifications')}</Text>
        <View style={styles.sectionCard}>
          <View style={[styles.row, styles.rowBorder]}>
            <View style={styles.rowIcon}>
              <Ionicons
                name="notifications-outline"
                size={18}
                color={cores.text}
              />
            </View>
            <Text style={styles.rowLabel}>{t('reminders')}</Text>
            <Switch
              value={config.lembretes}
              onValueChange={(v) => atualizar("lembretes", v)}
              trackColor={{ false: cores.border, true: cores.gold }}
              thumbColor={cores.surface}
            />
          </View>
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <Ionicons name="star-outline" size={18} color={cores.text} />
            </View>
            <Text style={styles.rowLabel}>{t('releases')}</Text>
            <Switch
              value={config.novidades}
              onValueChange={(v) => atualizar("novidades", v)}
              trackColor={{ false: cores.border, true: cores.gold }}
              thumbColor={cores.surface}
            />
          </View>
        </View>

        <Text style={styles.sectionLabel}>{t('sync')}</Text>
        <View style={styles.sectionCard}>
          <View style={[styles.row, styles.rowBorder]}>
            <View style={styles.rowIcon}>
              <Ionicons
                name="cloud-upload-outline"
                size={18}
                color={cores.text}
              />
            </View>
            <Text style={styles.rowLabel}>{t('cloud')}</Text>
            <Switch
              value={config.sincronizarNuvem}
              onValueChange={(v) => atualizar("sincronizarNuvem", v)}
              trackColor={{ false: cores.border, true: cores.gold }}
              thumbColor={cores.surface}
            />
          </View>
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <Ionicons name="refresh-outline" size={18} color={cores.text} />
            </View>
            <Text style={styles.rowLabel}>{t('refresh')}</Text>
            <Switch
              value={config.atualizarAoAbrir}
              onValueChange={(v) => atualizar("atualizarAoAbrir", v)}
              trackColor={{ false: cores.border, true: cores.gold }}
              thumbColor={cores.surface}
            />
          </View>
        </View>

        <Text style={styles.sectionLabel}>{t('other')}</Text>
        <View style={styles.sectionCard}>
          <TouchableOpacity
            style={[styles.row, styles.rowBorder]}
            onPress={() => setIdiomaVisivel(true)}>
            <View style={styles.rowIcon}>
              <Ionicons name="globe-outline" size={18} color={cores.text} />
            </View>
            <Text style={styles.rowLabel}>{t('language')}</Text>
            <Text style={styles.rowValue}>{idioma === 'pt-BR' ? t('portuguese') : idioma === 'en' ? t('english') : t('spanish')}</Text>
            <Ionicons name="chevron-forward" size={16} color={cores.muted} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.row, styles.rowBorder]}
            onPress={handleLimparCache}>
            <View style={styles.rowIcon}>
              <Ionicons name="trash-outline" size={18} color={cores.text} />
            </View>
            <Text style={styles.rowLabel}>{t('clearCache')}</Text>
            <Text style={styles.rowValue}>12,4 MB</Text>
            <Ionicons name="chevron-forward" size={16} color={cores.muted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={handleSobre}>
            <View style={styles.rowIcon}>
              <Ionicons
                name="information-circle-outline"
                size={18}
                color={cores.text}
              />
            </View>
            <Text style={styles.rowLabel}>{t('about')}</Text>
            <Ionicons name="chevron-forward" size={16} color={cores.muted} />
          </TouchableOpacity>
        </View>
        <TemaModal visible={temaVisivel} onClose={() => setTemaVisivel(false)} />
        <Modal visible={idiomaVisivel} transparent animationType="fade" onRequestClose={() => setIdiomaVisivel(false)}>
          <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: cores.overlay, justifyContent: 'flex-end' }]} onPress={() => setIdiomaVisivel(false)}>
            <Pressable style={{ backgroundColor: cores.surface, borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: 20, paddingBottom: 32 }}>
              <Text style={{ color: cores.text, fontSize: 16, fontWeight: '700', marginBottom: 12 }}>{t('language')}</Text>
              {([{ code: 'pt-BR', label: t('portuguese') }, { code: 'en', label: t('english') }, { code: 'es', label: t('spanish') }] as const).map((option) => (
                <TouchableOpacity key={option.code} style={{ paddingVertical: 14, borderTopWidth: 1, borderTopColor: cores.border, flexDirection: 'row', justifyContent: 'space-between' }} onPress={() => { definirIdioma(option.code as Idioma); setIdiomaVisivel(false); }}>
                  <Text style={{ color: cores.text }}>{option.label}</Text>
                  {idioma === option.code && <Ionicons name="checkmark" size={18} color={cores.gold} />}
                </TouchableOpacity>
              ))}
            </Pressable>
          </Pressable>
        </Modal>
      </ScrollView>
    </SafeAreaView>
    
  );
}

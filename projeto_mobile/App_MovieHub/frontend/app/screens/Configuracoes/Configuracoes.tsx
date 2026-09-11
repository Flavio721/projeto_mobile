import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styles, { COLORS } from './styles';
import { useToast } from '../../contexts/ToastContext';
import { buscarItem, salvarItem } from '../../lib/storage';
import type { MainStackParamList } from '../../navigation/MainStack';

const CHAVE_CONFIGURACOES = 'configuracoes';

interface ConfiguracoesState {
  corDestaque: boolean;
  lembretes: boolean;
  novidades: boolean;
  sincronizarNuvem: boolean;
  atualizarAoAbrir: boolean;
}

// TEMPORÁRIO — essas preferências só ficam salvas no aparelho (junto do
// token, via o mesmo storage.ts). Nenhuma delas tem efeito real ainda:
// - Tema: o app só tem o visual escuro, não existe um claro pra trocar.
// - Notificações/Sincronização: exigiriam um serviço de push e um endpoint
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

type ConfiguracoesNavigationProp = NativeStackNavigationProp<MainStackParamList>;

export default function Configuracoes() {
  const navigation = useNavigation<ConfiguracoesNavigationProp>();
  const { showSuccess, showError } = useToast();
  const [config, setConfig] = useState<ConfiguracoesState>(PADRAO);

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
    Alert.alert('Limpar cache', 'Isso vai liberar 12,4 MB de espaço.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Limpar', onPress: () => showSuccess('Cache limpo com sucesso!') },
    ]);
  };

  const handleSobre = () => {
    Alert.alert(
      'Sobre o MovieHub',
      'MovieHub — gerenciador pessoal de filmes.\nVersão 1.0.0 (projeto de estudo).',
    );
  };

  const naoImplementado = (nome: string) => showError(`${nome} ainda não foi implementado.`);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.title}>Configurações</Text>
        </View>

        <Text style={styles.sectionLabel}>Aparência</Text>
        <View style={styles.sectionCard}>
          <TouchableOpacity
            style={[styles.row, styles.rowBorder]}
            onPress={() => naoImplementado('Troca de tema')}
          >
            <View style={styles.rowIcon}>
              <Ionicons name="moon-outline" size={18} color={COLORS.white} />
            </View>
            <Text style={styles.rowLabel}>Tema</Text>
            <Text style={styles.rowValue}>Escuro</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.muted} />
          </TouchableOpacity>
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <Ionicons name="color-palette-outline" size={18} color={COLORS.white} />
            </View>
            <Text style={styles.rowLabel}>Cor de destaque</Text>
            <Switch
              value={config.corDestaque}
              onValueChange={(v) => atualizar('corDestaque', v)}
              trackColor={{ false: COLORS.border, true: COLORS.gold }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>

        <Text style={styles.sectionLabel}>Notificações</Text>
        <View style={styles.sectionCard}>
          <View style={[styles.row, styles.rowBorder]}>
            <View style={styles.rowIcon}>
              <Ionicons name="notifications-outline" size={18} color={COLORS.white} />
            </View>
            <Text style={styles.rowLabel}>Lembretes de filmes</Text>
            <Switch
              value={config.lembretes}
              onValueChange={(v) => atualizar('lembretes', v)}
              trackColor={{ false: COLORS.border, true: COLORS.gold }}
              thumbColor={COLORS.white}
            />
          </View>
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <Ionicons name="star-outline" size={18} color={COLORS.white} />
            </View>
            <Text style={styles.rowLabel}>Novidades e lançamentos</Text>
            <Switch
              value={config.novidades}
              onValueChange={(v) => atualizar('novidades', v)}
              trackColor={{ false: COLORS.border, true: COLORS.gold }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>

        <Text style={styles.sectionLabel}>Sincronização</Text>
        <View style={styles.sectionCard}>
          <View style={[styles.row, styles.rowBorder]}>
            <View style={styles.rowIcon}>
              <Ionicons name="cloud-upload-outline" size={18} color={COLORS.white} />
            </View>
            <Text style={styles.rowLabel}>Sincronizar com a nuvem</Text>
            <Switch
              value={config.sincronizarNuvem}
              onValueChange={(v) => atualizar('sincronizarNuvem', v)}
              trackColor={{ false: COLORS.border, true: COLORS.gold }}
              thumbColor={COLORS.white}
            />
          </View>
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <Ionicons name="refresh-outline" size={18} color={COLORS.white} />
            </View>
            <Text style={styles.rowLabel}>Atualizar ao abrir o app</Text>
            <Switch
              value={config.atualizarAoAbrir}
              onValueChange={(v) => atualizar('atualizarAoAbrir', v)}
              trackColor={{ false: COLORS.border, true: COLORS.gold }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>

        <Text style={styles.sectionLabel}>Outros</Text>
        <View style={styles.sectionCard}>
          <TouchableOpacity
            style={[styles.row, styles.rowBorder]}
            onPress={() => naoImplementado('Troca de idioma')}
          >
            <View style={styles.rowIcon}>
              <Ionicons name="globe-outline" size={18} color={COLORS.white} />
            </View>
            <Text style={styles.rowLabel}>Idioma</Text>
            <Text style={styles.rowValue}>Português</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.muted} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.row, styles.rowBorder]} onPress={handleLimparCache}>
            <View style={styles.rowIcon}>
              <Ionicons name="trash-outline" size={18} color={COLORS.white} />
            </View>
            <Text style={styles.rowLabel}>Limpar cache</Text>
            <Text style={styles.rowValue}>12,4 MB</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.muted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={handleSobre}>
            <View style={styles.rowIcon}>
              <Ionicons name="information-circle-outline" size={18} color={COLORS.white} />
            </View>
            <Text style={styles.rowLabel}>Sobre o MovieHub</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.muted} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
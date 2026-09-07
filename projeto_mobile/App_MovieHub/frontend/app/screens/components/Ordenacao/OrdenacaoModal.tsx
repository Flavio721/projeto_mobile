import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles, { COLORS } from './styles'
import type { OrdemFilmes } from '../../../types/Ordenacao';

interface OpcaoOrdenacao {
  value: OrdemFilmes;
  label: string;
  hint: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const OPCOES: OpcaoOrdenacao[] = [
  { value: 'titulo_az', label: 'Título A - Z', hint: 'De A a Z', icon: 'text-outline' },
  { value: 'titulo_za', label: 'Título Z - A', hint: 'De Z a A', icon: 'text-outline' },
  { value: 'recentes', label: 'Mais recentes', hint: 'Os mais cadastrados primeiro', icon: 'calendar-outline' },
  { value: 'antigos', label: 'Mais antigos', hint: 'Os mais antigos primeiro', icon: 'calendar-outline' },
  { value: 'maior_nota', label: 'Maior nota', hint: 'Melhores avaliações primeiro', icon: 'star' },
  { value: 'menor_nota', label: 'Menor nota', hint: 'Menores avaliações primeiro', icon: 'star-outline' },
  { value: 'ano_crescente', label: 'Ano crescente', hint: 'Do mais antigo pro mais novo', icon: 'arrow-up-outline' },
  { value: 'ano_decrescente', label: 'Ano decrescente', hint: 'Do mais novo pro mais antigo', icon: 'arrow-down-outline' },
];

interface OrdenacaoModalProps {
  visible: boolean;
  ordemAtual: OrdemFilmes;
  onClose: () => void;
  onAplicar: (ordem: OrdemFilmes) => void;
}

export default function OrdenacaoModal({ visible, ordemAtual, onClose, onAplicar }: OrdenacaoModalProps) {
  const [selecionado, setSelecionado] = useState<OrdemFilmes>(ordemAtual);

  useEffect(() => {
    if (visible) setSelecionado(ordemAtual);
  }, [visible, ordemAtual]);

  const handleAplicar = () => {
    onAplicar(selecionado);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Ordenar por</Text>
            <Text style={styles.subtitle}>Selecione a forma de ordenação</Text>
          </View>

          <ScrollView style={styles.body}>
            {OPCOES.map((opcao) => {
              const ativo = opcao.value === selecionado;
              return (
                <TouchableOpacity
                  key={opcao.value}
                  style={styles.option}
                  onPress={() => setSelecionado(opcao.value)}
                >
                  <View style={styles.optionIcon}>
                    <Ionicons name={opcao.icon} size={16} color={COLORS.gold} />
                  </View>
                  <View style={styles.optionTextWrapper}>
                    <Text style={styles.optionLabel}>{opcao.label}</Text>
                    <Text style={styles.optionHint}>{opcao.hint}</Text>
                  </View>
                  <Ionicons
                    name={ativo ? 'radio-button-on' : 'radio-button-off'}
                    size={20}
                    color={ativo ? COLORS.gold : COLORS.muted}
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleAplicar}>
              <Text style={styles.primaryButtonText}>Aplicar ordenação</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
              <Text style={styles.secondaryButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
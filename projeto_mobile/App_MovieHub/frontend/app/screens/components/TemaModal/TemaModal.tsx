import React from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '../../../contexts/TemaContext';
import type { NomeTema, Paleta } from '../../../theme/paletas';

const OPCOES: { valor: NomeTema; rotulo: string; icone: keyof typeof Ionicons.glyphMap }[] = [
  { valor: 'escuro', rotulo: 'Escuro', icone: 'moon-outline' },
  { valor: 'claro', rotulo: 'Claro', icone: 'sunny-outline' },
];

interface TemaModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function TemaModal({ visible, onClose }: TemaModalProps) {
  const { nomeTema, definirTema, cores } = useTema();
  const styles = criarStyles(cores);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet}>
          <Text style={styles.titulo}>Tema</Text>
          {OPCOES.map((opcao) => {
            const ativo = opcao.valor === nomeTema;
            return (
              <TouchableOpacity
                key={opcao.valor}
                style={styles.opcao}
                onPress={() => {
                  definirTema(opcao.valor);
                  onClose();
                }}
              >
                <Ionicons name={opcao.icone} size={18} color={cores.text} />
                <Text style={styles.opcaoTexto}>{opcao.rotulo}</Text>
                <Ionicons
                  name={ativo ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color={ativo ? cores.gold : cores.muted}
                />
              </TouchableOpacity>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const criarStyles = (cores: Paleta) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: cores.overlay,
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: cores.surface,
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
      paddingBottom: 28,
      paddingTop: 18,
      paddingHorizontal: 20,
    },
    titulo: {
      color: cores.text,
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 12,
    },
    opcao: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      borderTopWidth: 1,
      borderTopColor: cores.border,
    },
    opcaoTexto: {
      flex: 1,
      color: cores.text,
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 12,
    },
  });
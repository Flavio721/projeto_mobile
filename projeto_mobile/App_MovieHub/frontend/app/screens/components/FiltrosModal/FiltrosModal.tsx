import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Pressable, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles, { COLORS } from './styles';
import SelectField from '../SelectField';
import StarRatingInput from '../StarRatingInput';
import { FILTROS_PADRAO } from '../../../types/Filtros';
import type { Filtros } from '../../../types/Filtros';

const GENEROS = [
  'Ação', 'Aventura', 'Comédia', 'Drama', 'Ficção Científica',
  'Terror', 'Suspense', 'Romance', 'Animação', 'Documentário',
  'Fantasia', 'Crime',
];

const STATUS_PILLS: { label: string; value: Filtros['status'] }[] = [
  { label: 'Todos', value: 'todos' },
  { label: 'Quero assistir', value: 'WATCHLIST' },
  { label: 'Assistido', value: 'WATCHED' },
];

const ORDENAR_OPCOES: { label: string; value: Filtros['ordenarPor'] }[] = [
  { label: 'Mais recentes', value: 'recentes' },
  { label: 'Maior nota', value: 'nota' },
  { label: 'Título (A-Z)', value: 'titulo' },
  { label: 'Ano de lançamento', value: 'ano' },
];

interface FiltrosModalProps {
  visible: boolean;
  filtrosAtuais: Filtros;
  onClose: () => void;
  onAplicar: (filtros: Filtros) => void;
}

export default function FiltrosModal({ visible, filtrosAtuais, onClose, onAplicar }: FiltrosModalProps) {
  const [filtros, setFiltros] = useState<Filtros>(filtrosAtuais);

  // Sempre que o modal reabrir, começa do que já estava aplicado —
  // não do que a pessoa tinha mexido e cancelado da última vez.
  useEffect(() => {
    if (visible) setFiltros(filtrosAtuais);
  }, [visible, filtrosAtuais]);

  const ordenarLabel = ORDENAR_OPCOES.find((o) => o.value === filtros.ordenarPor)?.label ?? null;

  const handleLimpar = () => setFiltros(FILTROS_PADRAO);

  const handleAplicar = () => {
    onAplicar(filtros);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Filtros</Text>
            <TouchableOpacity onPress={handleLimpar}>
              <Text style={styles.limparText}>Limpar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} keyboardShouldPersistTaps="handled">
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Gênero</Text>
              <SelectField
                label="Selecione o gênero"
                placeholder="Todos os gêneros"
                value={filtros.genero}
                options={GENEROS}
                onSelect={(genero : any) => setFiltros((prev : any) => ({ ...prev, genero }))}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.statusRow}>
                {STATUS_PILLS.map((pill) => {
                  const ativo = filtros.status === pill.value;
                  return (
                    <TouchableOpacity
                      key={pill.value}
                      style={[styles.statusPill, ativo && styles.statusPillActive]}
                      onPress={() => setFiltros((prev : any) => ({ ...prev, status: pill.value }))}
                    >
                      <Text style={[styles.statusPillText, ativo && styles.statusPillTextActive]}>
                        {pill.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Ano</Text>
              <View style={styles.rangeRow}>
                <View style={styles.rangeItem}>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex.: 1990"
                    placeholderTextColor={COLORS.placeholder}
                    keyboardType="number-pad"
                    maxLength={4}
                    value={filtros.anoMin}
                    onChangeText={(anoMin) => setFiltros((prev : any) => ({ ...prev, anoMin }))}
                  />
                </View>
                <View style={styles.rangeItem}>
                  <TextInput
                    style={styles.input}
                    placeholder="Ex.: 2024"
                    placeholderTextColor={COLORS.placeholder}
                    keyboardType="number-pad"
                    maxLength={4}
                    value={filtros.anoMax}
                    onChangeText={(anoMax) => setFiltros((prev : any) => ({ ...prev, anoMax }))}
                  />
                </View>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <View style={styles.ratingRow}>
                <Text style={styles.label}>Nota mínima</Text>
                <Text style={styles.ratingHint}>
                  {filtros.notaMinima > 0 ? `${filtros.notaMinima.toFixed(1)} ou mais` : 'Qualquer nota'}
                </Text>
              </View>
              <StarRatingInput
                value={filtros.notaMinima}
                onChange={(notaMinima : any) => setFiltros((prev : any) => ({ ...prev, notaMinima }))}
              />
            </View>

            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Apenas favoritos</Text>
              <Switch
                value={filtros.apenasFavoritos}
                onValueChange={(apenasFavoritos) => setFiltros((prev) => ({ ...prev, apenasFavoritos }))}
                trackColor={{ false: COLORS.border, true: COLORS.gold }}
                thumbColor={COLORS.white}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Ordenar por</Text>
              <SelectField
                label="Ordenar por"
                placeholder="Mais recentes"
                value={ordenarLabel}
                options={ORDENAR_OPCOES.map((o) => o.label)}
                onSelect={(label : any) => {
                  const found = ORDENAR_OPCOES.find((o) => o.label === label);
                  if (found) setFiltros((prev : any) => ({ ...prev, ordenarPor: found.value }));
                }}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleAplicar}>
              <Ionicons name="options-outline" size={18} color="#241C00" />
              <Text style={styles.primaryButtonText}>Aplicar filtros</Text>
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
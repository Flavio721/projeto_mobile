import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { buscarItem, salvarItem } from '../lib/storage';
import { PALETAS } from '../theme/paletas';
import type { NomeTema, Paleta } from '../theme/paletas';

const CHAVE_TEMA = 'tema';

interface TemaContextValue {
  nomeTema: NomeTema;
  cores: Paleta;
  alternarTema: () => void;
  definirTema: (nome: NomeTema) => void;
}

const TemaContext = createContext<TemaContextValue | undefined>(undefined);

export function TemaProvider({ children }: { children: React.ReactNode }) {
  const [nomeTema, setNomeTema] = useState<NomeTema>('escuro');

  // Lê o tema salvo no aparelho assim que o app abre. Enquanto não chega,
  // o padrão é o escuro (que é o visual original do MovieHub), então não
  // existe "piscada" de tela branca.
  useEffect(() => {
    buscarItem(CHAVE_TEMA).then((salvo) => {
      if (salvo === 'claro' || salvo === 'escuro') setNomeTema(salvo);
    });
  }, []);

  const definirTema = (nome: NomeTema) => {
    setNomeTema(nome);
    salvarItem(CHAVE_TEMA, nome);
  };

  const alternarTema = () => definirTema(nomeTema === 'escuro' ? 'claro' : 'escuro');

  const valor = useMemo(
    () => ({ nomeTema, cores: PALETAS[nomeTema], alternarTema, definirTema }),
    [nomeTema],
  );

  return <TemaContext.Provider value={valor}>{children}</TemaContext.Provider>;
}

export function useTema(): TemaContextValue {
  const context = useContext(TemaContext);
  if (!context) {
    throw new Error('useTema precisa ser usado dentro de um <TemaProvider>');
  }
  return context;
}

/**
 * Recebe uma função que monta o StyleSheet a partir das cores e devolve os
 * estilos já prontos, recalculados sempre que o tema muda.
 *
 * Uso na tela:
 *   const styles = useStyles(criarStyles);
 */
export function useStyles<T extends StyleSheet.NamedStyles<T>>(
  criar: (cores: Paleta) => T,
): T {
  const { cores } = useTema();
  return useMemo(() => criar(cores), [cores, criar]);
}
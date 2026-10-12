import React from 'react';
import { Text as NativeText, type TextProps } from 'react-native';
import { useIdioma } from '../../contexts/IdiomaContext';

export default function TextoLocalizado({ children, ...props }: TextProps) {
  const { traduzir } = useIdioma();
  const localized = React.Children.map(children, (child) =>
    typeof child === 'string' ? traduzir(child) : child,
  );
  return <NativeText {...props}>{localized}</NativeText>;
}

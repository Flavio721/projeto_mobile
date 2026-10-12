import React, { forwardRef } from 'react';
import { TextInput as NativeTextInput, type TextInputProps } from 'react-native';
import { useIdioma } from '../../contexts/IdiomaContext';

const CampoTextoLocalizado = forwardRef<NativeTextInput, TextInputProps>(function CampoTextoLocalizado(props, ref) {
  const { traduzir } = useIdioma();
  const placeholder = props.placeholder ? traduzir(props.placeholder) : undefined;
  return <NativeTextInput {...props} ref={ref} placeholder={placeholder} />;
});

export default CampoTextoLocalizado;

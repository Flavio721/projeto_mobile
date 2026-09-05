import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainTabs from './MainTabs';
import Adicionar from '../screens/Adicionar/Adicionar';
import Detalhes from '../screens/Detalhes/Detalhes';
import Editar from '../screens/Editar/Index';
import Excluir from '../screens/Excluir/Index';
import Pesquisa from '../screens/Pesquisa/Pesquisa';
import type { Filme } from '../types/Filme';

export type MainStackParamList = {
  TabsRoot: undefined;
  Adicionar: undefined;
  Detalhes: { filmeId: string };
  Editar: { filmeId: string };
  Excluir: { filme: Filme };
  Pesquisa: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#151327' } }}
    >
      <Stack.Screen name="TabsRoot" component={MainTabs} />
      <Stack.Screen name="Adicionar" component={Adicionar} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Detalhes" component={Detalhes} />
      <Stack.Screen name="Editar" component={Editar} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Excluir" component={Excluir} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Pesquisa" component={Pesquisa} />
    </Stack.Navigator>
  );
}
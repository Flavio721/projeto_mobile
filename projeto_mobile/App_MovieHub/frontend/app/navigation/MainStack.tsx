import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainTabs from "./MainTabs";
import Detalhes from "../screens/Detalhes/Detalhes";
import Pesquisa from "../screens/Pesquisa/Pesquisa";
import Generos from "../screens/Generos/Genero";
import Estatisticas from "../screens/Estatisticas/Estatisticas";
import Compartilhar from "../screens/Compartilhar/Compartilhar";
import Cinemas from "../screens/Cinemas/Cinemas";
import Galeria from "../screens/Galeria/Galeria";
import Configuracoes from "../screens/Configuracoes/Configuracoes";
import type { Filme } from "../types/Filme";
import EditarPerfil from "../screens/EditarPerfil/EditarPerfil";
import AlterarSenha from "../screens/AlterarSenha/AlterarSenha";
import AmigosScreen from "../screens/Amigos/AmigosScreen";
import AmigoAtividadeScreen from "../screens/Amigos/AmigoAtividadeScreen";
import { useTema } from "../contexts/TemaContext";

export type MainStackParamList = {
  TabsRoot: undefined;
  Detalhes: { filmeId: string };
  Pesquisa: { generoInicial?: string } | undefined;
  Generos: undefined;
  Estatisticas: undefined;
  Compartilhar: { filme: Filme };
  Cinemas: undefined;
  Galeria: { onSelecionar: (uri: string) => void };
  Configuracoes: undefined;
  EditarPerfil: undefined;
  AlterarSenha: undefined;
  Amigos: undefined;
  AmigoAtividade: { userId: string; name: string; username: string };
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainStack() {
  const { cores } = useTema();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: cores.background },
      }}>
      <Stack.Screen name="TabsRoot" component={MainTabs} />
      <Stack.Screen name="Detalhes" component={Detalhes} />
      <Stack.Screen name="Pesquisa" component={Pesquisa} />
      <Stack.Screen name="Generos" component={Generos} />
      <Stack.Screen name="Estatisticas" component={Estatisticas} />
      <Stack.Screen
        name="Compartilhar"
        component={Compartilhar}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen name="Cinemas" component={Cinemas} />
      <Stack.Screen
        name="Galeria"
        component={Galeria}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen name="Configuracoes" component={Configuracoes} />
      <Stack.Screen name="EditarPerfil" component={EditarPerfil} />
      <Stack.Screen name="AlterarSenha" component={AlterarSenha} />
      <Stack.Screen name="Amigos" component={AmigosScreen} />
      <Stack.Screen name="AmigoAtividade" component={AmigoAtividadeScreen} />
    </Stack.Navigator>
  );
}

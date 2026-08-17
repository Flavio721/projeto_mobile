import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './app/screens/Home/Home'; 
import Adicionar from './app/screens/Adicionar/Adicionar';
import Detalhes from './app/screens/Detalhes/Detalhes';

// 1. Defina a estrutura do objeto Filme de forma global
export interface Filme {
    id: number;
    name: string;
    description: string;
}

// 2. Centralize a lista de rotas e os parâmetros que cada tela aceita
export type RootStackParamList = {
    Home: undefined;
    Detalhes: { film: Filme };
    Adicionar: { adicionar: (name: string, description: string) => void };
};

// 3. Passe a tipagem para o createDrawerNavigator
const Drawer = createDrawerNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Adicionar" component={Adicionar} />
        <Drawer.Screen name="Detalhes" component={Detalhes} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

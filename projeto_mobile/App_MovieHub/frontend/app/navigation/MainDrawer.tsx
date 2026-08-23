import { createDrawerNavigator } from '@react-navigation/drawer';
import { TouchableOpacity, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import HomeScreen from '../screens/Home/Home';
import Adicionar from '../screens/Adicionar/Adicionar';
import Detalhes from '../screens/Detalhes/Detalhes';

export type StatusFilme = 'assistido' | 'queroAssistir' | 'assistindo';

export interface Filme {
  id: string;
  titulo: string;
  genero: string;
  ano: number;
  duracaoMin?: number;
  diretor?: string;
  descricao?: string;
  nota: number; // 0 a 5
  status: StatusFilme;
  trailerUrl?: string;
  capaUri?: string;
  favorito: boolean;
}

export type MainDrawerParamList = {
    Home: undefined;
    Detalhes: { film: Filme };
    Adicionar: { adicionar: (name: string, description: string) => void };
};

const Drawer = createDrawerNavigator<MainDrawerParamList>();

export default function MainDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={({ navigation }) => ({
        headerTitleAlign: 'center',
        headerTitle: () => (
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>MovieHub</Text>
        ),
        headerRight: () => (
          <TouchableOpacity
            onPress={() => alert("Popup de notificações em desenvolvimento")}
            style={{ marginRight: 15 }}
          >
            <FontAwesome name="bell" size={24} color="black" />
          </TouchableOpacity>
        ),
      })}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Adicionar" component={Adicionar} />
      <Drawer.Screen
        name="Detalhes"
        component={Detalhes}
        options={{ drawerItemStyle: { display: 'none' } }}
      />
    </Drawer.Navigator>
  );
}
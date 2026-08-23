import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { TouchableOpacity, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 

import HomeScreen from './app/screens/Home/Home'; 
import Adicionar from './app/screens/Adicionar/Adicionar';
import Detalhes from './app/screens/Detalhes/Detalhes';
import LoginScreen from './app/screens/Login';
import CadastroScreen from './app/screens/Cadastro';
import SplashScreen from './app/screens/Splash';

export interface Filme {
    id: number;
    name: string;
    description: string;
}

export type RootStackParamList = {
    Home: undefined;
    Detalhes: { film: Filme };
    Adicionar: { adicionar: (name: string, description: string) => void };
    Login: undefined;
    Cadastro: undefined;
    Splash: undefined;
};

const Drawer = createDrawerNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
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
          )
        })}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Adicionar" component={Adicionar} />
        <Drawer.Screen 
          name="Detalhes" 
          component={Detalhes} 
          options={{ drawerItemStyle: { display: 'none' } }}
        />

        {/* TEMPORÁRIO — só para conferir visualmente. Remova quando o fluxo de auth estiver pronto. */}
        <Drawer.Screen name="Splash" component={SplashScreen} />
        <Drawer.Screen name="Login" component={LoginScreen} />
        <Drawer.Screen name="Cadastro" component={CadastroScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
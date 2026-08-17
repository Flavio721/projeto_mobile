import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { TouchableOpacity, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 

import HomeScreen from './app/screens/Home/Home'; 
import Adicionar from './app/screens/Adicionar/Adicionar';
import Detalhes from './app/screens/Detalhes/Detalhes';

export interface Filme {
    id: number;
    name: string;
    description: string;
}

export type RootStackParamList = {
    Home: undefined;
    Detalhes: { film: Filme };
    Adicionar: { adicionar: (name: string, description: string) => void };
};

const Drawer = createDrawerNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator 
        initialRouteName="Home"
        screenOptions={({ navigation }) => ({
          headerTitleAlign: 'center',
          
          // 1. Substitui o título de texto padrão por um componente customizado centralizado
          headerTitle: () => (
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>MovieHub</Text>
          ),
          
          // 2. Ícone de sino posicionado na direita da navbar
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => alert("Popup de notificações em desenvolvimento")} // Exemplo temporário de popup
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
          options={{
            drawerItemStyle: { display: 'none' }
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

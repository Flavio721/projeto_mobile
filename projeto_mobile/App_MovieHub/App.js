import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import Home from './app/screens/Home';
import HomeScreen from './app/screens/Home';
import Adicionar from './app/screens/Adicionar';

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen
          name="MovieHub"
          component={HomeScreen}
        />
        <Drawer.Screen
          name="Adicionar filme"
          component={Adicionar}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}


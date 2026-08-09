import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './app/screens/Home'; 
import Adicionar from './app/screens/Adicionar'; 

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Adicionar" component={Adicionar} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

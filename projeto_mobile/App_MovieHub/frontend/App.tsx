<<<<<<< HEAD
import { NavigationContainer } from "@react-navigation/native";
import { ToastProvider } from "./app/contexts/ToastContext";
import RootStack from "./app/navigation/RootStack";
=======
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from './app/screens/Splash';
import LoginScreen from './app/screens/Login';
import CadastroScreen from './app/screens/Cadastro';
import MainStack from './app/navigation/MainStack';
import { ToastProvider } from './app/contexts/ToastContext';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Cadastro: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
>>>>>>> f6ceb3456ca8f4318e87720b444c106db1f085ab

export default function App() {
  return (
    <ToastProvider>
      <NavigationContainer>
<<<<<<< HEAD
        <RootStack />
=======
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#151327' } }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Cadastro" component={CadastroScreen} />
          <Stack.Screen name="Main" component={MainStack} />
        </Stack.Navigator>
>>>>>>> f6ceb3456ca8f4318e87720b444c106db1f085ab
      </NavigationContainer>
    </ToastProvider>
  );
}
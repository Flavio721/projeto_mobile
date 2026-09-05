import { NavigationContainer } from "@react-navigation/native";
import { ToastProvider } from "./app/contexts/ToastContext";
import RootStack from "./app/navigation/RootStack";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from './app/screens/Splash';
import LoginScreen from './app/screens/Login';
import CadastroScreen from './app/screens/Cadastro';
import MainStack from './app/navigation/MainStack';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Cadastro: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ToastProvider>
      <NavigationContainer>
        <RootStack />      
      </NavigationContainer>
    </ToastProvider>
  );
}
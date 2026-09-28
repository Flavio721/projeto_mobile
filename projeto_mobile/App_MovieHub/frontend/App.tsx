import { NavigationContainer } from "@react-navigation/native";
import { ToastProvider } from "./app/contexts/ToastContext";
import RootStack from "./app/navigation/RootStack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TemaProvider } from "./app/contexts/TemaContext";

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Cadastro: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <TemaProvider>
      <ToastProvider>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </ToastProvider>
    </TemaProvider>
  );
}

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../screens/Splash";
import Login from "../screens/Login";
import Cadastro from "../screens/Cadastro";
import MainStack from "./MainStack";

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Cadastro: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Cadastro" component={Cadastro} />
      <Stack.Screen name="Main" component={MainStack} />
    </Stack.Navigator>
  );
}
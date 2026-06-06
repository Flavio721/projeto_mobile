import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Um from "./screens/Um";
import Dois from "./screens/Dois";
import Tres from "./screens/Tres";
import Quatro from "./screens/Quatro";
import Cinco from "./screens/Cinco";
import Seis from "./screens/Seis";
import Sete from "./screens/Sete";
import Oito from "./screens/Oito";
import Nove from "./screens/Nove";
import Dez from "./screens/Dez";
import Onze from "./screens/Onze";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onze">
        <Stack.Screen name="Um" component={Um} />
        <Stack.Screen name="Dois" component={Dois} />
        <Stack.Screen name="Tres" component={Tres} />
        <Stack.Screen name="Quatro" component={Quatro} />
        <Stack.Screen name="Cinco" component={Cinco} />
        <Stack.Screen name="Seis" component={Seis} />
        <Stack.Screen name="Sete" component={Sete} />
        <Stack.Screen name="Oito" component={Oito} />
        <Stack.Screen name="Nove" component={Nove} />
        <Stack.Screen name="Dez" component={Dez} />
        <Stack.Screen name="Onze" component={Onze} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
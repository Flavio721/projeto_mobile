import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { CepProvider } from "./src/contexts/cepContext";
import { CepScreen } from "./src/screens/CepScreen";
import CepHistoric from "./src/screens/CepHistoric";

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <CepProvider>
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen
            name="Consulta de CEP"
            component={CepScreen}
          />
          <Drawer.Screen
            name="Histórico de consultas"
            component={CepHistoric}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </CepProvider>
  );
}
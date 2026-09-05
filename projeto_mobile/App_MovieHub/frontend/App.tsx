import { NavigationContainer } from "@react-navigation/native";
import { ToastProvider } from "./app/contexts/ToastContext";
import RootStack from "./app/navigation/RootStack";

export default function App() {
  return (
    <ToastProvider>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </ToastProvider>
  );
}
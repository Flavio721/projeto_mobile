import { Login } from "./screens/Home.js";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";

export default function App() {
  return (
    <View style={style.container}>
      <StatusBar hidden={true} />
      <Login />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f4f4f4",
  },
});

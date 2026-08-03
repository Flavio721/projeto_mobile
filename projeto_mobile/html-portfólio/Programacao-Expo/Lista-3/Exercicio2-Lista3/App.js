import { View, TouchableOpacity, Text, StyleSheet, Linking } from "react-native";

export default function App() {
  const abrirDiscagem = () => {
    Linking.openURL("tel:11999999999");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.botao} onPress={abrirDiscagem}>
        <Text style={styles.textoBotao}>Ligar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  botao: {
    backgroundColor: "#22c55e",
    padding: 16,
    borderRadius: 10,
  },
  textoBotao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
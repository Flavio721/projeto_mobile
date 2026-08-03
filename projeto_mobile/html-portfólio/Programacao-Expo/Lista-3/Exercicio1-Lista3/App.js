import { View, TouchableOpacity, Text, StyleSheet, Linking } from "react-native";

export default function App() {
  const abrirYoutube = () => {
    const videoId = "QHEpLOsQC4U";
    Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.botao} onPress={abrirYoutube}>
        <Text style={styles.textoBotao}>Abrir YouTube</Text>
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
    backgroundColor: "#FF0000",
    padding: 16,
    borderRadius: 10,
  },
  textoBotao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
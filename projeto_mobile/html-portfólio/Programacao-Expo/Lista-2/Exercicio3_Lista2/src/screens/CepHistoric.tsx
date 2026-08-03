import { useCep } from "../hooks/useCep";
import { View, Text, StyleSheet } from "react-native";

export default function CepHistoric(){
  const { enderecos } = useCep();

  return(
    <View style={styles.container}>
        {enderecos.map((endereco, index) => (
                <View key={index} style={styles.card}>
                    <Text>{endereco.logradouro} - {endereco.localidade} - {endereco.uf}</Text>
                </View>
        ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#f4f4f4" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    margin: 10
  },
  campo: { fontSize: 15, marginBottom: 6, color: "#333" },
  chave: { fontWeight: "bold" },
});
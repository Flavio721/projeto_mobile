import { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator,
  Alert,
} from "react-native";
import { useCep } from "../hooks/useCep";

export function CepScreen() {
  const [cep, setCep] = useState("");
  const { enderecos, erro, carregando, consultar } = useCep();

  useEffect(() => {
    if (erro) {
      Alert.alert("Erro", erro);
    }
  }, [erro]);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Consulta de CEP</Text>

      <Text style={styles.label}>CEP</Text>
      <TextInput
        style={styles.input}
        placeholder="00000-000"
        keyboardType="numeric"
        maxLength={9}
        value={cep}
        onChangeText={setCep}
      />

      <TouchableOpacity
        style={styles.botao}
        onPress={() => consultar(cep)}
        disabled={carregando}
      >
        {carregando
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.textoBotao}>Obter</Text>
        }
      </TouchableOpacity>

      

      {enderecos.map((endereco, index) => (
        <View key={index} style={styles.card}>
            <Text>{endereco.logradouro} - {endereco.localidade} - {endereco.uf}</Text>
        </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#f4f4f4" },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dcdcdc",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  botao: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  textoBotao: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  erro: { color: "red", marginBottom: 10 },
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
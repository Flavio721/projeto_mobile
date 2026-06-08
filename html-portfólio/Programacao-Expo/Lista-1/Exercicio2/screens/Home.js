import { useState } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";

export function Login() {
  const [pessoas, setPessoas] = useState([]);
  const [idade, setIdade] = useState("");
  const [nome, setNome] = useState("");

  const cadastrar = () => {
    if (!nome || !idade) {
      return;
    }
    const novaPessoa = {
      nome,
      idade,
    };

    setPessoas([...pessoas, novaPessoa]);
    setNome("");
    setIdade("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Digite seu nome"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />
      <TextInput
        placeholder="Digite sua idade"
        value={idade}
        onChangeText={setIdade}
        style={styles.input}
      />
      <TouchableOpacity onPress={cadastrar} style={styles.botao}>
        <Text style={styles.textBotao}>Salvar</Text>
      </TouchableOpacity>
      {pessoas.map((pessoa, index) => (
        <View key={index} style={styles.cardPessoa}>
          <Text style={styles.textPessoa}>
            {pessoa.nome} - {pessoa.idade} anos
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "80%",
    padding: 20,
    backgroundColor: "#f4f4f4",
  },

  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dcdcdc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },

  botao: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },

  textoBotao: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },

  cardPessoa: {
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,

    elevation: 3,
  },

  textoPessoa: {
    fontSize: 16,
    color: "#333",
  },
});

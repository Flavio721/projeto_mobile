import { useState } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setConfirm] = useState("");
  const [pessoas, setPessoas] = useState([]);

  const cadastrar = () => {
    if (!email || !password) return;

    if (passwordConfirm !== password) {
      Alert.alert("Senhas diferentes");
      return;
    }

    const novaPessoa = {
      email,
      password,
    };

    setPessoas([...pessoas, novaPessoa]);
    setEmail("");
    setPassword("");
  };

  const login = () => {
    const pessoa = pessoas.find((pessoa) => pessoa.email === email);

    if (!pessoa) {
      Alert.alert("Cadastro não encontrado");
      return;
    }

    if (pessoa.password !== password) {
      Alert.alert("Senha incorreta");
      return;
    }

    Alert.alert("Login realizado com sucesso");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput
        placeholder="Digite seu email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="Digite sua senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        maxLength={8}
        style={styles.input}
      />
      <TextInput
        placeholder="Digite sua senha"
        value={passwordConfirm}
        onChangeText={setConfirm}
        secureTextEntry={true}
        maxLength={8}
        style={styles.input}
      />
      <View>
        <TouchableOpacity onPress={cadastrar} style={styles.botao}>
          <Text>Cadastrar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={login} style={styles.botao}>
          <Text>Login</Text>
        </TouchableOpacity>
      </View>
      {pessoas.map((pessoa, index) => {
        return (
          <View key={index} style={styles.cardPessoa}>
            <Text style={styles.textoPessoa}>{pessoa.email}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 270,
    padding: 20,
    backgroundColor: "#f4f4f4",
    borderColor: "black",
    borderStyle: "solid",
    borderRadius: 12,
    borderWidth: 1,
  },
  title: {
    textAlign: "center",
    fontSize: 30,
    margin: 15,
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
  boxBotaos: {
    display: "flex",
    flexDirection: "row",
  },
});

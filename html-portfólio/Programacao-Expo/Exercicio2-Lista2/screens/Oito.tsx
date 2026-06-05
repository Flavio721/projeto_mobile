import { useState } from "react";
import { View, TextInput, TouchableOpacity, Alert, Text, StyleSheet } from "react-native";

export default function Oito() {
  type Pessoa = {
    email: string;
    senha: string;
  };
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);  
  const [ email, setEmail ] = useState("");
  const [ senha, setSenha ] = useState("");
  const [ confirmacao, setConfirmacao ] = useState("");

  const salvar = () => {
    if(!email || !senha || !confirmacao){
      Alert.alert("Campos obrigatórios vazios!");
      return;
    }

    if(confirmacao !== senha){
      Alert.alert("Senhas diferentes!");
      return;
    }

    const novaPessoa = {
      email,
      senha
    };

    setPessoas([...pessoas, novaPessoa]);
    setEmail("");
    setSenha("");
    setConfirmacao("")
  }

  const login = () => {
    const pessoa = pessoas.find(
      (pessoa) => pessoa.email === email
    )

    if(!pessoa){
      Alert.alert("Cadastro não encontrado")
      return;
    }

    if(pessoa?.senha !== senha){
      Alert.alert("Senha incorreta!")
      return;
    }

    if(confirmacao !== pessoa?.senha){
      Alert.alert("Senhas diferentes!");
      return;
    }

    else{
      Alert.alert("Cadastro encontrado!");
      return;
    }
  }

  return(
    <View style={styles.container}>

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
        value={senha}
        onChangeText={setSenha}
        secureTextEntry={true}
        maxLength={8}
        style={styles.input}
      />

      <TextInput 
        placeholder="Digite sua senha novamente"
        value={confirmacao}
        onChangeText={setConfirmacao}
        secureTextEntry={true}
        maxLength={8}
        style={styles.input}
      />

    <View style={styles.boxBotaos}>
      <TouchableOpacity onPress={login} style={styles.botao}>
        <Text>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={salvar} style={styles.botao}>
        <Text>Cadastrar</Text>
      </TouchableOpacity>
    </View>

    {pessoas.map((pessoa, index) => (
      <View key={index} style={styles.cardPessoa}>
        <Text style={styles.textoPessoa}>
          {pessoa.email} - {pessoa.senha}
        </Text>
      </View>
    ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: "auto",
    width: 270,
    padding: 20,
    backgroundColor: "#f4f4f4",

    borderColor: "black",
    borderWidth: 1,

    borderRadius: 12,
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
    width: '40%',
    margin: 10
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
    display: 'flex',
    width: '100%',
    flexDirection: 'row'
  }
});
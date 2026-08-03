import { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import style from "../style";

export default function Adicionar() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    function adicionarFilme() {
        if (!name || !description) {
            alert("Por favor, preencha todos os campos!");
            return;
        }

        console.log("Filme para salvar:", { name, description });
        // Aqui entrará a conexão com seu banco de dados ou API
    }

    return (
        <View style={style.container}>
            <TextInput
                placeholder="Nome do filme"
                value={name}
                onChangeText={(text) => setName(text)} // Corrigido aqui
                style={style.input}
            />
            <TextInput
                placeholder="Descrição do filme"
                value={description}
                onChangeText={(text) => setDescription(text)} // Corrigido aqui
                style={style.input}
            />

            <TouchableOpacity style={style.button} onPress={adicionarFilme}>
                <Text style={style.buttonText}>Adicionar Filme</Text>
            </TouchableOpacity>
        </View>
    );
}

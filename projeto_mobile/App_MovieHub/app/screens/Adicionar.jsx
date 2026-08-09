import { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import style from "../style";
import { useRoute } from "@react-navigation/native";

export default function Adicionar({ navigation}) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const route = useRoute();

    const { adicionar } = route.params

    function handleAdicionar() {
    if (!name || !description) {
        alert("Por favor, preencha todos os campos!");
        return;
    }
    adicionar(name, description);
    navigation.goBack()
    setName("")
    setDescription("")
}


    return (
        <View style={style.container}>
            <TextInput
                placeholder="Nome do filme"
                value={name}
                onChangeText={(text) => setName(text)}
                style={style.input}
            />
            <TextInput
                placeholder="Descrição do filme"
                value={description}
                onChangeText={(text) => setDescription(text)}
                style={style.input}
            />

            <TouchableOpacity style={style.button} onPress={handleAdicionar}>
                <Text style={style.buttonText}>Adicionar Filme</Text>
            </TouchableOpacity>
        </View>
    );
}

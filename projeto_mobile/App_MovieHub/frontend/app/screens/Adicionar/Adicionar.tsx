import { useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { useRoute, RouteProp, NavigationProp } from "@react-navigation/native";
import style from "./styles";

// 1. Defina o tipo dos parâmetros que esta tela espera receber
type AdicionarRouteParamList = {
    Adicionar: {
        adicionar: (name: string, description: string) => void;
    };
};

// 2. Tipifique a Rota e a Navegação da tela
type AdicionarScreenRouteProp = RouteProp<AdicionarRouteParamList, 'Adicionar'>;

interface AdicionarProps {
    navigation: NavigationProp<any>; // Permite o uso do .goBack() livremente
}

export default function Adicionar({ navigation }: AdicionarProps) {
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    
    // 3. Passe o tipo correspondente para o useRoute
    const route = useRoute<AdicionarScreenRouteProp>();

    // O TypeScript agora sabe que 'adicionar' é uma função específica
    const { adicionar } = route.params || {};

    function handleAdicionar() {
        if (!name || !description) {
            alert("Por favor, preencha todos os campos!");
            return;
        }
        
        if (adicionar) {
            adicionar(name, description);
            navigation.goBack();
            setName("");
            setDescription("");
        }
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

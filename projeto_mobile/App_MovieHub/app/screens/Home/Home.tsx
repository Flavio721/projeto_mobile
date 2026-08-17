import { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import style from "./styles";

// 1. Definição dos tipos dos parâmetros de cada rota
export type RootStackParamList = {
    Home: undefined;
    Detalhes: { film: Filme };
    Adicionar: { adicionar: (name: string, description: string) => void };
};

interface Filme {
    id: number;
    name: string;
    description: string;
}

function HomeScreen() {
    // 2. Instanciando e tipando o hook de navegação
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    
    // hook da lista de filmes (consulta com Prisma)
    const [films, setFilms] = useState<Filme[]>([]);

    function adicionar(name: string, description: string) {
        const newFilm: Filme = {
            id: Date.now(),
            name: name,
            description: description
        };
        setFilms([...films, newFilm]);
    }

    function excluirFilme(id: number) {
        const newFilms = films.filter(filme => filme.id !== id);
        setFilms(newFilms);
    }

    return (
        <View style={{ backgroundColor: 'rgb(214, 215, 239)', flex: 1 }}>
            {films.map(filme => (
                <View key={filme.id} style={style.filmsBox}>
                    <Text style={style.filmsTitle}>{filme.name}</Text>
                    <View style={style.filmsButtonsBox}>
                        <TouchableOpacity
                            onPress={() => excluirFilme(filme.id)}
                            style={style.filmsButtonRemove}
                        >
                            <Text style={style.filmsButtonText}>Excluir</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            // 3. Sintaxe CORRETA: rota no 1º argumento, objeto de parâmetros no 2º
                            onPress={() => navigation.navigate("Detalhes", { film: filme })}
                            style={style.filmsButtonDetails}
                        >
                            <Text style={style.filmsButtonText}>Detalhes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}

            {films.length === 0 && (
                <Text style={style.noFilmsText}>Nenhum filme registrado</Text>
            )}
            
            <TouchableOpacity
                // 4. Sintaxe CORRETA para a tela de adicionar
                onPress={() => navigation.navigate("Adicionar", { adicionar: adicionar })}
                style={style.buttonAdd}
            >
                <Text style={style.buttonAddText}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

export default HomeScreen;

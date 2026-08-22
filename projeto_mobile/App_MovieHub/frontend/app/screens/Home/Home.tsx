import { useState } from "react";
import { View, TouchableOpacity, Text, ScrollView } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import style from "./styles";
import MovieRow from "./components/MovieBox";

export type RootStackParamList = {
    Home: undefined;
    MovieDetails: { movieId: number }; // Alinhado com a rota que o MovieRow chama
    Adicionar: { adicionar: (name: string, description: string) => void };
};

interface Filme {
    id: number;
    title: string;       // Alterado de 'name' para 'title' para alinhar com a interface do MovieRow
    poster_path?: string;
    genre_ids: number[];
    vote_average?: number;
}

interface Genre {
    id: number;
    name: string;
}

function HomeScreen() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [films, setFilms] = useState<Filme[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]); // Gêneros exigidos pelo MovieRow

    function adicionar(title: string, description: string) {
        const newFilm: Filme = {
            id: Date.now(),
            title: title,
            genre_ids: [], // Inicializa vazio para o TypeScript não reclamar
            vote_average: 0
        };
        setFilms([...films, newFilm]);
    }

    function excluirFilme(id: number) {
        const newFilms = films.filter(filme => filme.id !== id);
        setFilms(newFilms);
    }

    return (
        <View style={{ backgroundColor: 'rgb(214, 215, 239)', flex: 1, paddingHorizontal: 16 }}>
            {/* ScrollView permite rolar a tela caso a lista de filmes fique muito grande */}
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 20 }}>
                {films.map(filme => (
                    // 2. Substituição do layout antigo pelo componente MovieRow unificado
                    <MovieRow 
                        key={filme.id} 
                        item={filme} 
                        genres={genres} 
                    />
                ))}
            </ScrollView>

            {films.length === 0 && (
                <Text style={style.noFilmsText}>Nenhum filme registrado</Text>
            )}
            
            <TouchableOpacity
                onPress={() => navigation.navigate("Adicionar", { adicionar: adicionar })}
                style={style.buttonAdd}
            >
                <Text style={style.buttonAddText}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

export default HomeScreen;

import { useEffect, useState } from "react"
import { View, TouchableOpacity } from "react-native"
import style from "../style";


function HomeScreen() {
    const [films, setFilms] = useState([]);



    function excluirFilme(id) {
        const newFilms = films.filter(filme => filme.id !== id);
    }
    return (
        <View>
            <Navbar />

            {films.map(filme => {
                <View key={filme.id} style={style.filmsBox}>
                    <Text style={style.filmsTitle}>{filme.nome}</Text>
                    <View style={style.filmsButtonsBox}>
                        <TouchableOpacity
                            onPress={() => excluirFilme(filme.id)}
                            style={style.filmsButtonRemove}
                        >
                            <Text style={style.filmsButtonText}>+</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Detalhes", { id: filme.id })}
                            style={style.filmsButtonDetails}
                        >
                            <Text style={style.filmsButtonText}>Detalhes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            })}
            <Button title="+" onPress={() => navigation.navigate("Adicionar")} />
        </View>
    )
}

export default HomeScreen
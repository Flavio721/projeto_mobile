import { useEffect, useState } from "react"
import { View, TouchableOpacity, Button, Text } from "react-native"
import style from "../style";


function HomeScreen({ navigation }) {
    const [films, setFilms] = useState([]);


    function adicionar(name, description) {
        // Aqui entrará a conexão com seu banco de dados ou API
        const newFilm = {
            id: Date.now(),
            name: name,
            description: description
        }
        setFilms([...films, newFilm])
    }
    function excluirFilme(id) {
    const newFilms = films.filter(filme => filme.id !== id);
    setFilms(newFilms);
}
    return (
        <View style={{backgroundColor: 'rgb(214, 215, 239)',flex: 1}}>

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
                            onPress={() => navigation.navigate("Detalhes", { id: filme.id })}
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
                        onPress={() => navigation.navigate("Adicionar", { adicionar: adicionar})}
                        style={style.buttonAdd}
                    >
                        <Text style={style.buttonAddText}>+</Text>
            </TouchableOpacity>
        </View>
    )
}

export default HomeScreen
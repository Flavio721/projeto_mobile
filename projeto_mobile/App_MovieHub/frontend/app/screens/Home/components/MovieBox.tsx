import Text from '../../components/TextoLocalizado';
// components/MovieRow.tsx
import { View, Image, TouchableOpacity } from 'react-native';
import criarStyles from "../styles";
import { useStyles } from '../../../contexts/TemaContext';
import { useNavigation, NavigationProp } from "@react-navigation/native";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w342";

// 1. Definição das interfaces de dados
interface Movie {
  id: number;
  title: string;
  poster_path?: string;
  genre_ids: number[];
  vote_average?: number;
}

interface Genre {
  id: number;
  name: string;
}

interface MovieRowProps {
  item: Movie;
  genres: Genre[];
}

// 2. Tipagem das rotas de navegação suportadas por este componente
type MovieNavigationProp = NavigationProp<{
  MovieDetails: { movieId: number };
}>;

function MovieRow({ item, genres }: MovieRowProps) {
  const styles = useStyles(criarStyles);
  const navigation = useNavigation<MovieNavigationProp>();

  // 4. Mapeamento tipado e seguro contra valores nulos/indefinidos
  const genreNames = item.genre_ids
    .map((id) => genres.find((g) => g.id === id)?.name)
    .filter((name): name is string => Boolean(name));

  return (
    <TouchableOpacity
      style={{ flexDirection: "row", marginBottom: 20 }}
      onPress={() => navigation.navigate("MovieDetails", { movieId: item.id })}
    >
      {item.poster_path && (
        <Image
          source={{ uri: `${IMAGE_BASE_URL}${item.poster_path}` }}
          style={{ width: 100, height: 150, borderRadius: 12 }}
        />
      )}
      <View style={{ marginLeft: 12, flex: 1, justifyContent: "center" }}>
        <Text style={styles.titulo} numberOfLines={2}>
          {item.title}
        </Text>

        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}
        >
          <Text style={styles.ratingText}>
            {item.vote_average?.toFixed(1) ?? "N/A"}/10 IMDb
          </Text>
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}>
          {genreNames.map((name) => (
            <View key={name} style={styles.info}>
              <Text style={styles.meta}>{name.toUpperCase()}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default MovieRow;

import { useRoute, RouteProp } from "@react-navigation/native";
import { View, Text } from "react-native";

// Estrutura de dados do filme (props)
interface FilmePropsParams {
  id: number;
  name: string;
  descricao: string;
}

export default function Detalhes() {
  const route = useRoute();
  const { film } = (route.params as { film: FilmePropsParams }) || {};

  
  return (
    <View>
      <Text>Detalhes do Filme: {film?.name || "Nome não disponível"}</Text>
    </View>
  );
}

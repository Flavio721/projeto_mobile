import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";

export default function Onze({ navigation }: any) {
  return (
    <View style={styles.main_container}>
        <View style={styles.container1}>
            <Image
                source={require('../assets/adaptive-icon.png')}
                style={{ width: '100%', height: '100%' }}
            />
            <Text style={styles.main_text}>HOME</Text>
        </View>
        <View style={styles.container2}>
          <View style={styles.sub_container1}>
              <TouchableOpacity
                style={styles.botao}
                onPress={() => navigation.navigate("Um")}
              >
                <Text>Tela Um</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botao}
                onPress={() => navigation.navigate("Dois")}
              >
                <Text>Tela Dois</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botao}
                onPress={() => navigation.navigate("Tres")}
              >
                <Text>Tela Três</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botao}
                onPress={() => navigation.navigate("Quatro")}
              >
                <Text>Tela Quatro</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botao}
                onPress={() => navigation.navigate("Cinco")}
              >
                <Text>Tela Cinco</Text>
              </TouchableOpacity>
            </View>
              <View style={styles.sub_container2}>
                  <TouchableOpacity
                    style={styles.botao}
                    onPress={() => navigation.navigate("Seis")}>
                    <Text>Tela Seis</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.botao}
                    onPress={() => navigation.navigate("Sete")}>
                    <Text>Tela Sete</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.botao}
                    onPress={() => navigation.navigate("Oito")}>
                    <Text>Tela Oito</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.botao}
                    onPress={() => navigation.navigate("Nove")}>
                    <Text>Tela Nove</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.botao}
                    onPress={() => navigation.navigate("Dez")}>
                    <Text>Tela Dez</Text>
                </TouchableOpacity>
              </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main_container: {
    height: '85%',
    width: '80%',
    display: 'flex',
    flexDirection: 'column',
    gap: 50,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 12,
    margin: 'auto',
    padding: 20
  },
  container1: {
    flex: 0.2,
  },
  container2: {
    flex: 0.5,
    display : "flex",
    flexDirection: 'row',
    
  },
  sub_container1: {
    flex: 0.5,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  sub_container2: {
    flex: 0.5,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  botao: {
    backgroundColor: "yellow",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    color: 'black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 120
  },
  main_text: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
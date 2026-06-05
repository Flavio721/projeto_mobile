import { View, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";


export default function Cinco() {
  const click = () => {
    Alert.alert("Bem-vindo!")
  }
  return (
    <View style={styles.main}>
      <View style={styles.container1}>
        <View style={styles.sub_container1}>
            <TouchableOpacity onPress={click}>
              <Image
                source={require("../assets/adaptive-icon.png")}
                style={{width: '100%', height: '100%'}}
              />
            </TouchableOpacity>
        </View>
        <View style={styles.sub_container2}>
          <View style={styles.sub_container3}>
            <TouchableOpacity onPress={click}>
              <Image
                source={require("../assets/adaptive-icon.png")}
                style={{width: '100%', height: '100%'}}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.sub_container4}>
            <TouchableOpacity onPress={click}>
              <Image
                source={require("../assets/adaptive-icon.png")}
                style={{width: '100%', height: '100%'}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.container2}>
        <TouchableOpacity onPress={click}>
              <Image
                source={require("../assets/adaptive-icon.png")}
                style={{width: '100%', height: '100%'}}
              />
          </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  container1: {
    flex: 0.5,
    display: 'flex',
    flexDirection: 'row'
  },
  container2: {
    flex: 0.5,
    backgroundColor: 'salmon'
  },
  sub_container1: {
    flex: 0.5,
    backgroundColor: 'lime'
  },
  sub_container2: {
    flex: 0.5,
    display: 'flex',
    flexDirection: 'column'
  },
  sub_container3: {
    flex: 0.5,
    backgroundColor: 'teal'
  },
  sub_container4: {
    flex: 0.5,
    backgroundColor: 'skyblue'
  }
})
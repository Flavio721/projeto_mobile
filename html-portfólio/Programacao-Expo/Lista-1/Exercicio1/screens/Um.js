import React from "react";
import { View, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";

export default function Tela1() {
  const mostrarAlerta = () => {
    Alert.alert("Boa noite!");
  };

  return (
    <View style={styles.container}>
      <View style={styles.tela1}>
        <View style={styles.sub_tela1}>
          <TouchableOpacity onPress={mostrarAlerta}>
            <Image
              source={require("../assets/adaptive-icon.png")}
              style={{ width: 64, height: 64 }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.tela3}>
          <View style={styles.sub_tela2}>
            <TouchableOpacity onPress={mostrarAlerta}>
              <Image
                source={require("../assets/adaptive-icon.png")}
                style={{ width: 64, height: 64 }}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.sub_tela3}>
            <TouchableOpacity onPress={mostrarAlerta}>
              <Image
                source={require("../assets/adaptive-icon.png")}
                style={{ width: 64, height: 64 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.tela2}>
        <TouchableOpacity onPress={mostrarAlerta}>
          <Image
            source={require("../assets/adaptive-icon.png")}
            style={{ width: 64, height: 64 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
  },
  tela1: {
    flex: 0.5,
    display: "flex",
    flexDirection: "row",
  },
  tela2: {
    backgroundColor: "salmon",
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  tela3: {
    flex: 0.5,
    display: "flex",
    flexDirection: "column",
  },
  sub_tela1: {
    backgroundColor: "lime",
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  sub_tela2: {
    backgroundColor: "teal",
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  sub_tela3: {
    backgroundColor: "skyblue",
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  botao: {
    backgroundColor: "crimson",
    padding: 15,
    borderRadius: 10,
  },

  textoBotao: {
    color: "white",
    fontSize: 18,
  },
});

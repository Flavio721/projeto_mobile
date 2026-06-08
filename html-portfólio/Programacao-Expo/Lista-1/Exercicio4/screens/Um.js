import React from "react";
import { View, StyleSheet } from "react-native";

export default function Tela1() {
  return (
    <View style={styles.container}>
      <View style={styles.tela1}></View>
      <View style={styles.tela2}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
  },
  tela1: {
    backgroundColor: "crimson",
    flex: 0.5,
  },
  tela2: {
    backgroundColor: "salmon",
    flex: 0.5,
  },
});

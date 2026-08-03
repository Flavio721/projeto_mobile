import { View, StyleSheet } from "react-native";

export default function Um() {
  return (
    <View style={styles.main}>
      <View style={styles.container1}></View>
      <View style={styles.container2}></View>
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
    backgroundColor: 'crimson'
  },
  container2: {
    flex: 0.5,
    backgroundColor: 'salmon'
  }
})
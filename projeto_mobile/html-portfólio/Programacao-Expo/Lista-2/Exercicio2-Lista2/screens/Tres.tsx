import { View, StyleSheet } from "react-native";

export default function Tres() {
  return (
    <View style={styles.main}>
      <View style={styles.container1}>
        <View style={styles.sub_container1}></View>
        <View style={styles.sub_container2}>
          <View style={styles.sub_container3}></View>
          <View style={styles.sub_container4}></View>
        </View>
      </View>
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
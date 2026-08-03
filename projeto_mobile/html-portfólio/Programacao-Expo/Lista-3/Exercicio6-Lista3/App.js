import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Navbar from './screens/Navbar';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <Navbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

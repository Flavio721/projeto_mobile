import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import ListContacts from './screens/ListContacts';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ListContacts />
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

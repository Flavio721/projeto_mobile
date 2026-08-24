import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// TODO: construir a tela de Perfil — dados do usuário logado, logout
// (é aqui que a stack de auth deve ser resetada de volta pro Login).
export default function PerfilScreen() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.text}>Tela de Perfil — em construção</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#151327' },
    container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    text: { color: '#9C97B8', fontSize: 14 },
});
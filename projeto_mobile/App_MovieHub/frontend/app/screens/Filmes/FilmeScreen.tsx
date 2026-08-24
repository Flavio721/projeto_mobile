import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// TODO: construir a tela de Listagem de Filmes (tela 5 do mockup) — abas
// Todos/Assistidos/Quero assistir/Assistindo, busca e filtro, lista de FilmeCard.
export default function FilmesScreen() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.text}>Tela de Filmes — em construção</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#151327' },
    container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    text: { color: '#9C97B8', fontSize: 14 },
});
import * as ScreenOrientation from 'expo-screen-orientation';
import { View, StyleSheet, Text, TextInput, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import Constants from 'expo-constants';

export default function Tela() {
    const [mode, setMode] = useState("portrait");
    const [ palavra, setPalavra ] = useState("");
    const [ palavras, setPalavras ] = useState([]);

    const stylesPortrait = StyleSheet.create({
        container: { flex: 1, flexDirection: 'column', paddingTop: Constants.statusBarHeight, width: '100%', height: '100%' },
        top:    { flex: 1, justifyContent: "center", alignItems: 'center', backgroundColor: '#FFA07A' },
        middle: { flex: 1, justifyContent: "center", alignItems: 'center', backgroundColor: '#F08080' },
        bottom: { flex: 1, justifyContent: "center", alignItems: 'center', backgroundColor: '#FF6347' },
    });

    const stylesLandscape = StyleSheet.create({
        container: { flex: 1, flexDirection: 'row', paddingTop: Constants.statusBarHeight, width: '100%', height: '100%' },
        top:    { flex: 1, justifyContent: "center", alignItems: 'center', backgroundColor: '#dfffc6' },
        middle: { flex: 1, justifyContent: "center", alignItems: 'center', backgroundColor: '#9ef97a' },
        bottom: { flex: 1, justifyContent: "center", alignItems: 'center', backgroundColor: '#3b8724' },
    });

    const style = mode === "portrait" ? stylesPortrait : stylesLandscape;

    useEffect(() => {
        // lê a orientação inicial
        const readOrientation = async () => {
            const orientation = await ScreenOrientation.getOrientationAsync();
            if (
                orientation === ScreenOrientation.Orientation.PORTRAIT_UP ||
                orientation === ScreenOrientation.Orientation.PORTRAIT_DOWN
            ) {
                setMode("portrait");
            } else {
                setMode("landscape");
            }
        };
        readOrientation();

        // escuta mudanças
        const subscription = ScreenOrientation.addOrientationChangeListener(
            ({ orientationInfo }) => {
                if (
                    orientationInfo.orientation === ScreenOrientation.Orientation.PORTRAIT_UP ||
                    orientationInfo.orientation === ScreenOrientation.Orientation.PORTRAIT_DOWN
                ) {
                    setMode("portrait");
                } else {
                    setMode("landscape");
                }
            }
        );

        return () => {
            ScreenOrientation.removeOrientationChangeListener(subscription);
        };
    }, []);

    function guardarPalavra(){
        if(!palavra){
            Alert.alert("Campo obrigatório vazio!");
            return;
        }

        setPalavras([...palavras, palavra]);
        setPalavra("");
    }

    return (
        <View style={style.container}>
            <View style={style.top}>
                <Text>Top</Text>
            </View>
            <View style={style.middle}>
                <Text>Middle</Text>
                <TextInput 
                    placeholder='Digite sua palavra'
                    maxLength={15}
                    onSubmitEditing={guardarPalavra}
                    value={palavra}
                    onChangeText={setPalavra}
                    returnKeyType='done'
                />
            </View>
            <View style={style.bottom}>
                <Text>Bottom</Text>
                {palavras.map((word, index) => (
                    <Text key={index}>{word}</Text>
                ))}
            </View>
        </View>
    );
}
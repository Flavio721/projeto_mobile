import { MaterialIcons } from "@expo/vector-icons";
import { View, Alert, StyleSheet, Image, FlatList } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from "react";


export default function Navbar(){
    const [ image, setImage ] = useState([]);
    const [ hasCameraPermission, setCameraPermission ] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            setCameraPermission(status === "granted");
        })()
    }, []);


    async function openGallery(){
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [9, 16],
            quality: 1
        });

        if(!result.canceled){
            setImage([...image, result.assets[0].uri])
        }
    }

    async function openCamera() {
        if(hasCameraPermission === null ){
            return;
        }

        if(!hasCameraPermission){
            Alert.alert("Permissão para uso de câmera negada");
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        if(!result.canceled){
            setImage([...image, result.assets[0].uri])
        }
    }

    function removeImage(index){
        setImage(image.filter((_, i) => i !== index));
    }

    return (
        <View style={styles.container}>
            <View style={styles.iconBar}>
                <MaterialIcons name="photo-camera" size={24} color="white" onPress={openCamera} />
                <MaterialIcons name="photo-library" size={24} color="white" onPress={openGallery} />
            </View>
            <View style={styles.buttonContainer}>
                <FlatList
                    data={image}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <View style={styles.imageContainer}>
                            <MaterialIcons name="close" size={24} color="white" onPress={() => removeImage(index)} style={styles.closeIcon} />
                            <Image source={{ uri: item }} style={styles.image} />
                        </View>
                    )}
                    />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#222",
        height: '100%',
        width: '100%'
    },
    iconBar: {
        flexDirection: "row",
        justifyContent: "flex-end",
        padding: 16,
        paddingTop: 48,
        gap: 16,
    },
    buttonContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    imageContainer: {
        position: "relative",
        width: 270,
        height: 480,
        marginBottom: 10,
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 10,
    },
    closeIcon: {
        position: "absolute",
        top: 8,
        left: 8,
        zIndex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        borderRadius: 12,
        padding: 2,
    }
});
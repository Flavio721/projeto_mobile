import { StyleSheet } from "react-native";

const style = StyleSheet.create({
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        height: 110
    },
    navbarTitle: {
        fontSize: 30
    },

    noFilmsText: {
        textAlign: 'center',
        fontSize: 25,
        marginTop: 15
    },
    filmsTitle: {
        fontSize: 18,
        textTransform: 'capitalize',
    },
    filmsButtonsBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
    },
    filmsButtonDetails: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
        backgroundColor: 'blue',
        alignItems: 'center',
        justifyContent: 'center'
    },
    filmsButtonRemove: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center'
    },

    filmsButtonText: {
        color: 'white'
    },
    buttonAdd: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        borderRadius: 35,
        backgroundColor: '#9395D3',
        width: 70,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    buttonAddText: {
        fontSize: 30,
        color: '#fff'
    },

    // ADICIONAR SCREEN
    container: {
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
    },
    button: {
        backgroundColor: "#007BFF",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    }
});

export default style;
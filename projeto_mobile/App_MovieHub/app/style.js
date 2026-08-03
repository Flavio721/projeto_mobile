import { StyleSheet } from "react-native";

const style = StyleSheet.create({
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        height: '110px'
    },
    navbarTitle: {
        fontSize: '3em'
    },

    filmsBox: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: 10,
        height: '200px',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: '10px'
    },
    filmsTitle: {
        fontSize: '2em',
    },
    filmsButtonsBox: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    filmsButtonDetails: {
        padding: '10px 12px',
        borderRadius: '10px',
        backgroundColor: 'blue'
    },
    filmsButtonRemove: {
        padding: '10px 12px',
        borderRadius: '10px',
        backgroundColor: 'red'
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
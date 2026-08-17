import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
     filmsBox: {
        padding: 19,
        backgroundColor: '#fff',
        minHeight: 82,
        maxHeight: 100,
        borderRadius: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: '#000',
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        marginTop: 30
    },
    noFilmsText: {
        textAlign: 'center',
        fontSize: 25,
        marginTop: 15,
        position: 'absolute'
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
    textAverage: {
        color: '#9C9C9C',
        fontSize: 14,
        marginLeft: 4
    },
    iconAverage: {
        width: 14,
        height: 14,
        resizeMode: "contain",
    },
    movieRowTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111',
    },
    genrePill: {
        backgroundColor: '#DBE3FF',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    genresText: {
        color: '#88A4E8',
        fontSize: 10,
        fontWeight: 'bold'
    },
    runtimeText: {
        fontSize: 13,
        color: '#9C9C9C',
        marginTop: 6
    }
})

export default style;
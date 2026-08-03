import { View, Text } from "react-native";
import style from "../style";


function Navbar() {

    return (
        <View style={style.navbar}>
            <Text style={style.navbarTitle}>MovieHub</Text>
        </View>
    )
}

export default Navbar;
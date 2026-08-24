import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainTabs from './MainTabs';
import Adicionar from '../screens/Adicionar/Adicionar';
import Detalhes from '../screens/Detalhes/Detalhes';
import type { Filme } from '../types/Filme';

export type MainStackParamList = {
    TabsRoot: undefined;
    Adicionar: undefined;
    Detalhes: { filme: Filme };
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainStack() {
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#151327' } }}
        >
            <Stack.Screen name="TabsRoot" component={MainTabs} />
            <Stack.Screen name="Adicionar" component={Adicionar} options={{ presentation: 'modal' }} />
            <Stack.Screen name="Detalhes" component={Detalhes} />
        </Stack.Navigator>
    );
}
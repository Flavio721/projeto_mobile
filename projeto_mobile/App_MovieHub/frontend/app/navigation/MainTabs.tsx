import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/Home/Home';
import FilmesScreen from '../screens/Filmes/FilmeScreen';
import FavoritosScreen from '../screens/Favoritos/FavoritosScreen';
import PerfilScreen from '../screens/Perfil/PerfilScreen';

export type MainTabsParamList = {
    Home: undefined;
    Filmes: undefined;
    Favoritos: undefined;
    Perfil: undefined;
};

const COLORS = {
    background: '#151327',
    border: 'rgba(255,255,255,0.10)',
    gold: '#F4B400',
    muted: '#6E6A8C',
};

const ICONS: Record<keyof MainTabsParamList, { active: any; inactive: any }> = {
    Home: { active: 'home', inactive: 'home-outline' },
    Filmes: { active: 'film', inactive: 'film-outline' },
    Favoritos: { active: 'heart', inactive: 'heart-outline' },
    Perfil: { active: 'person', inactive: 'person-outline' },
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

export default function MainTabs() {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: COLORS.gold,
                tabBarInactiveTintColor: COLORS.muted,
                tabBarStyle: {
                    backgroundColor: COLORS.background,
                    borderTopColor: COLORS.border,
                },
                tabBarIcon: ({ focused, color, size }) => {
                    const iconSet = ICONS[route.name as keyof MainTabsParamList];
                    const iconName = focused ? iconSet.active : iconSet.inactive;
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
            <Tab.Screen name="Filmes" component={FilmesScreen} options={{ tabBarLabel: 'Filmes' }} />
            <Tab.Screen name="Favoritos" component={FavoritosScreen} options={{ tabBarLabel: 'Favoritos' }} />
            <Tab.Screen name="Perfil" component={PerfilScreen} options={{ tabBarLabel: 'Perfil' }} />
        </Tab.Navigator>
    );
}
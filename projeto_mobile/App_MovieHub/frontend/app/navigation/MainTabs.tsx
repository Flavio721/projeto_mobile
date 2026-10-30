import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/Home/Home';
import FilmesScreen from '../screens/Filmes/FilmeScreen';
import FavoritosScreen from '../screens/Favoritos/FavoritosScreen';
import PerfilScreen from '../screens/Perfil/PerfilScreen';
import ArvoreScreen from '../screens/Arvore/ArvoreScreen';
import LivrosScreen from '../screens/Livros/LivrosScreen';
import { useTema } from '../contexts/TemaContext';
import { useIdioma } from '../contexts/IdiomaContext';

export type MainTabsParamList = {
    Home: undefined;
    Filmes: undefined;
    Favoritos: undefined;
    Livros: undefined;
    Perfil: undefined;
    Arvore: undefined;
};

const ICONS: Record<keyof MainTabsParamList, { active: any; inactive: any }> = {
    Home: { active: 'home', inactive: 'home-outline' },
    Filmes: { active: 'film', inactive: 'film-outline' },
    Favoritos: { active: 'heart', inactive: 'heart-outline' },
    Livros: { active: 'book', inactive: 'book-outline' },
    Perfil: { active: 'person', inactive: 'person-outline' },
    Arvore: { active: 'leaf', inactive: 'leaf-outline' },
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

export default function MainTabs() {
    const { cores } = useTema();
    const { t } = useIdioma();
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: cores.gold,
                tabBarInactiveTintColor: cores.muted,
                tabBarStyle: {
                    backgroundColor: cores.background,
                    borderTopColor: cores.border,
                },
                tabBarLabelStyle: { fontSize: 10 },
                tabBarItemStyle: { minWidth: 0 },
                tabBarIcon: ({ focused, color, size }) => {
                    const iconSet = ICONS[route.name as keyof MainTabsParamList];
                    const iconName = focused ? iconSet.active : iconSet.inactive;
                    return <Ionicons name={iconName} size={20} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: t('home') }} />
            <Tab.Screen name="Filmes" component={FilmesScreen} options={{ tabBarLabel: t('movies') }} />
            <Tab.Screen name="Favoritos" component={FavoritosScreen} options={{ tabBarLabel: t('favorites') }} />
            <Tab.Screen name="Livros" component={LivrosScreen} options={{ tabBarLabel: t('books') }} />
            <Tab.Screen name="Perfil" component={PerfilScreen} options={{ tabBarLabel: t('profile') }} />
            <Tab.Screen name="Arvore" component={ArvoreScreen} options={{ tabBarLabel: t('tree') }} />
        </Tab.Navigator>
    );
}

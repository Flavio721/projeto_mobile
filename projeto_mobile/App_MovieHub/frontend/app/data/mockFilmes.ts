import type { Filme } from '../types/Filme';


export const MOCK_FILMES: Filme[] = [
    {
        id: '1',
        titulo: 'Interestelar',
        ano: 2014,
        genero: 'Ficção Científica',
        nota: 4.8,
        status: 'assistido',
        favorito: true,
    },
    {
        id: '2',
        titulo: 'O Poderoso Chefão',
        ano: 1972,
        genero: 'Drama',
        nota: 5.0,
        status: 'assistido',
        favorito: true,
    },
    {
        id: '3',
        titulo: 'Duna: Parte Dois',
        ano: 2024,
        genero: 'Ficção Científica',
        nota: 4.5,
        status: 'quero_assistir',
        favorito: false,
    },
];
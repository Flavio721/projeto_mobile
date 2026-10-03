# MovieHub

Aplicativo mobile para gerenciamento pessoal de filmes. O usuário cria uma conta, cadastra os filmes que já assistiu ou pretende assistir, organiza por gênero, favorita, avalia e acompanha estatísticas da própria coleção.

Projeto acadêmico desenvolvido para a disciplina de Programação para Aplicativos Móveis (ETEC).

## Sumário

- [Tecnologias](#tecnologias)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Configuração](#configuração)
- [Executando o projeto](#executando-o-projeto)
- [Endpoints da API](#endpoints-da-api)
- [Modelo de dados](#modelo-de-dados)
- [Funcionalidades](#funcionalidades)
- [Limitações conhecidas](#limitações-conhecidas)

## Tecnologias

### Frontend (`/frontend`)

| Categoria | Tecnologia |
|---|---|
| Framework | React Native (0.81) + Expo SDK 54 |
| Linguagem | TypeScript |
| Navegação | React Navigation v7 (native-stack + bottom-tabs) |
| Localização/Mapa | expo-location, react-native-maps |
| Mídia | expo-image-picker, expo-media-library |
| Armazenamento local | expo-secure-store (abstraído por `storage.ts`, com fallback para `localStorage` no modo web) |
| Outros | expo-clipboard, @expo/vector-icons, react-native-reanimated |

### Backend (`/backend`)

| Categoria | Tecnologia |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express 5 |
| Linguagem | TypeScript (execução via `tsx`) |
| ORM | Prisma 7, com driver adapter `@prisma/adapter-pg` |
| Banco de dados | PostgreSQL (hospedado no Neon) |
| Autenticação | JWT (`jsonwebtoken`) + hash de senha (`bcrypt`) |
| Upload de arquivos | `multer` (armazenamento em disco local, pasta `uploads/`) |

## Estrutura do projeto

```
App_MovieHub/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── prisma.config.ts        # configuração do Prisma 7 (datasource, caminho das migrations)
│   ├── uploads/                # imagens enviadas pelos usuários (capas de filme, avatares)
│   └── src/
│       ├── app.ts              # configuração do Express (middlewares e rotas)
│       ├── server.ts           # ponto de entrada — sobe o servidor na porta 3000
│       ├── controllers/        # regra de negócio de cada recurso (user, movie, upload)
│       ├── routes/             # definição das rotas HTTP de cada recurso
│       ├── middlewares/        # authMiddleware (valida o JWT)
│       └── lib/
│           └── prisma.ts       # instância única do Prisma Client
│
└── frontend/
    ├── App.tsx                 # raiz: ToastProvider + TemaProvider + NavigationContainer
    ├── app.json                # configuração do Expo
    └── app/
        ├── navigation/         # RootStack, MainStack, MainTabs
        ├── screens/            # uma pasta por tela
        │   └── components/     # componentes reutilizáveis entre telas
        ├── contexts/           # ToastContext (mensagens de sucesso/erro), TemaContext (tema claro/escuro)
        ├── theme/              # paletas de cores dos dois temas
        ├── lib/                # storage.ts (persistência local), uploadImagem.ts (upload de capa/avatar)
        ├── types/              # tipos compartilhados (Filme, Filtros, Ordenacao)
        └── utils/
            └── movieMapper.ts  # converte o formato da API para o formato usado nas telas
```

## Pré-requisitos

- Node.js 18 ou superior
- Uma instância PostgreSQL acessível (o projeto foi desenvolvido usando o [Neon](https://neon.tech))
- Expo Go instalado no celular (para testar via QR code), **ou** um emulador Android/iOS configurado
- Celular e computador na mesma rede Wi-Fi (necessário para o app conseguir alcançar o backend em desenvolvimento)

## Configuração

### Backend

Crie um arquivo `.env` dentro de `backend/` com:

```
DATABASE_URL=postgresql://usuario:senha@host/banco?sslmode=require
JWT_SECRET=uma_string_longa_e_aleatoria
```

Instale as dependências e aplique as migrations:

```bash
cd backend
npm install
npx prisma migrate dev
```

Crie a pasta de uploads (o `multer` não cria sozinha):

```bash
mkdir uploads
```

### Frontend

Crie um arquivo `.env` dentro de `frontend/` com:

```
EXPO_PUBLIC_API_BASE_URL=http://SEU_IP_LOCAL:3000
```

> Use o IP da sua máquina na rede local (não `localhost`) — é esse endereço que o celular vai usar para encontrar o backend. Descubra o IP com `ipconfig` (Windows) e confirme que o Firewall permite conexões de entrada na porta 3000.

```bash
cd frontend
npm install
```

## Executando o projeto

Em dois terminais separados:

```bash
# Terminal 1 — backend
cd backend
npm run dev
```

```bash
# Terminal 2 — frontend
cd frontend
npx expo start
```

Escaneie o QR code com o app Expo Go, ou pressione `a`/`i` no terminal para abrir em um emulador Android/iOS.

## Endpoints da API

Todas as rotas abaixo (exceto cadastro e login) exigem o header `Authorization: Bearer <token>`.

### Usuários (`/users`)

| Método | Rota | Descrição |
|---|---|---|
| POST | `/users/cadastro` | Cria uma nova conta |
| POST | `/users/login` | Autentica e retorna um token JWT |
| GET | `/users/me` | Retorna os dados do usuário autenticado |
| PUT | `/users/me` | Atualiza nome e/ou foto de perfil |
| PATCH | `/users/me/password` | Altera a senha (exige a senha atual) |

### Filmes (`/movies`)

| Método | Rota | Descrição |
|---|---|---|
| POST | `/movies/register` | Cadastra um novo filme |
| GET | `/movies` | Lista os filmes do usuário autenticado |
| GET | `/movies/stats` | Retorna estatísticas da coleção (total, assistidos, quero assistir, favoritos) |
| GET | `/movies/:id` | Retorna os detalhes de um filme |
| PUT | `/movies/:id` | Atualiza um filme |
| DELETE | `/movies/:id` | Remove um filme |
| PATCH | `/movies/:id/favorite` | Define se um filme é favorito (`{ "isFavorite": boolean }`) |

### Upload (`/upload`)

| Método | Rota | Descrição |
|---|---|---|
| POST | `/upload` | Recebe uma imagem (`multipart/form-data`, campo `imagem`) e retorna a URL pública salva |

## Modelo de dados

```
User
├── id, name, email (único), password (hash), avatarUrl?
└── movies: Movie[]

Movie
├── id, title, coverUrl, releaseYear, duration, director, description
├── rating (0.0 a 5.0), status (WATCHED | WATCHLIST), isFavorite, trailerUrl?
├── pertence a um User (userId)
└── genres: Genre[] (relação muitos-para-muitos)

Genre
├── id, name (único)
└── movies: Movie[]
```

Cada filme pertence a um único usuário — não existe um catálogo compartilhado entre contas; cada usuário cadastra e mantém a própria lista.

## Funcionalidades

- Cadastro e login com autenticação JWT
- Cadastro, edição e exclusão de filmes, com upload de capa (galeria ou câmera)
- Organização por gênero, status (assistido / quero assistir) e favoritos
- Busca e filtros (gênero, status, ano, nota mínima, apenas favoritos) e ordenação (título, data, nota, ano)
- Estatísticas da coleção pessoal
- Localização de cinemas próximos via mapa (dados de localização reais; lista de cinemas ilustrativa — ver limitações)
- Compartilhamento de filmes via WhatsApp, Telegram, e-mail, SMS ou folha de compartilhamento do sistema
- Edição de perfil (nome, foto, senha)
- Tema claro e escuro, com preferência salva no dispositivo

## Limitações conhecidas

- **Tema claro/escuro:** a infraestrutura existe e funciona nas telas já migradas, mas nem todas as telas do app foram convertidas para reagir à troca de tema.
- **Cinemas Próximos:** a localização do usuário é real (GPS do dispositivo), mas a lista de cinemas exibida é ilustrativa — integrar uma API de lugares (ex.: Google Places) exigiria uma chave paga e um proxy no backend.
- **react-native-maps não funciona no modo web** (`expo start --web`); a tela de Cinemas possui uma versão alternativa para esse ambiente, sem mapa.
- **Build de produção (APK):** o projeto ainda não define `android.package` nem os plugins de permissão (câmera, localização, galeria) no `app.json`, necessários para gerar um instalável fora do Expo Go.
- **Backend sem deploy público:** a API roda localmente, na rede do desenvolvedor — um APK instalado fora dessa rede não consegue se conectar até o backend ser hospedado publicamente.
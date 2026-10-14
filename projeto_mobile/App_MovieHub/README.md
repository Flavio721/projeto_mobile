# MovieHub

Aplicativo mobile para gerenciamento pessoal de filmes. O usuário pesquisa títulos do catálogo TMDB e registra o que assistiu ou pretende assistir, com favoritos, avaliações e estatísticas pessoais.

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
| Runtime | Node.js 20.19+ (ESM) |
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

- Node.js 20.19 ou superior (exigido pelo Expo SDK 54)
- Uma instância PostgreSQL acessível (o projeto foi desenvolvido usando o [Neon](https://neon.tech))
- Expo Go instalado no celular (para testar via QR code), **ou** um emulador Android/iOS configurado
- Celular e computador na mesma rede Wi-Fi (necessário para o app conseguir alcançar o backend em desenvolvimento)

## Configuração

### Backend

Crie um arquivo `.env` dentro de `backend/` com:

```
DATABASE_URL=postgresql://usuario:senha@host/banco?sslmode=require
JWT_SECRET=uma_string_longa_e_aleatoria
TMDB_READ_ACCESS_TOKEN=token_de_leitura_da_api_do_tmdb
```

Instale as dependências e aplique as migrations:

```bash
cd backend
npm install
npx prisma migrate dev
npx prisma generate
```

`TMDB_READ_ACCESS_TOKEN` é o API Read Access Token criado nas configurações da conta TMDB. Ele fica somente no backend; não coloque essa credencial em variáveis `EXPO_PUBLIC_*` nem no app mobile. A migration `20261012120000_tmdb_personal_movie_log` remove os filmes e gêneros antigos cadastrados por usuário, preservando as contas e perfis, conforme decisão do projeto.

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

Todas as rotas abaixo (exceto cadastro e login) exigem o header `Authorization: Bearer <token>`. A API consulta o TMDB pelo backend, assim a credencial de leitura não é incluída no aplicativo publicado.

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
| GET | `/movies/search?query=...&page=1` | Pesquisa filmes no catálogo TMDB pelo texto informado |
| GET | `/movies/popular?language=pt-BR` | Recomenda filmes bem avaliados que o usuário ainda não marcou como assistidos |
| GET | `/movies/catalog/:tmdbId` | Busca os detalhes TMDB e o registro pessoal, se houver |
| GET | `/movies` | Lista os registros pessoais do usuário autenticado |
| GET | `/movies/stats` | Retorna estatísticas da coleção (total, assistidos, quero assistir, favoritos) |
| GET | `/movies/:tmdbId/library` | Obtém a lista pessoal para um filme |
| PUT | `/movies/:tmdbId/library` | Adiciona ou atualiza status, favorito, nota, comentário e data assistida |
| DELETE | `/movies/:tmdbId/library` | Remove o filme da lista pessoal, sem remover o catálogo |
| PATCH | `/movies/:tmdbId/favorite` | Define se o filme da lista é favorito (`{ "isFavorite": boolean }`) |

### Cinemas (`/cinemas`)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/cinemas/nearby?lat=...&lng=...&radius=10000` | Busca cinemas mapeados no OpenStreetMap dentro de um raio de até 25 km; requer autenticação |

### Upload (`/upload`)

| Método | Rota | Descrição |
|---|---|---|
| POST | `/upload` | Recebe uma imagem (`multipart/form-data`, campo `imagem`) e retorna a URL pública salva |

## Modelo de dados

```
User
├── id, name, email (único), password (hash), avatarUrl?
└── movies: UserMovie[]

Movie
├── tmdbId (único), title, posterPath, releaseDate, overview, runtime
├── genres e nota pública do TMDB
└── registros pessoais: UserMovie[]

UserMovie
├── userId + movieId (únicos em conjunto)
├── status (WATCHED | WATCHLIST), isFavorite
└── rating (1 a 5, opcional), comment e watchedAt
```

O catálogo é consultado no TMDB e seus metadados são guardados localmente quando alguém adiciona um filme. Cada conta tem um único registro pessoal por filme TMDB. Marcar como assistido exige a data; esse registro pode ser atualizado, sem criar múltiplas avaliações para reassistidas.

## Funcionalidades

- Cadastro e login com autenticação JWT
- Pesquisa de títulos no catálogo do TMDB
- Recomendações de filmes bem avaliados na Home, excluindo títulos já assistidos
- Organização por status (assistido / quero assistir) e favoritos
- Registro de nota de 1 a 5 estrelas, comentário e data em que assistiu
- Busca e filtros (gênero, status, ano, nota mínima, apenas favoritos) e ordenação (título, data, nota, ano)
- Estatísticas da coleção pessoal
- Localização de cinemas próximos via mapa (dados de localização reais; lista de cinemas ilustrativa — ver limitações)
- Compartilhamento de filmes via WhatsApp, Telegram, e-mail, SMS ou folha de compartilhamento do sistema
- Edição de perfil (nome, foto, senha)
- Tema claro/escuro e idioma (português, inglês ou espanhol), com preferências salvas no dispositivo
- Menu lateral com atalhos para as abas, busca, estatísticas, cinemas e configurações
- Busca de cinemas próximos via OpenStreetMap, com distância e link para abrir a rota no Maps
- Compartilhamento das estatísticas pessoais pelo menu nativo do celular
- Lembrete na Home para filmes na watchlist e controle das recomendações populares

## Limitações conhecidas

- **Idioma:** textos da interface, placeholders e recomendações/consultas TMDB acompanham o idioma selecionado. Mensagens futuras adicionadas sem tradução cadastrada aparecem no idioma de origem até receberem uma tradução.
- **Cinemas Próximos:** a tela consulta cinemas cadastrados no OpenStreetMap pelo backend e envia as coordenadas do dispositivo à instância pública do Overpass para a busca. A cobertura depende dos dados mapeados na região; a rota é aberta no Google Maps. O endpoint armazena resultados em memória por cinco minutos.
- **react-native-maps não funciona no modo web** (`expo start --web`); a tela de Cinemas possui uma versão alternativa para esse ambiente, sem mapa.
- **Build de produção (APK):** o projeto ainda não define `android.package` nem os plugins de permissão (câmera, localização, galeria) no `app.json`, necessários para gerar um instalável fora do Expo Go.
- **Backend sem deploy público:** a API roda localmente, na rede do desenvolvedor — um APK instalado fora dessa rede não consegue se conectar até o backend ser hospedado publicamente.
- **TMDB:** antes de publicar, adicionar o logo oficial aprovado e manter em uma área Sobre/Créditos o aviso “Este produto usa a API do TMDB, mas não é endossado nem certificado pelo TMDB.”. A chave privada deve permanecer no backend. Consulte também os termos atuais do TMDB para a publicação planejada.
- **Migration dos filmes:** a migration nova apaga os registros antigos de filmes e gêneros e conserva as contas. Revise a migration e faça backup do banco antes de aplicá-la em qualquer banco com dados que precisem ser preservados.

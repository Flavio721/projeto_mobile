# MovieHub

Aplicativo mobile para gerenciamento pessoal de filmes. O usuário pesquisa títulos do catálogo TMDB e registra o que assistiu ou pretende assistir, com favoritos, avaliações e estatísticas pessoais.

Projeto acadêmico desenvolvido para a disciplina de Programação para Aplicativos Móveis (ETEC).

## Sumário

- [Tecnologias](#tecnologias)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Configuração](#configuração)
- [Executando o projeto](#executando-o-projeto)
- [Hospedagem de produção](#hospedagem-de-produção)
- [Gerar APK Android](#gerar-apk-android)
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
| Localização | expo-location; cinemas consultados via OpenStreetMap/Overpass |
| Mídia | expo-image-picker, expo-media-library |
| Armazenamento local | expo-secure-store (abstraído por `storage.ts`, com fallback para `localStorage` no modo web) |
| Outros | expo-clipboard, @expo/vector-icons, react-native-reanimated |

### Backend (`/backend`)

| Categoria | Tecnologia |
|---|---|
| Runtime | Node.js (ESM; backend de produção hospedado no Render) |
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
    ├── eas.json                # perfis EAS: APK de teste e build de produção
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
- Uma instância PostgreSQL acessível (produção no [Neon](https://neon.com))
- Expo Go instalado no celular (para testar via QR code), **ou** um emulador Android/iOS configurado
- Celular e computador na mesma rede Wi-Fi se o backend local for usado durante o desenvolvimento

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

Para executar localmente, use `http://SEU_IP_LOCAL:3000` em `EXPO_PUBLIC_API_BASE_URL`. Para produção, use a URL HTTPS pública do backend no Render. Essa variável é pública e é incorporada ao app durante o bundle; nunca use nela tokens privados, senha do banco ou segredo JWT.

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

## Hospedagem de produção

O backend Express está publicado no Render e usa PostgreSQL gerenciado pelo Neon. O app mobile chama a URL pública do backend; ele não conecta diretamente ao banco nem ao TMDB.

### Neon (PostgreSQL)

1. Crie ou escolha o projeto e branch do banco que serão usados em produção.
2. No painel de conexão do Neon, copie a connection string. A opção pooled é adequada para o backend; mantenha a string em segredo.
3. Configure a connection string como `DATABASE_URL` nas variáveis de ambiente do serviço Render.
4. Antes de colocar uma versão nova do schema em produção, faça backup quando houver dados importantes e aplique as migrations versionadas com `npx prisma migrate deploy`. Não use `prisma migrate dev` no banco de produção.

### Render (API Express)

Configuração do serviço Web:

| Campo | Valor |
|---|---|
| Branch | `main` |
| Root Directory | `backend` |
| Build Command | `npm ci && npm run build` |
| Start Command | `npm start` (`node dist/src/server.js`) |

Cadastre no painel do Render as variáveis `DATABASE_URL`, `JWT_SECRET`, `TMDB_READ_ACCESS_TOKEN` e `GOOGLE_OAUTH_CLIENT_IDS` (este último é detalhado na seção de Google abaixo). O Render fornece `PORT` automaticamente. O endpoint `GET /` retorna o status da API; teste também login, banco e busca TMDB para validar o serviço completo.

### Login com Google

O app usa o Google apenas para autenticar. O frontend envia o ID token ao backend, que confere assinatura, validade e audiência antes de emitir o JWT MovieHub. Contas Google com e-mail verificado podem ser vinculadas a uma conta MovieHub existente com o mesmo e-mail.

1. No [Google Cloud Console](https://console.cloud.google.com/), crie ou escolha um projeto e configure a tela de consentimento OAuth. Durante os testes, inclua as contas Google usadas como usuários de teste; antes de abrir ao público, revise a publicação e as informações exigidas pelo Google.
2. Crie um OAuth Client ID do tipo **Web application**. Cadastre como origem autorizada a URL web usada no teste (por exemplo `http://localhost:8081`) e, se necessário, a URL web publicada. Não invente redirect URI: use as origens e callbacks exibidos pela configuração Expo/Google para o fluxo escolhido.
3. Crie também um OAuth Client ID **Android**, usando o package `com.flavio721.moviehub` e o SHA-1 do certificado que assina seu app. Para builds EAS, obtenha o certificado/keystore associado ao projeto EAS e cadastre o SHA-1 correspondente. Se trocar o certificado de assinatura, atualize o cliente OAuth.
4. Para lançar no iOS, crie um cliente **iOS** com o bundle identifier `com.flavio721.moviehub`. Ele já está definido em `frontend/app.json`.
5. Copie os IDs públicos para `frontend/.env` (use `frontend/.env.example` como modelo): `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`, `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID` e `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`, conforme as plataformas criadas. Esses IDs são identificadores públicos, não segredos. Para builds EAS, cadastre as mesmas variáveis `EXPO_PUBLIC_*` no ambiente EAS usado pelo perfil de build (o perfil `preview` usa `production`, conforme `eas.json`).
6. No Render, defina `GOOGLE_OAUTH_CLIENT_IDS` como uma lista separada por vírgula com os IDs Web/Android/iOS criados, sem espaços obrigatórios. O backend aceita somente tokens cuja audiência está nessa lista. Não coloque credenciais privadas Google no app.
7. Faça novo deploy do backend após configurar a variável. Reinicie o Expo Web para carregar o `.env`. Para Android/iOS, gere um novo development build ou APK/AAB após mudar OAuth, scheme ou package.

**Teste:** a autenticação web pode ser exercitada no navegador após cadastrar o Web Client ID. O login nativo exige um development build/instalação própria; o Expo Go não é adequado para validar redirects OAuth com scheme personalizado. Para testar Android, use `eas build --platform android --profile preview`, instale o APK e confira se o SHA-1 cadastrado corresponde ao certificado usado na assinatura.

### Amigos, atividade e privacidade

Na aba Perfil, abra **Amigos** e envie uma solicitação pelo e-mail cadastrado no MovieHub. A outra pessoa precisa aceitar antes que qualquer atividade fique disponível. Cada conta pode ocultar, separadamente, filmes assistidos, watchlist, favoritos, notas/comentários e datas/atividade recente. Por padrão, essas opções ficam ligadas; a atividade nunca é pública e a API verifica a amizade aceita antes de retorná-la.

Esta funcionalidade adiciona uma migration ao banco. Antes de publicar o código, aplique a migration no PostgreSQL de produção usando o mesmo `DATABASE_URL` do Render, a partir da pasta `backend`:

```bash
npx prisma migrate deploy
```

Use uma cópia de segurança antes de alterar um banco com dados importantes. Não cole nem comite a URL do banco. Depois da migration, faça deploy do backend e gere uma nova versão do app.

O arquivo `backend/package.json` define os comandos `build` e `start`. O TypeScript compila o ponto de entrada para `dist/src/server.js`.

### Expo Web e endereço da API

No `frontend/.env`, defina `EXPO_PUBLIC_API_BASE_URL` para a URL HTTPS da API publicada, sem `/` final. Para atualizar a variável durante o teste web, reinicie o Expo limpando o cache:

```bash
cd frontend
npx expo start --web -c
```

No EAS, cadastre a mesma variável no ambiente `production`, pois o valor é inserido no app durante o build. Alterar o `.env` depois de gerar um APK não altera o APK existente; gere um novo build.

## Gerar APK Android

O identificador Android está em `frontend/app.json`, na propriedade `expo.android.package`. O valor atual é `com.flavio721.moviehub`. Essa configuração identifica o aplicativo Android; não é uma dependência do npm. Escolha um identificador que você controla e mantenha-o estável depois de publicar o app.

O arquivo `frontend/eas.json` tem dois perfis:

- `preview`: build `.apk` para instalar diretamente em aparelhos Android; usa as variáveis do ambiente EAS `production`.
- `production`: build Android no formato `.aab`, recomendado para envio à Google Play.

Para autenticar e gerar o APK de teste:

```bash
cd frontend
npm install --global eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
```

Na primeira configuração, o EAS associa o projeto à sua conta Expo e pode atualizar configurações. Ao concluir, baixe o APK pelo link fornecido pelo EAS e instale-o no celular. Para a Play Store, gere o perfil `production`; APK não é o formato de envio recomendado.

## Endpoints da API

Todas as rotas abaixo (exceto cadastro e login) exigem o header `Authorization: Bearer <token>`. A API consulta o TMDB pelo backend, assim a credencial de leitura não é incluída no aplicativo publicado.

### Usuários (`/users`)

| Método | Rota | Descrição |
|---|---|---|
| POST | `/users/cadastro` | Cria uma nova conta |
| POST | `/users/login` | Autentica e retorna um token JWT |
| POST | `/users/google` | Valida um ID token Google e retorna token JWT MovieHub |
| GET | `/users/me` | Retorna os dados do usuário autenticado |
| PUT | `/users/me` | Atualiza nome e/ou foto de perfil |
| PATCH | `/users/me/password` | Altera a senha (exige a senha atual) |

### Amigos (`/friends`)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/friends` | Lista amizades aceitas e solicitações recebidas/enviadas |
| POST | `/friends/requests` | Envia solicitação por `{ "email": "..." }` |
| POST | `/friends/requests/:id/accept` | Aceita solicitação recebida |
| DELETE | `/friends/requests/:id` | Recusa/cancela solicitação ou remove amizade |
| GET | `/friends/privacy` | Consulta preferências de visibilidade |
| PATCH | `/friends/privacy` | Atualiza uma ou mais preferências booleanas |
| GET | `/friends/:userId/activity` | Exibe filmes visíveis de um amigo aceito |

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
- Login com Google (OAuth ID token validado pelo backend)
- Solicitações de amizade, atividade compartilhada e controles de privacidade por categoria
- Logout com remoção local do token e confirmação compatível com Android/iOS e Expo Web
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
- **Cinemas Próximos:** a tela consulta cinemas cadastrados no OpenStreetMap pelo backend e envia as coordenadas do dispositivo à instância pública do Overpass. A cobertura depende dos dados mapeados na região; a rota abre no Google Maps. O endpoint armazena resultados em memória por cinco minutos. No Expo Web, localização depende das permissões do navegador e de HTTPS.
- **Hospedagem gratuita:** serviços gratuitos podem dormir após inatividade e demorar para responder à primeira solicitação. Verifique os limites atuais do Render e do Neon antes de usar o app com mais usuários.
- **Fotos de perfil:** o backend grava uploads em `backend/uploads`. O disco padrão do Render é temporário; imagens podem sumir após reinício ou novo deploy. Para retenção permanente, configure um disco persistente ou migre os uploads para armazenamento de objetos (por exemplo, S3/Cloudinary).
- **APK e lojas:** `android.package`, `ios.bundleIdentifier` e perfis EAS estão configurados. O Google Login ainda depende da configuração manual dos clientes OAuth e dos respectivos certificados/origens. Para instalar diretamente no Android, use o perfil `preview` (APK); para Google Play, gere `.aab`.
- **TMDB:** antes de publicar, adicionar o logo oficial aprovado e manter em uma área Sobre/Créditos o aviso “Este produto usa a API do TMDB, mas não é endossado nem certificado pelo TMDB.”. A chave privada deve permanecer no backend. Consulte também os termos atuais do TMDB para a publicação planejada.
- **Migration dos filmes:** a migration nova apaga os registros antigos de filmes e gêneros e conserva as contas. Revise a migration e faça backup do banco antes de aplicá-la em qualquer banco com dados que precisem ser preservados.

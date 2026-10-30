# MovieHub

Aplicativo mobile para gerenciamento pessoal de filmes e livros. O usuário pesquisa títulos no TMDB e livros no Google Books, e mantém suas listas, status de leitura, favoritos e avaliações no MovieHub.

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
- [Plano do CRUD de livros](#plano-do-crud-de-livros)

## Tecnologias

### Frontend (`/frontend`)

| Categoria | Tecnologia |
|---|---|
| Framework | React Native (0.81) + Expo SDK 54 |
| Linguagem | TypeScript |
| Navegação | React Navigation v7 (native-stack + bottom-tabs) |
| Localização | expo-location; cinemas consultados via OpenStreetMap/Overpass |
| Mídia | expo-image-picker e seletor nativo de fotos |
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
| Upload de arquivos | `multer` + Cloudinary (armazenamento permanente de avatares) |

## Estrutura do projeto

```
App_MovieHub/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── prisma.config.ts        # configuração do Prisma 7 (datasource, caminho das migrations)
│   ├── uploads/                # diretório local padrão para imagens (produção usa disco persistente)
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
GOOGLE_BOOKS_API_KEY=chave-privada-do-google-books
CLOUDINARY_CLOUD_NAME=nome-do-cloud
CLOUDINARY_API_KEY=chave-da-api
CLOUDINARY_API_SECRET=segredo-da-api
```

Instale as dependências e aplique as migrations:

```bash
cd backend
npm install
npx prisma migrate dev
npx prisma generate
```

`TMDB_READ_ACCESS_TOKEN` é o API Read Access Token criado nas configurações da conta TMDB. Ele fica somente no backend; não coloque essa credencial em variáveis `EXPO_PUBLIC_*` nem no app mobile. A migration `20261012120000_tmdb_personal_movie_log` remove os filmes e gêneros antigos cadastrados por usuário, preservando as contas e perfis, conforme decisão do projeto.

`GOOGLE_BOOKS_API_KEY` identifica as consultas de catálogo feitas pelo backend. Ela fica em `backend/.env` no desenvolvimento e como variável privada no Render; nunca a cadastre no EAS nem em `frontend/.env`.

Crie uma conta Cloudinary e copie os valores **Cloud name**, **API Key** e **API Secret** do Dashboard para o `.env` do backend e para as variáveis privadas do Render. O API Secret nunca deve ir ao frontend. A migration `20261015143000_cloudinary_avatar_public_id` adiciona o identificador necessário para remover fotos substituídas; `prisma migrate dev` aplica todas as migrations locais.

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

Cadastre no painel do Render as variáveis `DATABASE_URL`, `JWT_SECRET`, `TMDB_READ_ACCESS_TOKEN`, `GOOGLE_BOOKS_API_KEY`, `GOOGLE_OAUTH_CLIENT_IDS`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` e `CLOUDINARY_API_SECRET`. O Render fornece `PORT` automaticamente. O endpoint `GET /` retorna o status da API; teste também login, banco e buscas TMDB/Google Books para validar o serviço completo.

#### Fotos de perfil

As fotos novas são enviadas pelo backend ao Cloudinary e o app salva no perfil a URL HTTPS e o identificador da imagem. Ao trocar ou remover uma foto, o backend atualiza o perfil e depois exclui do Cloudinary o arquivo anterior; fotos externas, como avatares do Google, não são apagadas. Isso evita acumular arquivos substituídos. O limite gratuito do Cloudinary é compartilhado entre armazenamento, tráfego e transformações, portanto visualizações também consomem créditos. Fotos que já desapareceram do disco temporário do Render precisam ser selecionadas e enviadas novamente.

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

Na aba Perfil, abra **Amigos**, pesquise pelo username único (por exemplo, `@cinefilo_123`) e envie uma solicitação. O apelido/nome de exibição pode se repetir; apenas o username precisa ser exclusivo. A outra pessoa precisa aceitar antes que seu perfil social fique disponível. O e-mail é mostrado somente nas configurações da própria conta e não é retornado pelos endpoints de amigos ou perfil social.

O perfil de um amigo aceito exibe somente duas listas: últimos filmes vistos e favoritos. Cada lista respeita os controles de privacidade da conta; notas e datas também são omitidas quando a opção correspondente está desativada. Watchlist e comentários não são exibidos nessa página.

Esta funcionalidade inclui uma migration para adicionar usernames aos usuários existentes e criar a restrição de unicidade. Antes de publicar o código, aplique as migrations no PostgreSQL de produção usando o mesmo `DATABASE_URL` do Render, a partir da pasta `backend`:

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

## Gerar os aplicativos Android e iOS com EAS

Os identificadores já estão configurados em `frontend/app.json`: Android `com.flavio721.moviehub` e iOS `com.flavio721.moviehub`. Mantenha-os estáveis depois de publicar os apps. O projeto já está associado ao EAS pelo `extra.eas.projectId`.

### Perfis

- `preview`: distribuição interna; gera APK instalável no Android e build interno para iOS. Usa as variáveis EAS do ambiente `production`, portanto os testes chamam a API e o banco de produção.
- `production`: build de loja; Android gera `.aab` e iOS gera `.ipa` para envio ao App Store Connect. O EAS incrementa automaticamente o número de build nas novas gerações.

### 1. Preparar a conta e as variáveis

Instale as dependências a partir da pasta `frontend`, entre na conta Expo que contém o projeto `ceb3a960-0c87-4778-b20a-71e4c9fcc985` e configure as variáveis no ambiente EAS `production` em **Project settings → Environment variables**:

- `EXPO_PUBLIC_API_BASE_URL`: URL HTTPS do serviço Render, sem barra final.
- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`
- `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`
- `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`

Os valores `EXPO_PUBLIC_*` são incluídos no app e podem ser lidos por quem o instalar; use aqui apenas a URL pública e os IDs OAuth públicos. Nunca coloque segredo do Google, JWT, TMDB, banco de dados ou Cloudinary no frontend.

```bash
cd frontend
npm ci
npx expo install --check
npx eas-cli@latest login
```

Não é necessário executar `eas build:configure` neste projeto: `eas.json` e o vínculo EAS já existem.

### 2. Gerar builds internos para validar nos aparelhos

Gere as duas plataformas em uma execução:

```bash
npx eas-cli@latest build --platform all --profile preview
```

Também é possível gerar uma plataforma por vez:

```bash
npx eas-cli@latest build --platform android --profile preview
npx eas-cli@latest build --platform ios --profile preview
```

Na primeira build Android, escolha gerar um novo keystore se o EAS perguntar e deixe-o armazenado no EAS. Guarde e reutilize essa chave nas próximas versões: a assinatura precisa permanecer compatível para que aparelhos aceitem atualizações do app. Não baixe a chave para o repositório nem a comite.

Para uma build iOS instalável em iPhone, entre com uma conta do Apple Developer Program e deixe o EAS criar/gerenciar o certificado de distribuição e o perfil de provisionamento. São essas credenciais de assinatura; não são os IDs OAuth. A distribuição interna iOS também precisa autorizar os aparelhos de teste.

Depois da primeira build Android, confira se o SHA-1 do certificado EAS está cadastrado no cliente OAuth Android do Google. Confira também se o backend Render aceita os IDs Web/Android/iOS em `GOOGLE_OAUTH_CLIENT_IDS`. Se alguma configuração OAuth mudar, gere uma nova build.

Baixe as builds no link do resultado EAS, instale e valide login, cadastro, consulta à API e upload. Como o perfil `preview` usa o backend de produção, faça os testes com uma conta de teste e evite excluir/alterar dados reais.

### 3. Gerar e enviar para as lojas

Antes de publicar, crie os registros do app no Google Play Console e App Store Connect e confirme que possui as contas de desenvolvedor necessárias. Gere os artefatos de produção:

```bash
npx eas-cli@latest build --platform all --profile production
```

O Android `.aab` e o iOS `.ipa` são gerados para as respectivas lojas; a build de produção não é para instalação direta no aparelho. Envie cada build separadamente após conferir os metadados e as informações de privacidade na loja:

```bash
npx eas-cli@latest submit --platform android --latest
npx eas-cli@latest submit --platform ios --latest
```

As variáveis públicas ficam incorporadas no binário. Se mudar URL da API ou IDs OAuth, atualize o ambiente EAS e gere novas builds. As etapas de perfil e distribuição seguem o [guia oficial do EAS Build](https://docs.expo.dev/build/eas-json/); o EAS pode provisionar as credenciais de assinatura automaticamente. Consulte também o [guia de credenciais gerenciadas](https://docs.expo.dev/app-signing/managed-credentials/).

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
| GET | `/friends/search?username=...` | Pesquisa uma conta pelo username (retorna apenas dados públicos de contato, sem e-mail) |
| POST | `/friends/requests` | Envia solicitação por `{ "username": "..." }` |
| POST | `/friends/requests/:id/accept` | Aceita solicitação recebida |
| DELETE | `/friends/requests/:id` | Recusa/cancela solicitação ou remove amizade |
| GET | `/friends/privacy` | Consulta preferências de visibilidade |
| PATCH | `/friends/privacy` | Atualiza uma ou mais preferências booleanas |
| GET | `/friends/:userId/profile?language=pt-BR` | Exibe as listas autorizadas de últimos filmes vistos e favoritos de um amigo aceito; aceita `pt-BR`, `en-US` ou `es-ES` |

### Filmes (`/movies`)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/movies/search?query=...&page=1&language=pt-BR` | Pesquisa filmes no catálogo TMDB pelo texto informado; aceita `pt-BR`, `en-US` ou `es-ES` |
| GET | `/movies/popular?language=pt-BR` | Recomenda filmes bem avaliados que o usuário ainda não marcou como assistidos |
| GET | `/movies/catalog/:tmdbId?language=pt-BR` | Busca os detalhes TMDB no idioma escolhido e o registro pessoal, se houver |
| GET | `/movies?language=pt-BR` | Lista os registros pessoais com metadados do catálogo no idioma escolhido |
| GET | `/movies/genres?language=pt-BR` | Conta por gênero somente os filmes registrados pelo usuário autenticado, no idioma escolhido |
| GET | `/movies/stats` | Retorna estatísticas da coleção (total, assistidos, quero assistir, favoritos) |
| GET | `/movies/:tmdbId/library` | Obtém a lista pessoal para um filme |
| PUT | `/movies/:tmdbId/library` | Adiciona ou atualiza status, favorito, nota, comentário e data assistida |
| DELETE | `/movies/:tmdbId/library` | Remove o filme da lista pessoal, sem remover o catálogo |
| PATCH | `/movies/:tmdbId/favorite` | Define se o filme da lista é favorito (`{ "isFavorite": boolean }`) |

### Livros (`/books`)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/books/search?q=...&page=1` | Pesquisa no Google Books; retorna metadados normalizados e informa se já está na biblioteca |
| GET | `/books?page=1&pageSize=20` | Lista os livros pessoais com paginação |
| GET | `/books/stats` | Retorna totais por estado de leitura e favoritos |
| PUT | `/books/:googleBooksId/library` | Adiciona livro do catálogo ou atualiza os campos pessoais enviados |
| PATCH | `/books/:bookId/library` | Atualiza estado, favorito, nota, anotações e datas |
| DELETE | `/books/:bookId/library` | Remove a associação pessoal sem apagar os metadados do catálogo |

Antes do deploy, aplique as migrations aditivas `20261030110000_add_books_catalog` e `20261030130000_share_books_privacy` com `npx prisma migrate deploy` usando o `DATABASE_URL` de produção. A chave do Google Books é usada pelo backend; o app móvel chama apenas as rotas autenticadas do MovieHub.

### Cinemas (`/cinemas`)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/cinemas/nearby?lat=...&lng=...&radius=10000` | Busca cinemas mapeados no OpenStreetMap dentro de um raio de até 25 km; requer autenticação |

### Upload (`/upload`)

| Método | Rota | Descrição |
|---|---|---|
| POST | `/upload` | Recebe uma imagem (`multipart/form-data`, campo `imagem`) e retorna `{ "url": "...", "publicId": "..." }` do Cloudinary |

## Modelo de dados

```
User
├── id, name (apelido), username (único), email (único e privado), password (hash), avatarUrl?, avatarPublicId?
└── movies: UserMovie[]

Movie
├── tmdbId (único), title, posterPath, releaseDate, overview, runtime
├── genres e nota pública do TMDB
└── registros pessoais: UserMovie[]

UserMovie
├── userId + movieId (únicos em conjunto)
├── status (WATCHED | WATCHLIST), isFavorite
└── rating (1 a 5, opcional), comment e watchedAt

Book
├── googleBooksId (único), ISBNs, título, autores, editora e metadados normalizados
└── registros pessoais: UserBook[]

UserBook
├── userId + bookId (únicos em conjunto)
└── estado de leitura, favorito, nota, comentário e datas
```

O catálogo é consultado no TMDB e seus metadados são guardados localmente quando alguém adiciona um filme. Cada conta tem um único registro pessoal por filme TMDB. Marcar como assistido exige a data; esse registro pode ser atualizado, sem criar múltiplas avaliações para reassistidas.

## Funcionalidades

- Cadastro e login com autenticação JWT
- Login com Google (OAuth ID token validado pelo backend)
- Busca de amigos por username único, perfis de amigos com listas recentes/favoritos e controles de privacidade
- Logout com remoção local do token e confirmação compatível com Android/iOS e Expo Web
- Pesquisa de títulos no catálogo do TMDB
- Recomendações de filmes bem avaliados na Home, excluindo títulos já assistidos
- Organização por status (assistido / quero assistir) e favoritos; a tela de gêneros conta apenas registros pessoais por gênero
- Registro de nota de 1 a 5 estrelas, comentário e data em que assistiu
- Busca e filtros (gênero, status, ano, nota mínima, apenas favoritos) e ordenação (título, data, nota, ano)
- Estatísticas da coleção pessoal
- Árvore pessoal que cresce conforme os filmes assistidos, com marcos e flores; o progresso usa a coleção da conta e não adiciona imagens pesadas nem exige uma migration
- Localização de cinemas próximos via mapa (dados de localização reais; lista de cinemas ilustrativa — ver limitações)
- Compartilhamento de filmes via WhatsApp, Telegram, e-mail, SMS ou folha de compartilhamento do sistema
- Edição de perfil (nome, foto, senha)
- Tema claro/escuro e idioma (português, inglês ou espanhol), com preferências salvas no dispositivo
- Menu lateral com atalhos para as abas, busca, estatísticas, cinemas e configurações
- Busca de cinemas próximos via OpenStreetMap, com distância e link para abrir a rota no Maps
- Compartilhamento das estatísticas pessoais pelo menu nativo do celular
- Lembrete na Home para filmes na watchlist e controle das recomendações populares
- Biblioteca de livros com pesquisa Google Books, estados de leitura, favoritos, notas, anotações e remoção

## Limitações conhecidas

- **Idioma:** textos da interface, mensagens da API e metadados TMDB da busca, biblioteca, gêneros, detalhes e perfis de amigos acompanham o idioma selecionado. A biblioteca usa cache temporário no backend para evitar consultas repetidas ao TMDB. Mensagens futuras adicionadas sem tradução cadastrada aparecem no idioma de origem até receberem uma tradução.
- **Cinemas Próximos:** a tela consulta cinemas cadastrados no OpenStreetMap pelo backend e tenta uma instância alternativa do Overpass se a principal falhar. A cobertura depende dos dados mapeados na região; a rota abre no Google Maps. Os resultados ficam em cache por cinco minutos, mas o botão Atualizar ignora o cache. No Expo Web, localização depende da permissão do navegador e de HTTPS ou localhost.
- **Hospedagem gratuita:** serviços gratuitos podem dormir após inatividade e demorar para responder à primeira solicitação. Verifique os limites atuais do Render e do Neon antes de usar o app com mais usuários.
- **Fotos de perfil:** os uploads novos usam Cloudinary. Configure as três variáveis do serviço no backend e aplique a migration que adiciona `avatarPublicId`; avatares que já desapareceram do disco efêmero precisam ser reenviados.
- **APK e lojas:** `android.package`, `ios.bundleIdentifier` e perfis EAS estão configurados. O Google Login ainda depende da configuração manual dos clientes OAuth e dos respectivos certificados/origens. Para instalar diretamente no Android, use o perfil `preview` (APK); para Google Play, gere `.aab`.
- **TMDB:** antes de publicar, adicionar o logo oficial aprovado e manter em uma área Sobre/Créditos o aviso “Este produto usa a API do TMDB, mas não é endossado nem certificado pelo TMDB.”. A chave privada deve permanecer no backend. Consulte também os termos atuais do TMDB para a publicação planejada.
- **Migration dos filmes:** a migration nova apaga os registros antigos de filmes e gêneros e conserva as contas. Revise a migration e faça backup do banco antes de aplicá-la em qualquer banco com dados que precisem ser preservados.

## Plano do CRUD de livros

O planejamento inicial e as etapas estão em [docs/PLANO_CRUD_LIVROS.md](docs/PLANO_CRUD_LIVROS.md). A implementação desta branch usa Google Books e mantém o catálogo de livros separado do TMDB.

## Cache da API

Listas, recomendações, estatísticas e gêneros usam cache com expiração e invalidação após alterações na biblioteca. Escopos, tempos de vida e o plano para compartilhar cache entre instâncias estão em [docs/CACHE_API.md](docs/CACHE_API.md).

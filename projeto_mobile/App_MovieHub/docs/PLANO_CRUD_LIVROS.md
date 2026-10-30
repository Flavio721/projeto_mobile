# Plano para o CRUD de livros

Data da pesquisa das APIs: 27/10/2026.

## Objetivo

Adicionar uma biblioteca pessoal de livros ao MovieHub com busca por título, autor e ISBN; consulta de metadados; adição, edição e remoção da lista do usuário; estados de leitura, nota, comentário, favoritos e datas. A integração externa serve para encontrar e preencher metadados. A biblioteca pessoal e o CRUD pertencem ao MovieHub.

## Opções de catálogo

| Fonte | Pontos fortes | Limitações | Papel recomendado |
|---|---|---|---|
| **Google Books API** | Busca por texto/ISBN, dados de edição, autores, editora, data, páginas, categorias e URLs de capa. A busca pública é `volumes.list` e aceita paginação de até 40 resultados. | Cada requisição precisa identificar a aplicação; uma API key de servidor fica no backend. Metadados, capas e disponibilidade variam por região e edição. | Provedor principal para busca e metadados. Usar a API key privada no backend e monitorar a quota no Google Cloud. |
| **Open Library** | API pública de baixo volume; busca retorna obras e edições com identificadores e capas. Não exige chave para o uso inicial. Boa opção de fallback por ISBN/OLID. | O próprio serviço pede User-Agent identificável para uso frequente; a API não é indicada para varredura em massa. A cobertura de edições varia e a API informa que o schema de busca pode mudar. | Fallback para resultados ausentes, sobretudo busca exata por ISBN/OLID. |
| **Cadastro manual por ISBN** | Funciona quando os provedores não encontram uma edição e não depende de disponibilidade externa. | O usuário precisa preencher e revisar os campos. | Fallback obrigatório para não bloquear o CRUD. |
| **ISBNdb ou outro catálogo comercial** | Pode oferecer cobertura comercial/ISBN ampliada. | Tem custo, chave, limites e termos próprios que precisam ser avaliados antes da escolha. | Considerar apenas se a cobertura das fontes gratuitas for insuficiente. |

Google Books oferece uma API pública de volumes, mas requer identificar a aplicação por chave ou OAuth. Open Library descreve suas APIs como públicas e de baixo volume, pede identificação por User-Agent em uso frequente e limita certas requisições às capas. [Google Books: busca de volumes](https://developers.google.com/books/docs/v1/reference/volumes/list), [Google Books: autenticação e uso](https://developers.google.com/books/docs/v1/using), [Open Library: Search API](https://openlibrary.org/dev/docs/api/search), [Open Library: diretrizes e identificação](https://openlibrary.org/developers/api), [Open Library: Covers API e limites](https://openlibrary.org/dev/docs/api/covers).

### Decisão recomendada

Começar com Google Books para descoberta e metadados, Open Library como fallback e cadastro manual por ISBN/título como garantia de conclusão. Não chamar essas APIs diretamente do app: um serviço `bookCatalogService` no backend normaliza respostas, aplica timeout, limites, cache e tratamento de indisponibilidade, preservando futuras trocas de provedor.

Não persistir a resposta externa inteira. Guardar somente campos normalizados e identificadores de origem necessários para atualizar ou rastrear os metadados. Exibir atribuição quando as condições da fonte pedirem; não baixar em lote nem copiar capas da Open Library para nosso servidor. Preferir a URL de capa da fonte e tratar capa ausente no app.

## Modelo de dados inicial

- `Book`: registro local de uma edição, com título, subtítulo opcional, autores, descrição, ISBN-10/ISBN-13, idioma, editora, data de publicação, número de páginas e URL de capa.
- `BookSource`: origem e identificador externo (`GOOGLE_BOOKS` + volume ID, `OPEN_LIBRARY` + OLID), únicos em conjunto e ligados a um `Book`. Permite duas fontes apontarem para a mesma edição.
- `UserBook`: relação usuário/livro, única por `(userId, bookId)`, com estado `WANT_TO_READ | READING | READ | PAUSED`, favorito, avaliação de 1–5, comentário, `startedAt` e `finishedAt`.
- Índices em `UserBook(userId, status)`, `UserBook(userId, isFavorite)` e ISBN normalizado. ISBN é opcional porque livros antigos e publicações sem ISBN precisam continuar cadastráveis.

Normalizar ISBN removendo espaços e hífens e validando dígito verificador antes de usar como chave de deduplicação. Primeiro deduplicar por ISBN-13/ISBN-10; sem ISBN, usar identificadores do provedor. Não mesclar automaticamente registros apenas por título, pois traduções, volumes e edições diferentes podem ter o mesmo título.

Separar o catálogo do registro pessoal espelha o padrão já usado por `Movie` e `UserMovie`. Não compartilhar tabela Movie: livros e filmes têm fontes, campos e ciclos de vida diferentes.

## API MovieHub proposta

Todas as rotas exigem JWT, exceto saúde da API:

| Método | Rota | Comportamento |
|---|---|---|
| `GET` | `/books/search?q=&page=&language=` | Busca externa normalizada; validar query, limitar página e tamanho, usar cache curto e retornar paginação. |
| `GET` | `/books/catalog/:source/:sourceId` | Detalhes e indicação se já está na biblioteca pessoal. |
| `GET` | `/books/isbn/:isbn` | Busca exata por ISBN com validação local e fallback entre provedores. |
| `GET` | `/books` | Lista pessoal filtrável por estado/favorito; paginação por cursor para não carregar toda a coleção. |
| `GET` | `/books/stats` | Totais por estado, favorito, avaliação e páginas lidas quando disponíveis. |
| `GET` | `/books/:id/library` | Consulta o registro pessoal de um item. |
| `PUT` | `/books/:id/library` | Cria ou substitui os campos pessoais de forma idempotente. |
| `PATCH` | `/books/:id/library` | Atualiza campos parciais de estado, favorito, nota, comentário e datas. |
| `DELETE` | `/books/:id/library` | Remove a associação pessoal; mantém o livro catalogado se outros usuários o usarem. |

Validar tipos e limites no servidor; limitar comentários; confirmar que estados/datas fazem sentido; tratar ISBN e IDs como entrada não confiável. Usuários só podem ler/alterar o próprio `UserBook`, salvo futuros recursos sociais com controles de privacidade explícitos.

## Frontend proposto

1. Criar uma aba **Livros** ao lado de Filmes, mantendo os fluxos separados.
2. Reusar os padrões de tema, idioma, toast, busca paginada, filtros, ordenação, estado vazio e autenticação existentes.
3. Criar componentes interativos reutilizáveis: `BookCard`, `BookSearchResult`, `BookStatusPicker` e `BookEditor`. `BookCard` encaminha toque para detalhe; ações de estado/favorito usam `Pressable` independente para não abrir detalhe acidentalmente.
4. Adicionar `Book` e estados aos tipos de domínio e criar um mapper do DTO de API para o formato visual, semelhante ao `movieMapper`.
5. Usar `FlatList` com paginação/cursor para busca e biblioteca; debounce de busca (300–400 ms), cancelar consulta anterior e não buscar até haver termo mínimo.
6. Enviar apenas as alterações pessoais ao backend. Não manter uma cópia completa do catálogo no estado global do app.

## Entrega por etapas

1. **Prova de cobertura:** testar termos e ISBNs brasileiros/portugueses no Google Books e Open Library; medir resultados sem ISBN, duplicados, capas quebradas e latência. Guardar um conjunto pequeno de exemplos anonimizados para comparação.
2. **Contrato e banco:** definir DTO normalizado, validação, modelos Prisma e migration aditiva. Não apagar nem alterar registros de filmes; fazer backup antes da migration de produção.
3. **Backend:** implementar adaptadores por provedor, busca ISBN, cache com TTL, timeouts, rate limit, telemetria sem guardar query pessoal além do necessário, e endpoints autenticados do catálogo/biblioteca.
4. **Frontend de consulta:** tela de busca, resultados paginados, detalhe e fallback de cadastro manual.
5. **CRUD pessoal:** adicionar, editar estado/nota/datas, favoritar e excluir; atualizar estatísticas da biblioteca.
6. **Lançamento gradual:** testar em ambiente de staging; medir cobertura e erros dos provedores; publicar a migration e backend compatível antes de distribuir o app; lançar a aba por feature flag se a equipe quiser desligá-la sem nova build.

## Critérios de aceite

- Busca funciona por título, autor e ISBN e mantém resposta útil quando uma fonte falha.
- O mesmo ISBN não cria duplicatas por fonte; livros sem ISBN podem ser adicionados manualmente.
- Um usuário não acessa nem altera registros pessoais de outro usuário.
- Lista grande é paginada e o app não dispara busca a cada tecla.
- Apagar um item remove apenas a relação pessoal, sem remover metadados compartilhados.
- URL, chave do Google Books e qualquer credencial de provedor ficam no backend; o bundle contém apenas URLs públicas.

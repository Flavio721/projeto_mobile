# Cache da API

## O que é armazenado

| Conteúdo | Escopo da chave | TTL |
|---|---|---:|
| Busca de filmes TMDB | idioma, página e termo normalizado | 2 min |
| Filmes da biblioteca | usuário e idioma | 30 s |
| Recomendações populares filtradas por vistos | usuário e idioma | 30 s |
| Estatísticas do dashboard | usuário | 60 s |
| Contagens por gênero | usuário e idioma | 60 s |
| Metadados TMDB localizados | filme e idioma | 12 h |

O cache pessoal usa chaves e tags com o ID do usuário. Salvar, favoritar e remover um filme invalida todas as listas, recomendações, estatísticas e contagens de gênero daquele usuário. A invalidação também impede que uma consulta iniciada antes da alteração grave um resultado antigo no cache. Chamadas simultâneas para a mesma chave compartilham a mesma consulta em andamento.

## Limites operacionais

O cache geral mantém no máximo 2.000 entradas e remove resultados expirados ao inserir novos valores. Ele reside na memória de cada processo Node e é perdido quando o serviço reinicia. Se o Render executar mais de uma instância, cada uma terá seu próprio cache; para compartilhar resultados e invalidação entre instâncias, migrar o armazenamento para Redis (ou serviço compatível) mantendo os mesmos TTLs, escopos de chave e invalidação por usuário.

O TTL curto de dados pessoais é uma rede de segurança adicional; a consistência imediata dentro da instância vem da invalidação após mutações. Resultados do catálogo público podem permanecer por dois minutos, pois não contêm dados pessoais.

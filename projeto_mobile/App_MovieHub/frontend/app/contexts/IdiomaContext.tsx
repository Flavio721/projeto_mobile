import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { buscarItem, salvarItem } from '../lib/storage';

export type Idioma = 'pt-BR' | 'en' | 'es';
type Chave = keyof typeof traducoes['pt-BR'];

const traducoes = {
  'pt-BR': {
    settings: 'Configurações', appearance: 'Aparência', dark: 'Escuro', light: 'Claro', accent: 'Cor de destaque',
    notifications: 'Notificações', reminders: 'Lembretes de filmes', releases: 'Novidades e lançamentos', sync: 'Sincronização',
    cloud: 'Sincronizar com a nuvem', refresh: 'Atualizar ao abrir o app', other: 'Outros', language: 'Idioma', portuguese: 'Português',
    english: 'Inglês', spanish: 'Espanhol', clearCache: 'Limpar cache', about: 'Sobre o MovieHub', home: 'Início', movies: 'Filmes',
    favorites: 'Favoritos', profile: 'Perfil', hello: 'Olá', subtitle: 'Desfrute dos seus filmes favoritos.', search: 'Pesquisar filmes...',
    summary: 'Resumo', totalMovies: 'Total de filmes', watched: 'Assistidos', watchlist: 'Quero assistir', recent: 'Filmes Recentes',
    seeAll: 'Ver todos', popular: 'Populares', popularSubtitle: 'Bem avaliados para você descobrir', emptyPopular: 'Não foi possível carregar as recomendações.',
    searchTitle: 'Pesquisar filmes', searchPlaceholder: 'Digite o título de um filme', searchFor: 'Resultados para', noResults: 'Nenhum resultado encontrado',
    details: 'Detalhes do filme', myList: 'Minha lista', watchedStatus: 'Já assisti', genres: 'Gêneros', synopsis: 'Sinopse',
  },
  en: {
    settings: 'Settings', appearance: 'Appearance', dark: 'Dark', light: 'Light', accent: 'Accent color', notifications: 'Notifications',
    reminders: 'Movie reminders', releases: 'News and releases', sync: 'Sync', cloud: 'Sync with cloud', refresh: 'Refresh when opening the app',
    other: 'Other', language: 'Language', portuguese: 'Portuguese', english: 'English', spanish: 'Spanish', clearCache: 'Clear cache',
    about: 'About MovieHub', home: 'Home', movies: 'Movies', favorites: 'Favorites', profile: 'Profile', hello: 'Hello',
    subtitle: 'Enjoy your favorite movies.', search: 'Search movies...', summary: 'Summary', totalMovies: 'Total movies', watched: 'Watched',
    watchlist: 'Watchlist', recent: 'Recent movies', seeAll: 'See all', popular: 'Popular', popularSubtitle: 'Top rated picks for you to discover',
    emptyPopular: 'Could not load recommendations.', searchTitle: 'Search movies', searchPlaceholder: 'Enter a movie title', searchFor: 'Results for',
    noResults: 'No results found', details: 'Movie details', myList: 'My list', watchedStatus: 'Watched', genres: 'Genres', synopsis: 'Overview',
  },
  es: {
    settings: 'Configuración', appearance: 'Apariencia', dark: 'Oscuro', light: 'Claro', accent: 'Color de destaque', notifications: 'Notificaciones',
    reminders: 'Recordatorios de películas', releases: 'Novedades y estrenos', sync: 'Sincronización', cloud: 'Sincronizar con la nube',
    refresh: 'Actualizar al abrir la app', other: 'Otros', language: 'Idioma', portuguese: 'Portugués', english: 'Inglés', spanish: 'Español',
    clearCache: 'Limpiar caché', about: 'Acerca de MovieHub', home: 'Inicio', movies: 'Películas', favorites: 'Favoritos', profile: 'Perfil',
    hello: 'Hola', subtitle: 'Disfruta de tus películas favoritas.', search: 'Buscar películas...', summary: 'Resumen', totalMovies: 'Total de películas',
    watched: 'Vistas', watchlist: 'Quiero ver', recent: 'Películas recientes', seeAll: 'Ver todas', popular: 'Populares',
    popularSubtitle: 'Películas bien valoradas para descubrir', emptyPopular: 'No se pudieron cargar las recomendaciones.',
    searchTitle: 'Buscar películas', searchPlaceholder: 'Escribe el título de una película', searchFor: 'Resultados para',
    noResults: 'No se encontraron resultados', details: 'Detalles de la película', myList: 'Mi lista', watchedStatus: 'Ya la vi', genres: 'Géneros', synopsis: 'Sinopsis',
  },
} as const;

const CHAVE_IDIOMA = 'idioma';
const textos = {
  'Abrir câmera': ['Open camera', 'Abrir cámara'], 'Adicionar foto (opcional)': ['Add photo (optional)', 'Añadir foto (opcional)'],
  'Alterar Senha': ['Change Password', 'Cambiar contraseña'], 'Alterar foto': ['Change photo', 'Cambiar foto'], 'Alterar senha': ['Change password', 'Cambiar contraseña'],
  'Ao marcar como assistido, você poderá registrar a data, uma nota de 1 a 5 estrelas e um comentário.': ['When you mark a movie as watched, you can add the date, a 1–5 star rating, and a comment.', 'Al marcar una película como vista, podrás añadir la fecha, una valoración de 1 a 5 estrellas y un comentario.'],
  'Apenas favoritos': ['Favorites only', 'Solo favoritos'], 'Aplicar filtros': ['Apply filters', 'Aplicar filtros'], 'Aplicar ordenação': ['Apply sorting', 'Aplicar orden'],
  'Assistidos': ['Watched', 'Vistas'], 'Avaliação e comentário': ['Rating and comment', 'Valoración y comentario'], 'Buscas recentes': ['Recent searches', 'Búsquedas recientes'],
  'Cadastrar': ['Sign up', 'Registrarse'], 'Cancelar': ['Cancel', 'Cancelar'], 'Carregando...': ['Loading...', 'Cargando...'], 'Carregar mais resultados': ['Load more results', 'Cargar más resultados'],
  'Catálogo TMDB': ['TMDB catalog', 'Catálogo de TMDB'], 'Cinemas Próximos': ['Nearby cinemas', 'Cines cercanos'], 'Cinemas próximos': ['Nearby cinemas', 'Cines cercanos'],
  'Comentário (opcional)': ['Comment (optional)', 'Comentario (opcional)'], 'Compartilhar Filme': ['Share movie', 'Compartir película'], 'Compartilhar via': ['Share via', 'Compartir por'],
  'Confirmar nova senha': ['Confirm new password', 'Confirmar nueva contraseña'], 'Confirmar senha': ['Confirm password', 'Confirmar contraseña'], 'Criar Conta': ['Create account', 'Crear cuenta'], 'Criar conta': ['Create account', 'Crear cuenta'],
  'Câmera': ['Camera', 'Cámara'], 'Data em que assistiu (obrigatória)': ['Date watched (required)', 'Fecha en que la viste (obligatoria)'], 'Detalhes do filme': ['Movie details', 'Detalles de la película'],
  'E-mail': ['Email', 'Correo electrónico'], 'Editar Perfil': ['Edit profile', 'Editar perfil'], 'Editar perfil': ['Edit profile', 'Editar perfil'], 'Entrar': ['Sign in', 'Iniciar sesión'],
  'Esqueci minha senha': ['Forgot password', 'Olvidé mi contraseña'], 'Estatísticas': ['Statistics', 'Estadísticas'], 'Evolução mensal': ['Monthly progress', 'Progreso mensual'], 'Favoritos': ['Favorites', 'Favoritos'],
  'Fazer login': ['Sign in', 'Iniciar sesión'], 'Faça login para continuar': ['Sign in to continue', 'Inicia sesión para continuar'], 'Filmes': ['Movies', 'Películas'], 'Filtros': ['Filters', 'Filtros'], 'Galeria': ['Gallery', 'Galería'],
  'Gerenciador de Filmes': ['Movie tracker', 'Gestor de películas'], 'Gênero': ['Genre', 'Género'], 'Gêneros': ['Genres', 'Géneros'], 'Já tem uma conta?': ['Already have an account?', '¿Ya tienes una cuenta?'],
  'Limpar': ['Clear', 'Limpiar'], 'Limpar tudo': ['Clear all', 'Borrar todo'], 'Manter conectado': ['Keep me signed in', 'Mantener sesión iniciada'], 'Meu Perfil': ['My profile', 'Mi perfil'],
  'Minha lista': ['My list', 'Mi lista'], 'Minha nota': ['My rating', 'Mi valoración'], 'Nenhum favorito ainda': ['No favorites yet', 'Aún no tienes favoritos'],
  'Nenhum gênero ainda — cadastre um filme primeiro': ['No genres yet — add a movie to your list first', 'Aún no hay géneros: añade una película primero'], 'Nenhum resultado encontrado': ['No results found', 'No se encontraron resultados'],
  'Nenhuma foto encontrada no aparelho.': ['No photos found on this device.', 'No se encontraron fotos en el dispositivo.'], 'Nome completo': ['Full name', 'Nombre completo'], 'Nota média': ['Average rating', 'Valoración media'], 'Nota mínima': ['Minimum rating', 'Valoración mínima'],
  'Nova senha': ['New password', 'Nueva contraseña'], 'Não tem uma conta?': ['Don’t have an account?', '¿No tienes una cuenta?'], 'Ordenar por': ['Sort by', 'Ordenar por'],
  'Pesquisar filmes': ['Search movies', 'Buscar películas'], 'Pesquisando no TMDB...': ['Searching TMDB...', 'Buscando en TMDB...'], 'Por gênero': ['By genre', 'Por género'], 'Preencha os dados abaixo': ['Fill in the details below', 'Completa los datos a continuación'],
  'Preferências': ['Preferences', 'Preferencias'], 'Preparando sua experiência': ['Getting your experience ready', 'Preparando tu experiencia'], 'Quero assistir': ['Watchlist', 'Quiero ver'], 'Recentes': ['Recent', 'Recientes'],
  'Remover da minha lista': ['Remove from my list', 'Quitar de mi lista'], 'Remover foto': ['Remove photo', 'Eliminar foto'], 'Resumo geral': ['Overview', 'Resumen general'], 'Sair da conta': ['Sign out', 'Cerrar sesión'], 'Salvar alterações': ['Save changes', 'Guardar cambios'],
  'Selecione a forma de ordenação': ['Choose how to sort', 'Elige cómo ordenar'], 'Selecione um gênero': ['Select a genre', 'Selecciona un género'], 'Senha': ['Password', 'Contraseña'], 'Senha atual': ['Current password', 'Contraseña actual'],
  'Sincronizar dados': ['Sync data', 'Sincronizar datos'], 'Sinopse': ['Overview', 'Sinopsis'], 'Status': ['Status', 'Estado'], 'Tema': ['Theme', 'Tema'], 'Total de filmes': ['Total movies', 'Total de películas'],
  'Ver todos': ['See all', 'Ver todas'], 'Você ainda não tem filmes favoritos': ['You have no favorite movies yet', 'Aún no tienes películas favoritas'],
  'Ano': ['Year', 'Año'], 'Todos': ['All', 'Todos'], 'Assistido': ['Watched', 'Vista'], 'Todos os gêneros': ['All genres', 'Todos los géneros'], 'Qualquer nota': ['Any rating', 'Cualquier valoración'],
  'Mais recentes': ['Most recent', 'Más recientes'], 'Maior nota': ['Highest rated', 'Mejor valoradas'], 'Título (A-Z)': ['Title (A–Z)', 'Título (A–Z)'], 'Ano de lançamento': ['Release year', 'Año de estreno'],
  'Autorize o acesso às fotos do aparelho pra escolher uma capa daqui.': ['Allow photo access to choose a poster from your device.', 'Permite el acceso a tus fotos para elegir una portada del dispositivo.'],
  'Lista de exemplo — conectar a uma API de lugares no backend pra dados reais.': ['Sample list — connect a places API on the backend for real data.', 'Lista de ejemplo: conecta una API de lugares en el backend para obtener datos reales.'],
  'Mapa disponível apenas no app instalado (Android/iOS) — não funciona no navegador.': ['The map is available in the installed app (Android/iOS), not in the browser.', 'El mapa está disponible en la app instalada (Android/iOS), no en el navegador.'],
  'O e-mail é usado pra entrar na conta e não pode ser alterado por aqui.': ['Your email is used to sign in and cannot be changed here.', 'Tu correo se usa para iniciar sesión y no se puede cambiar aquí.'],
  'Pedimos sua senha atual para confirmar que é você mesmo alterando a conta.': ['Enter your current password to confirm it is you changing the account.', 'Pedimos tu contraseña actual para confirmar que eres tú quien modifica la cuenta.'],
  'Pesquise pelo título para encontrar filmes e adicioná-los à sua lista.': ['Search by title to find movies and add them to your list.', 'Busca por título para encontrar películas y añadirlas a tu lista.'],
  'Tire uma foto na hora pra usar como capa do filme.': ['Take a photo now to use as the movie poster.', 'Toma una foto ahora para usarla como póster de la película.'],
  'Todos os dados da sua coleção de filmes': ['All your movie collection data', 'Todos los datos de tu colección de películas'],
  'Toque para alterar a foto': ['Tap to change the photo', 'Toca para cambiar la foto'],
  'Ano não informado': ['Year unavailable', 'Año no disponible'],
  'Digite sua senha atual': ['Enter your current password', 'Escribe tu contraseña actual'], 'Mínimo 6 caracteres': ['At least 6 characters', 'Mínimo 6 caracteres'],
  'Digite novamente a nova senha': ['Enter your new password again', 'Vuelve a escribir la nueva contraseña'], 'Digite seu nome': ['Enter your name', 'Escribe tu nombre'],
  'Digite novamente sua senha': ['Enter your password again', 'Vuelve a escribir tu contraseña'], 'Digite sua senha': ['Enter your password', 'Escribe tu contraseña'],
  'Ex.: 1990': ['e.g. 1990', 'Ej.: 1990'], 'Ex.: 2024': ['e.g. 2024', 'Ej.: 2024'],
  'AAAA-MM-DD': ['YYYY-MM-DD', 'AAAA-MM-DD'], 'Escreva suas impressões sobre o filme': ['Write your thoughts about this movie', 'Escribe tus impresiones sobre la película'],
  'Pesquisar filmes...': ['Search movies...', 'Buscar películas...'], 'Digite o título de um filme': ['Enter a movie title', 'Escribe el título de una película'],
  'Preencha todos os campos.': ['Fill in all fields.', 'Completa todos los campos.'], 'As senhas não coincidem.': ['The passwords do not match.', 'Las contraseñas no coinciden.'],
  'Conta criada com sucesso!': ['Account created successfully!', '¡Cuenta creada correctamente!'], 'Falha de conexão com o servidor.': ['Could not connect to the server.', 'No se pudo conectar con el servidor.'],
  'Senha alterada com sucesso!': ['Password changed successfully!', '¡Contraseña cambiada correctamente!'], 'A nova senha precisa ter ao menos 6 caracteres.': ['The new password must be at least 6 characters.', 'La nueva contraseña debe tener al menos 6 caracteres.'],
  'A confirmação não bate com a nova senha.': ['The confirmation does not match the new password.', 'La confirmación no coincide con la nueva contraseña.'], 'A nova senha precisa ser diferente da atual.': ['The new password must differ from the current one.', 'La nueva contraseña debe ser distinta de la actual.'],
  'Sessão expirada. Faça login novamente.': ['Your session expired. Please sign in again.', 'Tu sesión ha caducado. Inicia sesión de nuevo.'], 'Login efetuado com sucesso!': ['Signed in successfully!', '¡Has iniciado sesión correctamente!'],
  'Não foi possível entrar.': ['Unable to sign in.', 'No se pudo iniciar sesión.'], 'Erro ao fazer login': ['Sign-in error', 'Error al iniciar sesión'],
  'Não foi possível carregar o filme.': ['Unable to load the movie.', 'No se pudo cargar la película.'], 'Informe a data em que assistiu no formato AAAA-MM-DD.': ['Enter the date watched in YYYY-MM-DD format.', 'Indica la fecha en que la viste con formato AAAA-MM-DD.'],
  'Registro salvo. Você pode alterar sua avaliação quando quiser.': ['Entry saved. You can change your rating any time.', 'Registro guardado. Puedes cambiar tu valoración cuando quieras.'],
  'Filme removido da sua lista.': ['Movie removed from your list.', 'Película eliminada de tu lista.'], 'Remover filme': ['Remove movie', 'Eliminar película'],
  'Não foi possível acessar suas fotos.': ['Unable to access your photos.', 'No se pudo acceder a tus fotos.'], 'Autorize o acesso à câmera para tirar uma foto.': ['Allow camera access to take a photo.', 'Permite el acceso a la cámara para tomar una foto.'],
  'Perfil atualizado com sucesso!': ['Profile updated successfully!', '¡Perfil actualizado correctamente!'], 'Não foi possível carregar seu perfil.': ['Unable to load your profile.', 'No se pudo cargar tu perfil.'],
  'Permita o acesso à localização pra ver cinemas perto de você.': ['Allow location access to find nearby cinemas.', 'Permite el acceso a la ubicación para encontrar cines cercanos.'],
  'Copiado para a área de transferência!': ['Copied to clipboard!', '¡Copiado al portapapeles!'], 'Não foi possível abrir esse aplicativo. Ele está instalado?': ['Could not open this app. Is it installed?', 'No se pudo abrir esta aplicación. ¿Está instalada?'],
  'Remover': ['Remove', 'Eliminar'], 'da sua lista?': ['from your list?', 'de tu lista?'],
  'Isso vai liberar 12,4 MB de espaço.': ['This will free up 12.4 MB of space.', 'Esto liberará 12,4 MB de espacio.'],
  'Limpar cache': ['Clear cache', 'Limpiar caché'], 'Sobre o MovieHub': ['About MovieHub', 'Acerca de MovieHub'],
  'MovieHub — gerenciador pessoal de filmes.\nVersão 1.0.0 (projeto de estudo).\n\nEste aplicativo usa TMDB e as APIs do TMDB, mas não é endossado, certificado ou aprovado pelo TMDB.\n\nDados e imagens de filmes fornecidos pelo TMDB (The Movie Database).\nthemoviedb.org': ['MovieHub — your personal movie tracker.\nVersion 1.0.0 (student project).\n\nThis product uses the TMDB API but is not endorsed or certified by TMDB.\n\nMovie data and images provided by TMDB (The Movie Database).\nthemoviedb.org', 'MovieHub — tu gestor personal de películas.\nVersión 1.0.0 (proyecto escolar).\n\nEste producto utiliza la API de TMDB, pero TMDB no lo respalda ni certifica.\n\nDatos e imágenes proporcionados por TMDB (The Movie Database).\nthemoviedb.org'],
  'Ação': ['Action', 'Acción'], 'Aventura': ['Adventure', 'Aventura'], 'Comédia': ['Comedy', 'Comedia'], 'Drama': ['Drama', 'Drama'],
  'Ficção Científica': ['Science fiction', 'Ciencia ficción'], 'Terror': ['Horror', 'Terror'], 'Suspense': ['Thriller', 'Suspense'],
  'Romance': ['Romance', 'Romance'], 'Animação': ['Animation', 'Animación'], 'Documentário': ['Documentary', 'Documental'], 'Fantasia': ['Fantasy', 'Fantasía'], 'Crime': ['Crime', 'Crimen'],
  '12,4 MB': ['12.4 MB', '12,4 MB'], 'Ano indisponível': ['Year unavailable', 'Año no disponible'], 'Sem nota': ['Not rated', 'Sin valoración'],
  'Remover dos favoritos': ['Remove from favorites', 'Quitar de favoritos'], 'Adicionar aos favoritos': ['Add to favorites', 'Añadir a favoritos'],
  'Registrar como assistido': ['Mark as watched', 'Marcar como vista'], 'Adicionar à watchlist': ['Add to watchlist', 'Añadir a la lista'],
  'Nenhum filme encontrado para essa busca': ['No movies found for this search', 'No se encontraron películas para esta búsqueda'],
  'Nenhum filme registrado ainda': ['No movies added yet', 'Aún no has añadido películas'], 'filme favorito': ['favorite movie', 'película favorita'],
  'filmes favoritos': ['favorite movies', 'películas favoritas'], 'filme': ['movie', 'película'], 'filmes': ['movies', 'películas'],
  'Não foi possível cadastrar.': ['Unable to sign up.', 'No se pudo crear la cuenta.'], 'Não foi possível alterar a senha.': ['Unable to change the password.', 'No se pudo cambiar la contraseña.'],
  'Não foi possível salvar as alterações.': ['Unable to save changes.', 'No se pudieron guardar los cambios.'], 'Falha ao enviar a foto.': ['Failed to upload the photo.', 'No se pudo subir la foto.'],
  'Autorize o acesso à galeria para escolher uma foto.': ['Allow gallery access to choose a photo.', 'Permite el acceso a la galería para elegir una foto.'],
  'O nome precisa ter ao menos 2 caracteres.': ['The name must contain at least 2 characters.', 'El nombre debe tener al menos 2 caracteres.'],
  'Foto selecionada, mas ainda não é salva na conta — falta endpoint no backend.': ['Photo selected, but it is not saved to your account yet; the backend endpoint is missing.', 'Foto seleccionada, pero aún no se guarda en tu cuenta; falta el endpoint del backend.'],
  'Compartilhar ainda não foi implementado.': ['Sharing has not been implemented yet.', 'La función para compartir aún no está implementada.'],
  'Cache limpo com sucesso!': ['Cache cleared successfully!', '¡Caché borrada correctamente!'],
} as const;
interface IdiomaContextValue { idioma: Idioma; definirIdioma: (idioma: Idioma) => void; t: (chave: Chave) => string; traduzir: (texto: string) => string; idiomaTmdb: string; }
const IdiomaContext = createContext<IdiomaContextValue | undefined>(undefined);

export function IdiomaProvider({ children }: { children: React.ReactNode }) {
  const [idioma, setIdioma] = useState<Idioma>('pt-BR');
  useEffect(() => {
    buscarItem(CHAVE_IDIOMA).then((salvo) => {
      if (salvo === 'pt-BR' || salvo === 'en' || salvo === 'es') setIdioma(salvo);
    });
  }, []);
  const definirIdioma = (novo: Idioma) => { setIdioma(novo); void salvarItem(CHAVE_IDIOMA, novo); };
  const value = useMemo(() => ({
    idioma, definirIdioma, t: (chave: Chave) => traducoes[idioma][chave],
    traduzir: (texto: string) => {
      if (idioma === 'pt-BR') return texto;
      const normalizado = texto.trim();
      const espacosInicio = texto.match(/^\s*/)?.[0] ?? '';
      const espacosFim = texto.match(/\s*$/)?.[0] ?? '';
      const idiomaIndex = idioma === 'en' ? 0 : 1;
      const textoFixo = (textos as Record<string, readonly [string, string]>)[normalizado]?.[idiomaIndex];
      if (textoFixo) return `${espacosInicio}${textoFixo}${espacosFim}`;
      const chave = (Object.keys(traducoes['pt-BR']) as Chave[]).find((item) => traducoes['pt-BR'][item] === normalizado);
      return chave ? `${espacosInicio}${traducoes[idioma][chave]}${espacosFim}` : texto;
    },
    idiomaTmdb: idioma === 'pt-BR' ? 'pt-BR' : idioma === 'en' ? 'en-US' : 'es-ES',
  }), [idioma]);
  return <IdiomaContext.Provider value={value}>{children}</IdiomaContext.Provider>;
}

export function useIdioma() {
  const context = useContext(IdiomaContext);
  if (!context) throw new Error('useIdioma precisa ser usado dentro de <IdiomaProvider>');
  return context;
}

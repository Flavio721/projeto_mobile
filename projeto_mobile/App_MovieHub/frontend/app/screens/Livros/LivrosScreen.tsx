import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useStyles, useTema } from '../../contexts/TemaContext';
import { useIdioma } from '../../contexts/IdiomaContext';
import { useToast } from '../../contexts/ToastContext';
import { buscarItem } from '../../lib/storage';
import type { Paleta } from '../../theme/paletas';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, '');
const PAGE_SIZE = 20;

type ReadingStatus = 'WANT_TO_READ' | 'READING' | 'READ' | 'PAUSED';
type BookSummary = {
  googleBooksId: string;
  title: string;
  subtitle: string | null;
  authors: string[];
  description: string;
  publisher: string | null;
  publishedDate: string | null;
  isbn10: string | null;
  isbn13: string | null;
  pageCount: number | null;
  coverUrl: string | null;
  language: string | null;
  categories: string[];
};
type LibraryBook = BookSummary & {
  id: number;
  libraryId: number;
  status: ReadingStatus;
  isFavorite: boolean;
  rating: number | null;
  comment: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  updatedAt: string;
};
type SearchBook = BookSummary & { inLibrary: boolean };
type BookStats = { total: number; wantToRead: number; reading: number; read: number; paused: number; favorites: number };

const EMPTY_STATS: BookStats = { total: 0, wantToRead: 0, reading: 0, read: 0, paused: 0, favorites: 0 };
const STATUS_TRANSLATIONS: Record<ReadingStatus, 'bookReadingWant' | 'bookReadingNow' | 'bookReadingRead' | 'bookReadingPaused'> = {
  WANT_TO_READ: 'bookReadingWant', READING: 'bookReadingNow', READ: 'bookReadingRead', PAUSED: 'bookReadingPaused',
};
const STATUSES = Object.keys(STATUS_TRANSLATIONS) as ReadingStatus[];

async function apiRequest<T>(path: string, token: string, init: RequestInit = {}): Promise<T> {
  if (!API_BASE_URL) throw new Error('API do MovieHub não configurada.');
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
  });
  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error ?? 'Não foi possível concluir a solicitação.');
  return data as T;
}

function criarStyles(cores: Paleta) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: cores.background },
    container: { flex: 1, paddingHorizontal: 18 },
    header: { minHeight: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    title: { color: cores.text, fontSize: 26, fontWeight: '800' },
    count: { color: cores.muted, fontSize: 13, marginTop: 2 },
    refreshButton: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: cores.card },
    searchBox: { minHeight: 48, borderRadius: 14, paddingHorizontal: 14, backgroundColor: cores.card, flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 16 },
    searchInput: { flex: 1, color: cores.text, paddingVertical: 12, paddingHorizontal: 10, fontSize: 15 },
    sectionTitle: { color: cores.text, fontSize: 16, fontWeight: '700', marginBottom: 10 },
    listContent: { paddingBottom: 24, gap: 12 },
    card: { flexDirection: 'row', padding: 12, borderRadius: 16, backgroundColor: cores.card, gap: 12 },
    coverFrame: { width: 64, height: 92, borderRadius: 8, overflow: 'hidden', backgroundColor: cores.background, alignItems: 'center', justifyContent: 'center' },
    cover: { width: '100%', height: '100%' },
    bookContent: { flex: 1, minWidth: 0 },
    bookTitle: { color: cores.text, fontSize: 15, fontWeight: '700' },
    secondaryText: { color: cores.muted, fontSize: 12, marginTop: 4 },
    bookAction: { minHeight: 38, minWidth: 40, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: cores.background },
    addAction: { flexDirection: 'row', gap: 6, backgroundColor: cores.gold, alignSelf: 'flex-start', marginTop: 10 },
    addText: { color: cores.onGold, fontSize: 12, fontWeight: '700' },
    alreadyAdded: { flexDirection: 'row', gap: 5, alignItems: 'center', alignSelf: 'flex-start', marginTop: 12 },
    alreadyAddedText: { color: cores.gold, fontSize: 12, fontWeight: '700' },
    personalRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' },
    statusButton: { minHeight: 40, maxWidth: 190, paddingHorizontal: 11, flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 12, borderWidth: 1, borderColor: cores.border, backgroundColor: cores.background },
    statusButtonText: { color: cores.text, fontSize: 13, flexShrink: 1 },
    statusOverlay: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: cores.overlay },
    statusModal: { borderWidth: 1, borderColor: cores.border, borderRadius: 20, padding: 16, backgroundColor: cores.surface },
    statusOption: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, borderRadius: 12, marginTop: 6, backgroundColor: cores.card },
    statusOptionText: { color: cores.text, fontSize: 14 },
    iconAction: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: cores.background },
    empty: { minHeight: 180, alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 28 },
    emptyText: { color: cores.muted, fontSize: 14, textAlign: 'center', lineHeight: 21 },
    loading: { paddingVertical: 20 },
    loadMore: { alignSelf: 'center', paddingVertical: 14, paddingHorizontal: 20 },
    loadMoreText: { color: cores.gold, fontWeight: '700' },
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.64)', justifyContent: 'center', padding: 22 },
    modalCard: { borderRadius: 20, padding: 20, backgroundColor: cores.card },
    modalTitle: { color: cores.text, fontSize: 20, fontWeight: '800', marginBottom: 16 },
    fieldLabel: { color: cores.text, fontSize: 14, fontWeight: '700', marginBottom: 8, marginTop: 8 },
    ratingRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
    noteInput: { minHeight: 110, maxHeight: 180, color: cores.text, backgroundColor: cores.background, borderRadius: 12, padding: 12, textAlignVertical: 'top' },
    modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 18 },
    modalButton: { minHeight: 42, paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center', borderRadius: 12, backgroundColor: cores.background },
    modalButtonText: { color: cores.text, fontWeight: '700' },
    saveButton: { backgroundColor: cores.gold },
    saveButtonText: { color: cores.onGold, fontWeight: '800' },
  });
}

export default function LivrosScreen() {
  const styles = useStyles(criarStyles);
  const { cores } = useTema();
  const { t } = useIdioma();
  const { showError, showSuccess } = useToast();
  const [library, setLibrary] = useState<LibraryBook[]>([]);
  const [stats, setStats] = useState<BookStats>(EMPTY_STATS);
  const [searchResults, setSearchResults] = useState<SearchBook[]>([]);
  const [query, setQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [libraryLoading, setLibraryLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTotalPages, setSearchTotalPages] = useState(1);
  const [searchPage, setSearchPage] = useState(1);
  const [writingKey, setWritingKey] = useState<string | null>(null);
  const [editing, setEditing] = useState<LibraryBook | null>(null);
  const [statusBook, setStatusBook] = useState<LibraryBook | null>(null);
  const [draftRating, setDraftRating] = useState(0);
  const [draftComment, setDraftComment] = useState('');

  const loadLibrary = useCallback(async (requestedPage = 1, append = false) => {
    if (append) setLoadingMore(true);
    else setLibraryLoading(true);
    try {
      const token = await buscarItem('token');
      if (!token) { setLibrary([]); setStats(EMPTY_STATS); return; }
      const [collection, dashboard] = await Promise.all([
        apiRequest<{ results: LibraryBook[]; totalPages: number }>(`/books?page=${requestedPage}&pageSize=${PAGE_SIZE}`, token),
        apiRequest<BookStats>('/books/stats', token),
      ]);
      setLibrary((previous) => append ? [...previous, ...collection.results] : collection.results);
      setStats(dashboard);
      setPage(requestedPage);
      setTotalPages(collection.totalPages);
    } catch (error) {
      showError(error instanceof Error ? error.message : t('bookLoadError'));
    } finally {
      setLibraryLoading(false);
      setLoadingMore(false);
    }
  }, [showError, t]);

  useFocusEffect(useCallback(() => { void loadLibrary(1); }, [loadLibrary]));

  useEffect(() => {
    const normalized = query.trim();
    if (normalized.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      setSearchPage(1);
      setSearchTotalPages(1);
      return;
    }
    setSearchResults([]);
    setSearchLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const token = await buscarItem('token');
        if (!token) throw new Error('Sua sessão expirou. Entre novamente.');
        const result = await apiRequest<{ results: SearchBook[]; totalPages: number }>(
          `/books/search?q=${encodeURIComponent(normalized)}&page=1`, token, { signal: controller.signal },
        );
        if (!controller.signal.aborted) {
          setSearchResults(result.results);
          setSearchPage(1);
          setSearchTotalPages(result.totalPages);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setSearchResults([]);
          showError(error instanceof Error ? error.message : t('bookSearchError'));
        }
      } finally {
        if (!controller.signal.aborted) setSearchLoading(false);
      }
    }, 350);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query, showError, t]);

  const searchMore = useCallback(async () => {
    if (searchLoading || searchPage >= searchTotalPages) return;
    const token = await buscarItem('token');
    if (!token) return showError('Sua sessão expirou. Entre novamente.');
    const nextPage = searchPage + 1;
    setSearchLoading(true);
    try {
      const result = await apiRequest<{ results: SearchBook[]; totalPages: number }>(
        `/books/search?q=${encodeURIComponent(query.trim())}&page=${nextPage}`, token,
      );
      setSearchResults((previous) => [...previous, ...result.results]);
      setSearchPage(nextPage);
      setSearchTotalPages(result.totalPages);
    } catch (error) {
      showError(error instanceof Error ? error.message : t('bookSearchError'));
    } finally {
      setSearchLoading(false);
    }
  }, [query, searchLoading, searchPage, searchTotalPages, showError, t]);

  const addBook = useCallback(async (book: SearchBook) => {
    if (book.inLibrary) return;
    setWritingKey(`add:${book.googleBooksId}`);
    try {
      const token = await buscarItem('token');
      if (!token) throw new Error('Sua sessão expirou. Entre novamente.');
      const added = await apiRequest<LibraryBook>(`/books/${encodeURIComponent(book.googleBooksId)}/library`, token, {
        method: 'PUT', body: JSON.stringify({}),
      });
      setLibrary((previous) => [added, ...previous.filter((entry) => entry.id !== added.id)]);
      void loadLibrary(1);
      setSearchResults((previous) => previous.map((entry) => entry.googleBooksId === book.googleBooksId ? { ...entry, inLibrary: true } : entry));
      showSuccess(t('bookAddSuccess'));
    } catch (error) {
      showError(error instanceof Error ? error.message : t('bookWriteError'));
    } finally {
      setWritingKey(null);
    }
  }, [loadLibrary, showError, showSuccess, t]);

  const updatePersonal = useCallback(async (book: LibraryBook, changes: Partial<Pick<LibraryBook, 'status' | 'isFavorite' | 'rating' | 'comment'>>) => {
    const key = `book:${book.id}`;
    setWritingKey(key);
    try {
      const token = await buscarItem('token');
      if (!token) throw new Error('Sua sessão expirou. Entre novamente.');
      const updated = await apiRequest<LibraryBook>(`/books/${book.id}/library`, token, {
        method: 'PATCH', body: JSON.stringify(changes),
      });
      setLibrary((previous) => previous.map((entry) => entry.id === updated.id ? updated : entry));
      return updated;
    } catch (error) {
      showError(error instanceof Error ? error.message : t('bookWriteError'));
      void loadLibrary(1);
      return null;
    } finally {
      setWritingKey(null);
    }
  }, [loadLibrary, showError, t]);

  const openEditor = useCallback((book: LibraryBook) => {
    setEditing(book);
    setDraftRating(book.rating ?? 0);
    setDraftComment(book.comment ?? '');
  }, []);

  const saveEditor = useCallback(async () => {
    if (!editing) return;
    const updated = await updatePersonal(editing, { rating: draftRating || null, comment: draftComment.trim() || null });
    if (updated) {
      setEditing(null);
      showSuccess(t('bookSaveSuccess'));
    }
  }, [draftComment, draftRating, editing, showSuccess, t, updatePersonal]);

  const confirmRemove = useCallback(async (book: LibraryBook) => {
    setWritingKey(`remove:${book.id}`);
    try {
      const token = await buscarItem('token');
      if (!token) throw new Error('Sua sessão expirou. Entre novamente.');
      await apiRequest<null>(`/books/${book.id}/library`, token, { method: 'DELETE' });
      setLibrary((previous) => previous.filter((entry) => entry.id !== book.id));
      setSearchResults((previous) => previous.map((entry) => entry.googleBooksId === book.googleBooksId ? { ...entry, inLibrary: false } : entry));
      void loadLibrary(1);
      showSuccess(t('bookDeleteSuccess'));
    } catch (error) {
      showError(error instanceof Error ? error.message : t('bookWriteError'));
    } finally {
      setWritingKey(null);
    }
  }, [loadLibrary, showError, showSuccess, t]);

  const askRemove = useCallback((book: LibraryBook) => {
    Alert.alert(t('removeBook'), t('removeBookConfirm'), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('removeBook'), style: 'destructive', onPress: () => { void confirmRemove(book); } },
    ]);
  }, [confirmRemove, t]);

  const statusLabel = useMemo(() => (status: ReadingStatus) => t(STATUS_TRANSLATIONS[status]), [t]);
  const searching = query.trim().length >= 2;

  const renderCover = (url: string | null, title: string) => (
    <View style={styles.coverFrame}>
      {url ? <Image source={{ uri: url }} style={styles.cover} resizeMode="cover" accessibilityLabel={title} />
        : <Ionicons name="book-outline" size={26} color={cores.muted} />}
    </View>
  );

  const renderSearchBook = ({ item }: { item: SearchBook }) => (
    <View style={styles.card}>
      {renderCover(item.coverUrl, item.title)}
      <View style={styles.bookContent}>
        <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.secondaryText} numberOfLines={1}>{item.authors.join(', ') || t('bookAuthorUnknown')}</Text>
        {item.publishedDate ? <Text style={styles.secondaryText}>{item.publishedDate.slice(0, 4)}</Text> : null}
        {item.inLibrary ? (
          <View style={styles.alreadyAdded}>
            <Ionicons name="checkmark-circle" size={16} color={cores.gold} />
            <Text style={styles.alreadyAddedText}>{t('bookAdded')}</Text>
          </View>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${t('addBook')}: ${item.title}`}
            style={[styles.bookAction, styles.addAction, writingKey === `add:${item.googleBooksId}` && { opacity: 0.55 }]}
            disabled={writingKey !== null}
            onPress={() => void addBook(item)}
          >
            {writingKey === `add:${item.googleBooksId}` ? <ActivityIndicator size="small" color={cores.onGold} /> : <Ionicons name="add" size={17} color={cores.onGold} />}
            <Text style={styles.addText}>{t('addBook')}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );

  const renderLibraryBook = ({ item }: { item: LibraryBook }) => (
    <View style={styles.card}>
      {renderCover(item.coverUrl, item.title)}
      <View style={styles.bookContent}>
        <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.secondaryText} numberOfLines={1}>{item.authors.join(', ') || t('bookAuthorUnknown')}</Text>
        <View style={styles.personalRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${t('books')}: ${statusLabel(item.status)}`}
            accessibilityState={{ disabled: writingKey === `book:${item.id}` }}
            style={[styles.statusButton, writingKey === `book:${item.id}` && { opacity: 0.55 }]}
            disabled={writingKey === `book:${item.id}`}
            onPress={() => setStatusBook(item)}
          >
            <Text style={styles.statusButtonText} numberOfLines={1}>{statusLabel(item.status)}</Text>
            <Ionicons name="chevron-down" size={16} color={cores.muted} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${t('bookFavorite')}: ${item.title}`}
            accessibilityState={{ selected: item.isFavorite }}
            style={styles.iconAction}
            onPress={() => void updatePersonal(item, { isFavorite: !item.isFavorite })}
            disabled={writingKey === `book:${item.id}`}
          >
            <Ionicons name={item.isFavorite ? 'heart' : 'heart-outline'} size={19} color={item.isFavorite ? cores.danger : cores.text} />
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={`${t('editBook')}: ${item.title}`} style={styles.iconAction} onPress={() => openEditor(item)}>
            <Ionicons name="create-outline" size={19} color={cores.text} />
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={`${t('removeBook')}: ${item.title}`} style={styles.iconAction} onPress={() => askRemove(item)}>
            <Ionicons name="trash-outline" size={19} color={cores.danger} />
          </Pressable>
        </View>
      </View>
    </View>
  );

  const loadMoreLibrary = () => {
    if (!searching && !loadingMore && page < totalPages) void loadLibrary(page + 1, true);
    else if (searching && !searchLoading && searchPage < searchTotalPages) void searchMore();
  };

  const listFooter = (isSearching: boolean) => {
    const hasMore = isSearching ? searchPage < searchTotalPages : page < totalPages;
    if (isSearching && searchLoading) return <ActivityIndicator style={styles.loading} color={cores.gold} />;
    if (!isSearching && loadingMore) return <ActivityIndicator style={styles.loading} color={cores.gold} />;
    return hasMore ? <Pressable onPress={loadMoreLibrary} style={styles.loadMore}><Text style={styles.loadMoreText}>{t('loadMore')}</Text></Pressable> : null;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{t('books')}</Text>
            <Text style={styles.count}>{stats.total} {t('booksTotal')}</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel={t('loadMore')} style={styles.refreshButton} onPress={() => void loadLibrary(1)}>
            <Ionicons name="refresh-outline" size={21} color={cores.text} />
          </Pressable>
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={19} color={cores.muted} />
          <TextInput
            accessibilityLabel={t('searchBooks')}
            style={styles.searchInput}
            placeholder={t('bookSearchPlaceholder')}
            placeholderTextColor={cores.muted}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            returnKeyType="search"
          />
          {query.length > 0 ? <Pressable accessibilityRole="button" accessibilityLabel={t('cancel')} onPress={() => setQuery('')}><Ionicons name="close-circle" size={20} color={cores.muted} /></Pressable> : null}
        </View>

        <Text style={styles.sectionTitle}>{searching ? t('searchBooks') : t('myBooks')}</Text>
        {searching ? (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.googleBooksId}
            renderItem={renderSearchBook}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            onEndReached={loadMoreLibrary}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={searchLoading ? <ActivityIndicator style={styles.loading} color={cores.gold} /> : <View style={styles.empty}><Text style={styles.emptyText}>{t('noBookResults')}</Text></View>}
            ListFooterComponent={listFooter(true)}
          />
        ) : query.trim().length === 1 ? (
          <View style={styles.empty}><Text style={styles.emptyText}>{t('bookSearchHint')}</Text></View>
        ) : libraryLoading ? (
          <ActivityIndicator style={styles.loading} color={cores.gold} />
        ) : (
          <FlatList
            data={library}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderLibraryBook}
            contentContainerStyle={styles.listContent}
            onEndReached={loadMoreLibrary}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={<View style={styles.empty}><Ionicons name="book-outline" size={38} color={cores.muted} /><Text style={styles.emptyText}>{t('noBooksYet')}</Text></View>}
            ListFooterComponent={listFooter(false)}
          />
        )}
      </View>

      <Modal visible={editing !== null} transparent animationType="fade" onRequestClose={() => setEditing(null)}>
        <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle} numberOfLines={2}>{editing?.title ?? t('editBook')}</Text>
            <Text style={styles.fieldLabel}>{t('bookRating')}</Text>
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <Pressable key={rating} accessibilityRole="button" accessibilityLabel={`${rating} / 5`} accessibilityState={{ selected: draftRating === rating }} onPress={() => setDraftRating(draftRating === rating ? 0 : rating)}>
                  <Ionicons name={draftRating >= rating ? 'star' : 'star-outline'} size={28} color={cores.gold} />
                </Pressable>
              ))}
            </View>
            <Text style={styles.fieldLabel}>{t('bookComment')}</Text>
            <TextInput
              style={styles.noteInput}
              value={draftComment}
              onChangeText={setDraftComment}
              placeholder={t('bookCommentPlaceholder')}
              placeholderTextColor={cores.muted}
              multiline
              maxLength={5000}
              textAlignVertical="top"
            />
            <View style={styles.modalActions}>
              <Pressable style={styles.modalButton} onPress={() => setEditing(null)}><Text style={styles.modalButtonText}>{t('cancel')}</Text></Pressable>
              <Pressable style={[styles.modalButton, styles.saveButton]} onPress={() => void saveEditor()} disabled={writingKey === `book:${editing?.id}`}>
                {writingKey === `book:${editing?.id}` ? <ActivityIndicator size="small" color={cores.onGold} /> : <Text style={styles.saveButtonText}>{t('save')}</Text>}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <Modal visible={statusBook !== null} transparent animationType="fade" onRequestClose={() => setStatusBook(null)}>
        <Pressable style={styles.statusOverlay} onPress={() => setStatusBook(null)}>
          <Pressable style={styles.statusModal} onPress={(event) => event.stopPropagation()}>
            <Text style={styles.modalTitle} numberOfLines={2}>{statusBook?.title}</Text>
            {STATUSES.map((status) => (
              <Pressable
                key={status}
                accessibilityRole="button"
                accessibilityState={{ selected: statusBook?.status === status }}
                style={styles.statusOption}
                onPress={() => {
                  const currentBook = statusBook;
                  setStatusBook(null);
                  if (currentBook && currentBook.status !== status) void updatePersonal(currentBook, { status });
                }}
              >
                <Text style={styles.statusOptionText}>{statusLabel(status)}</Text>
                {statusBook?.status === status ? <Ionicons name="checkmark" size={19} color={cores.gold} /> : null}
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

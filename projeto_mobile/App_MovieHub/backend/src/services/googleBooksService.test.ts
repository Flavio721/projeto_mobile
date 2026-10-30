import assert from 'node:assert/strict';
import { test } from 'node:test';
import { normalizeGoogleVolume, searchGoogleBooks } from './googleBooksService.js';

test('normalizes Google Books metadata, ISBNs, and HTTPS cover URLs', () => {
  const book = normalizeGoogleVolume({
    id: 'google-volume-1',
    volumeInfo: {
      title: 'A <b>Book</b>',
      authors: ['An Author'],
      description: '<p>A short description.</p>',
      industryIdentifiers: [
        { type: 'ISBN_10', identifier: '0-306-40615-2' },
        { type: 'ISBN_13', identifier: '978-0-306-40615-7' },
      ],
      imageLinks: { thumbnail: 'http://books.google.com/books/content?id=volume' },
    },
  });

  assert.ok(book);
  assert.equal(book.title, 'A Book');
  assert.equal(book.description, 'A short description.');
  assert.equal(book.isbn10, '0306406152');
  assert.equal(book.isbn13, '9780306406157');
  assert.equal(book.coverUrl, 'https://books.google.com/books/content?id=volume');
});

test('rejects missing titles and invalid ISBN checksums', () => {
  assert.equal(normalizeGoogleVolume({ id: 'no-title', volumeInfo: {} }), null);
  const book = normalizeGoogleVolume({
    id: 'bad-isbn',
    volumeInfo: { title: 'Book', industryIdentifiers: [{ type: 'ISBN_13', identifier: '9780306406158' }] },
  });
  assert.equal(book?.isbn13, null);
});

test('Google Books search includes the server key and bounds the response page size', async (t) => {
  const previousKey = process.env.GOOGLE_BOOKS_API_KEY;
  process.env.GOOGLE_BOOKS_API_KEY = 'test-key-never-used-outside-this-request';
  t.after(() => {
    if (previousKey === undefined) delete process.env.GOOGLE_BOOKS_API_KEY;
    else process.env.GOOGLE_BOOKS_API_KEY = previousKey;
  });

  t.mock.method(globalThis, 'fetch', async (input: Parameters<typeof fetch>[0]) => {
    const url = new URL(String(input));
    assert.equal(url.origin, 'https://www.googleapis.com');
    assert.equal(url.pathname, '/books/v1/volumes');
    assert.equal(url.searchParams.get('key'), 'test-key-never-used-outside-this-request');
    assert.equal(url.searchParams.get('maxResults'), '20');
    assert.equal(url.searchParams.get('startIndex'), '20');
    return Response.json({ totalItems: 21, items: [{ id: 'test-volume', volumeInfo: { title: 'Test Book' } }] });
  });

  const response = await searchGoogleBooks(`unique test ${Date.now()}`, 2);
  assert.equal(response.page, 2);
  assert.equal(response.totalPages, 2);
  assert.equal(response.results[0]?.title, 'Test Book');
});

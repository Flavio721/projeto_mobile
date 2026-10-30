import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import jwt from 'jsonwebtoken';

process.env.JWT_SECRET = 'route-tests-only-secret-with-at-least-32-bytes';

const { default: app } = await import('./app.js');
const server = app.listen(0);
let baseUrl = '';
const authToken = jwt.sign({ userId: 'route-test-user' }, process.env.JWT_SECRET, { algorithm: 'HS256' });

before(async () => {
  await new Promise<void>((resolve) => server.once('listening', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Could not bind test server');
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

async function request(path: string, init?: RequestInit) {
  return fetch(`${baseUrl}${path}`, init);
}

test('health route responds without exposing Express version', async () => {
  const response = await request('/');
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('x-powered-by'), null);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.deepEqual(await response.json(), { status: 'ok', message: 'MovieHub API rodando' });
});

test('every protected route rejects requests without a bearer token', async () => {
  const paths: Array<[string, string]> = [
    ['GET', '/users/me'], ['PUT', '/users/me'], ['PATCH', '/users/me/password'],
    ['GET', '/movies'], ['GET', '/movies/search?query=x'], ['GET', '/movies/popular'], ['GET', '/movies/stats'], ['GET', '/movies/genres'],
    ['GET', '/movies/catalog/1'], ['GET', '/movies/1/library'], ['PUT', '/movies/1/library'], ['DELETE', '/movies/1/library'], ['PATCH', '/movies/1/favorite'],
    ['GET', '/books'], ['GET', '/books/search?q=book'], ['GET', '/books/stats'], ['PUT', '/books/volume123/library'], ['PATCH', '/books/1/library'], ['DELETE', '/books/1/library'],
    ['GET', '/friends'], ['GET', '/friends/search?username=abc'], ['POST', '/friends/requests'],
    ['POST', '/friends/requests/1/accept'], ['DELETE', '/friends/requests/1'], ['GET', '/friends/privacy'],
    ['PATCH', '/friends/privacy'], ['GET', '/friends/1/profile'], ['GET', '/cinemas/nearby?lat=0&lng=0'], ['POST', '/upload'],
  ];
  for (const [method, path] of paths) {
    const response = await request(path, { method });
    assert.equal(response.status, 401, `${path} should require authentication`);
  }
});

test('bearer token parsing rejects malformed and non-HS256 tokens', async () => {
  for (const authorization of ['Bearer abc extra', 'Bearer Bearer abc', 'Basic abc']) {
    const response = await request('/users/me', { headers: { authorization } });
    assert.equal(response.status, 401);
  }
  const wrongAlgorithmToken = jwt.sign({ userId: 'route-test-user' }, 'unused', { algorithm: 'HS384' });
  const response = await request('/users/me', { headers: { authorization: `Bearer ${wrongAlgorithmToken}` } });
  assert.equal(response.status, 401);
});

test('protected routes validate invalid input before touching external services or database', async () => {
  const headers = { authorization: `Bearer ${authToken}`, 'content-type': 'application/json' };
  const checks: Array<[string, RequestInit, number]> = [
    ['/cinemas/nearby?lat=91&lng=0', {}, 400],
    ['/cinemas/nearby?lat=0&lng=0&radius=26000', {}, 400],
    ['/movies/not-a-number/library', {}, 400],
    ['/movies/search?query=%20%20', {}, 400],
    ['/books/search?q=%20', {}, 400],
    ['/books/search?q=abc&page=0', {}, 400],
    ['/friends/search?username=!', {}, 400],
    ['/friends/requests', { method: 'POST', body: JSON.stringify({ username: '!' }) }, 400],
    ['/friends/privacy', { method: 'PATCH', body: JSON.stringify({ shareWatched: 'yes' }) }, 400],
    ['/books/test-volume/library', { method: 'PUT', body: JSON.stringify({ status: 'INVALID' }) }, 400],
    ['/books/1/library', { method: 'PATCH', body: JSON.stringify({ rating: 8 }) }, 400],
    ['/books/1/library', { method: 'PATCH', body: JSON.stringify({ admin: true }) }, 400],
  ];
  for (const [path, init, expectedStatus] of checks) {
    const response = await request(path, { ...init, headers });
    assert.equal(response.status, expectedStatus, path);
  }
});

test('upload route rejects missing files cleanly', async () => {
  const response = await request('/upload', { method: 'POST', headers: { authorization: `Bearer ${authToken}` } });
  assert.equal(response.status, 400);
});

test('upload route rejects a spoofed image MIME type', async () => {
  const form = new FormData();
  form.append('imagem', new Blob(['not an image'], { type: 'image/png' }), 'photo.png');
  const response = await request('/upload', {
    method: 'POST', headers: { authorization: `Bearer ${authToken}` }, body: form,
  });
  assert.equal(response.status, 400);
});

test('public authentication routes validate malformed input without database access', async () => {
  const checks: Array<[string, unknown]> = [
    ['/users/cadastro', { name: 'A', email: 'bad-email', password: '123', username: 'ab' }],
    ['/users/login', { email: 'bad-email', password: 'x'.repeat(100) }],
    ['/users/google', { idToken: 'short' }],
  ];
  for (const [path, body] of checks) {
    const response = await request(path, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
    });
    assert.equal(response.status, 400, path);
  }
});

test('malformed JSON receives a client error instead of an internal error', async () => {
  const response = await request('/users/login', {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: '{invalid',
  });
  assert.equal(response.status, 400);
});

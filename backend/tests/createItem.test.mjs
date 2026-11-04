import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { after, before, describe, it } from 'node:test';

const configuredUrl = process.env.TASK35_API_URL;
if (!configuredUrl) {
  throw new Error('Set TASK35_API_URL to the API backed by a disposable local database.');
}

const target = new URL(configuredUrl);
if (
  target.protocol !== 'http:' ||
  !['localhost', '127.0.0.1', '[::1]'].includes(target.hostname) ||
  !target.port ||
  target.username ||
  target.password ||
  target.search ||
  target.hash ||
  target.pathname.replace(/\/$/, '') !== '/api'
) {
  throw new Error(
    'TASK35_API_URL must be http://localhost:<port>/api or a loopback IP equivalent.'
  );
}

const apiUrl = target.href.replace(/\/$/, '');
const runId = randomUUID();
const fixtures = [];
let seller;
let otherSeller;
let category;

const request = async (path, { method = 'GET', cookie, body, rawBody } = {}) => {
  const headers = {};
  if (cookie) headers.Cookie = cookie;
  if (body !== undefined || rawBody !== undefined) headers['Content-Type'] = 'application/json';

  const response = await fetch(`${apiUrl}${path}`, {
    method,
    headers,
    body: rawBody ?? (body === undefined ? undefined : JSON.stringify(body)),
    redirect: 'error',
    signal: AbortSignal.timeout(15000),
  });
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  return { status: response.status, headers: response.headers, data };
};

const expectStatus = (response, expected) => {
  assert.equal(
    response.status,
    expected,
    `Expected HTTP ${expected}; received ${response.status}: ${JSON.stringify(response.data)}`
  );
};

const register = async (label) => {
  const response = await request('/auth/register', {
    method: 'POST',
    body: {
      name: `Item API test ${label}`,
      email: `item-api-${runId}-${label}@example.invalid`,
      password: 'DisposableItemTest35!',
    },
  });
  expectStatus(response, 201);
  const user = response.data.user;
  assert.ok(user?.id);
  fixtures.push(user.id);
  assert.ok(user.shop?.id, 'The registration fixture must have a shop.');
  const sessionCookie = response.headers
    .getSetCookie()
    .find((cookie) => cookie.startsWith('token='));
  assert.ok(sessionCookie, 'Registration must issue the session cookie.');
  return { user, cookie: sessionCookie.split(';')[0] };
};

const validItem = (overrides = {}) => ({
  title: 'A well-kept book',
  description: 'Paperback in good condition.',
  priceCents: 1800,
  condition: 'GOOD',
  categoryId: category.id,
  ...overrides,
});

const create = (body, cookie = seller.cookie) =>
  request('/items', { method: 'POST', cookie, body });

const expectValidation = (response, expectedFields) => {
  expectStatus(response, 400);
  assert.equal(response.data.error, 'Validation failed');
  const { fields } = response.data;
  assert.ok(fields && typeof fields === 'object' && !Array.isArray(fields));
  for (const field of expectedFields) {
    const message = fields[field];
    assert.ok(
      (typeof message === 'string' && message.trim()) ||
        (Array.isArray(message) &&
          message.length &&
          message.every((part) => typeof part === 'string' && part.trim())),
      `Expected a readable validation error for ${field}: ${JSON.stringify(fields)}`
    );
  }
};

const getShopItems = async (shopId) => {
  const response = await request(`/items?shopId=${encodeURIComponent(shopId)}&take=100`);
  expectStatus(response, 200);
  return response.data;
};

describe('POST /api/items against a disposable local API', { concurrency: false }, () => {
  before(async () => {
    const health = await request('/health');
    expectStatus(health, 200);
    assert.equal(health.data.database, 'connected');

    const categories = await request('/categories');
    expectStatus(categories, 200);
    category = categories.data.categories[0];
    assert.ok(category?.id, 'Seed the disposable database before running this test.');

    seller = await register('seller');
    otherSeller = await register('other');
  });

  after(async () => {
    const cleanupFailures = [];
    for (const id of fixtures.reverse()) {
      try {
        const response = await request(`/users/${encodeURIComponent(id)}`, { method: 'DELETE' });
        expectStatus(response, 200);
      } catch (error) {
        cleanupFailures.push(error);
      }
    }
    assert.equal(
      cleanupFailures.length,
      0,
      cleanupFailures.map((error) => error.message).join('\n')
    );
  });

  it('returns 401 without a session cookie', async () => {
    expectStatus(await create(validItem(), ''), 401);
  });

  it('returns 401 for an invalid session cookie', async () => {
    expectStatus(await create(validItem(), 'token=not-a-valid-session'), 401);
  });

  it('returns 403 for an authenticated legacy account without a shop', async () => {
    const credentials = {
      email: `item-api-${runId}-without-shop@example.invalid`,
      password: 'DisposableItemTest35!',
    };
    const account = await request('/users', {
      method: 'POST',
      body: { name: 'Item API test without shop', ...credentials },
    });
    expectStatus(account, 201);
    assert.ok(account.data.user?.id);
    fixtures.push(account.data.user.id);

    const login = await request('/auth/login', { method: 'POST', body: credentials });
    expectStatus(login, 200);
    assert.equal(login.data.user.shop, null);
    const sessionCookie = login.headers
      .getSetCookie()
      .find((cookie) => cookie.startsWith('token='));
    assert.ok(sessionCookie);

    const response = await create(
      validItem({ shopId: otherSeller.user.shop.id }),
      sessionCookie.split(';')[0]
    );
    expectStatus(response, 403);
    assert.equal(response.data.error, 'You need a shop to list an item.');
  });

  it('persists the item and returns the same complete shape as GET by ID', async () => {
    const response = await create(validItem({ photoUrls: ['https://example.invalid/book.jpg'] }));
    expectStatus(response, 201);
    const { item } = response.data;
    assert.ok(item?.id);
    assert.equal(item.title, 'A well-kept book');
    assert.equal(item.description, 'Paperback in good condition.');
    assert.equal(item.priceCents, 1800);
    assert.equal(item.condition, 'GOOD');
    assert.equal(item.sold, false);
    assert.equal(item.oldPriceCents, null);
    assert.ok(Number.isFinite(Date.parse(item.createdAt)));
    assert.equal(item.category.slug, category.slug);
    assert.equal(item.shop.id, seller.user.shop.id);
    assert.equal(item.shop.owner.id, seller.user.id);
    assert.equal('passwordHash' in item.shop.owner, false);

    const detail = await request(`/items/${item.id}`);
    expectStatus(detail, 200);
    assert.deepEqual(response.data, detail.data);

    const listing = await request('/items?take=100');
    expectStatus(listing, 200);
    assert.ok(listing.data.items.some((entry) => entry.id === item.id));
    assert.ok(
      (await getShopItems(seller.user.shop.id)).items.some((entry) => entry.id === item.id)
    );
    assert.equal(
      (await getShopItems(otherSeller.user.shop.id)).items.some((entry) => entry.id === item.id),
      false
    );
  });

  it('ignores supplied ownership, ID, sale state and previous price', async () => {
    const suppliedId = randomUUID();
    const response = await create(
      validItem({
        shopId: otherSeller.user.shop.id,
        id: suppliedId,
        sold: true,
        oldPriceCents: 9000,
      })
    );
    expectStatus(response, 201);
    assert.equal(response.data.item.shop.id, seller.user.shop.id);
    assert.equal(response.data.item.shop.owner.id, seller.user.id);
    assert.notEqual(response.data.item.id, suppliedId);
    assert.equal(response.data.item.sold, false);
    assert.equal(response.data.item.oldPriceCents, null);
    expectStatus(await request(`/items/${suppliedId}`), 404);
  });

  for (const condition of ['NEW', 'LIKE_NEW', 'GOOD', 'USED']) {
    it(`accepts the ${condition} condition`, async () => {
      const response = await create(validItem({ condition }));
      expectStatus(response, 201);
      assert.equal(response.data.item.condition, condition);
    });
  }

  it('accepts a free item, trims text and permits an empty description', async () => {
    const response = await create(
      validItem({ title: '  abc  ', description: '  ', priceCents: 0 })
    );
    expectStatus(response, 201);
    assert.equal(response.data.item.title, 'abc');
    assert.equal(response.data.item.description, '');
    assert.equal(response.data.item.priceCents, 0);
  });

  it('accepts maximum text lengths after trimming and the maximum price', async () => {
    const response = await create(
      validItem({
        title: `  ${'t'.repeat(120)}  `,
        description: `  ${'d'.repeat(2000)}  `,
        priceCents: 1_000_000,
      })
    );
    expectStatus(response, 201);
    assert.equal(response.data.item.title, 't'.repeat(120));
    assert.equal(response.data.item.description, 'd'.repeat(2000));
    assert.equal(response.data.item.priceCents, 1_000_000);
  });

  it('accepts omitted photos and an empty photo list', async () => {
    for (const body of [validItem(), validItem({ photoUrls: [] })]) {
      const response = await create(body);
      expectStatus(response, 201);
      assert.deepEqual(response.data.item.photos, []);
    }
  });

  it('persists five HTTP(S) photos in their input order with zero-based positions', async () => {
    const photoUrls = [
      'https://example.invalid/last.jpg',
      'http://example.invalid/first.jpg',
      'https://example.invalid/duplicate.jpg',
      'https://example.invalid/duplicate.jpg',
      'https://example.invalid/detail.jpg?size=large',
    ];
    const response = await create(validItem({ photoUrls }));
    expectStatus(response, 201);
    const detail = await request(`/items/${response.data.item.id}`);
    expectStatus(detail, 200);
    assert.deepEqual(response.data.item, detail.data.item);
    assert.deepEqual(
      detail.data.item.photos.map((photo) => photo.url),
      photoUrls
    );
    assert.deepEqual(
      detail.data.item.photos.map((photo) => photo.position),
      [0, 1, 2, 3, 4]
    );
    assert.equal(new Set(detail.data.item.photos.map((photo) => photo.id)).size, 5);
  });

  const invalidFields = [
    ['missing title', 'title', undefined],
    ['null title', 'title', null],
    ['numeric title', 'title', 123],
    ['short trimmed title', 'title', '  ab  '],
    ['long title', 'title', 't'.repeat(121)],
    ['missing description', 'description', undefined],
    ['null description', 'description', null],
    ['numeric description', 'description', 123],
    ['long description', 'description', 'd'.repeat(2001)],
    ['missing price', 'priceCents', undefined],
    ['negative price', 'priceCents', -100],
    ['fractional price', 'priceCents', 18.5],
    ['excessive price', 'priceCents', 1_000_001],
    ['string price', 'priceCents', '1800'],
    ['null price', 'priceCents', null],
    ['missing condition', 'condition', undefined],
    ['unknown condition', 'condition', 'BROKEN'],
    ['lowercase condition', 'condition', 'good'],
    ['numeric condition', 'condition', 1],
    ['missing category', 'categoryId', undefined],
    ['malformed category ID', 'categoryId', 'not-a-uuid'],
    ['numeric category ID', 'categoryId', 1],
    ['unknown category', 'categoryId', randomUUID()],
    ['null photos', 'photoUrls', null],
    ['non-array photos', 'photoUrls', 'https://example.invalid/photo.jpg'],
    [
      'too many photos',
      'photoUrls',
      Array.from({ length: 6 }, (_, index) => `https://example.invalid/${index}.jpg`),
    ],
    ['malformed photo URL', 'photoUrls', ['not-a-url']],
    ['FTP photo URL', 'photoUrls', ['ftp://example.invalid/photo.jpg']],
    ['data photo URL', 'photoUrls', ['data:image/png;base64,AA==']],
    ['empty photo URL', 'photoUrls', ['']],
    ['numeric photo URL', 'photoUrls', [42]],
  ];

  for (const [label, field, value] of invalidFields) {
    it(`rejects ${label} with a field error`, async () => {
      expectValidation(await create(validItem({ [field]: value })), [field]);
    });
  }

  it('returns all field errors, including an unknown category, without creating an item', async () => {
    const beforeItems = await getShopItems(seller.user.shop.id);
    const response = await create(
      validItem({
        title: 'x',
        description: 'd'.repeat(2001),
        priceCents: -100,
        condition: 'BROKEN',
        categoryId: randomUUID(),
        photoUrls: ['javascript:alert(1)'],
      })
    );
    expectValidation(response, [
      'title',
      'description',
      'priceCents',
      'condition',
      'categoryId',
      'photoUrls',
    ]);
    const afterItems = await getShopItems(seller.user.shop.id);
    assert.equal(afterItems.total, beforeItems.total);
    assert.deepEqual(
      afterItems.items.map((item) => item.id),
      beforeItems.items.map((item) => item.id)
    );
  });

  it('returns every missing required field for an empty object', async () => {
    expectValidation(await create({}), [
      'title',
      'description',
      'priceCents',
      'condition',
      'categoryId',
    ]);
  });

  it('rejects non-object and malformed JSON request bodies', async () => {
    for (const rawBody of ['null', '[]', '"text"', '42', '{"title":']) {
      const response = await request('/items', { method: 'POST', cookie: seller.cookie, rawBody });
      expectStatus(response, 400);
    }
  });
});

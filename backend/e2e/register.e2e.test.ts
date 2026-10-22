import { afterAll, describe, expect, it } from 'vitest';

import { db, register } from './db';

// Every run starts from a freshly seeded database, but unique emails keep
// these tests independent of each other and of the seed.
const unique = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const password = 'correct horse battery';

afterAll(() => db.$disconnect());

describe('POST /api/auth/register against PostgreSQL', () => {
  it('creates the user with a bcrypt hash, a shop and an httpOnly cookie', async () => {
    const email = `lena-${unique()}@example.com`;

    const res = await register({ name: 'Lena K.', email, password });
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.user).not.toHaveProperty('passwordHash');
    expect(res.headers.get('set-cookie')).toMatch(/^token=.+HttpOnly/i);

    const saved = await db.user.findUnique({ where: { email }, include: { shop: true } });
    expect(saved?.passwordHash).toMatch(/^\$2[aby]\$10\$/);
    expect(saved?.shop?.name).toBe("Lena's shop");
  });

  // The raw SQL in authService exists for this case: older routes saved
  // emails exactly as typed. Only a real database runs that regexp_replace.
  it('treats a stored "\\tAlice@Example.com " as the same address', async () => {
    const id = unique();
    await db.user.create({
      data: { name: 'Alice', email: `\tAlice-${id}@Example.com `, passwordHash: 'x' },
    });

    const res = await register({ name: 'Alice', email: `alice-${id}@example.com`, password });

    expect(res.status).toBe(409);
  });

  // Prisma's `mode: 'insensitive'` compiles to ILIKE, where "_" matches
  // any character. That would make john_doe collide with john.doe.
  it('does not treat "_" as a wildcard', async () => {
    const id = unique();
    await db.user.create({
      data: { name: 'John', email: `john.doe-${id}@example.com`, passwordHash: 'x' },
    });

    const res = await register({ name: 'John', email: `john_doe-${id}@example.com`, password });

    expect(res.status).toBe(201);
  });

  // Two requests for one address at the same time: both pass the lookup,
  // and PostgreSQL's unique index rejects the second insert.
  it('answers one 201 and one 409 when the same email registers twice at once', async () => {
    const email = `race-${unique()}@example.com`;

    const responses = await Promise.all([
      register({ name: 'Race', email, password }),
      register({ name: 'Race', email, password }),
    ]);

    expect(responses.map((r) => r.status).sort()).toEqual([201, 409]);
    expect(await db.user.count({ where: { email } })).toBe(1);
    expect(await db.shop.count({ where: { owner: { email } } })).toBe(1);
  });
});

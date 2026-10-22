import { beforeEach, describe, expect, it, vi } from 'vitest';

import { EmailAlreadyRegisteredError } from '../errors/authErrors';
import prisma from '../libs/prisma';
import { AuthService } from './authService';

// authService does `import prisma from '../libs/prisma'`. There is no
// constructor parameter to pass a fake in through, so we replace the
// module itself: every file that imports '../libs/prisma' while this test
// runs gets this object instead of the real client. vi.mock is hoisted to
// the top of the file, so it is in place before authService is loaded.
vi.mock('../libs/prisma', () => ({
  default: {
    $queryRaw: vi.fn(),
    $transaction: vi.fn(),
  },
}));

// Typed handles on the fakes, so we can program and inspect them.
const db = vi.mocked(prisma);

// The transaction callback receives `tx`. Our fake hands it these.
const tx = {
  user: { create: vi.fn() },
  shop: { create: vi.fn() },
};

const input = { name: 'Lena K.', email: 'lena@example.com', password: 'correct horse' };

describe('AuthService.register', () => {
  const service = new AuthService();

  beforeEach(() => {
    db.$queryRaw.mockResolvedValue([]); // nobody has this email yet
    // Run the callback right away with our fake tx, like Prisma would.
    // The cast is because Prisma's real signature is far more complex than our fake.
    db.$transaction.mockImplementation(((callback: (t: typeof tx) => unknown) =>
      callback(tx)) as never);
    tx.user.create.mockResolvedValue({
      id: 'u1',
      name: 'Lena K.',
      email: 'lena@example.com',
      isAdmin: false,
      passwordHash: '$2b$10$...',
    });
    tx.shop.create.mockResolvedValue({ id: 's1', name: "Lena's shop" });
  });

  it('creates the user and a shop named after their first name', async () => {
    const user = await service.register(input);

    expect(tx.shop.create).toHaveBeenCalledWith({
      data: { name: "Lena's shop", ownerId: 'u1' },
    });
    expect(user.shop).toEqual({ id: 's1', name: "Lena's shop" });
  });

  it('stores a bcrypt hash, never the password itself', async () => {
    await service.register(input);

    const saved = tx.user.create.mock.calls[0][0].data;
    expect(saved.passwordHash).not.toBe(input.password);
    expect(saved.passwordHash).toMatch(/^\$2[aby]\$10\$/);
  });

  it('never returns the password hash', async () => {
    const user = await service.register(input);

    expect(user).not.toHaveProperty('passwordHash');
  });

  it('refuses an email that is already taken', async () => {
    db.$queryRaw.mockResolvedValue([{ id: 'someone-else' }]);

    await expect(service.register(input)).rejects.toBeInstanceOf(EmailAlreadyRegisteredError);
    expect(db.$transaction).not.toHaveBeenCalled();
  });

  it('turns a race on the unique email into the same error', async () => {
    // Both requests passed the lookup; the database rejects the second insert.
    db.$transaction.mockRejectedValue({ code: 'P2002' });

    await expect(service.register(input)).rejects.toBeInstanceOf(EmailAlreadyRegisteredError);
  });
});

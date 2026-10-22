import type { Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { EmailAlreadyRegisteredError } from '../errors/authErrors';

// libs/jwt.ts throws at import time when JWT_SECRET is missing. vi.hoisted
// runs before any import below, so the secret is set in time.
vi.hoisted(() => {
  process.env.JWT_SECRET = 'test-secret-only-for-tests';
});

// The controller does `const authService = new AuthService()` when the
// file loads. We swap the whole class for one whose register() is a fake
// we control. vi.hoisted lets the mock factory and the tests share it.
const { register } = vi.hoisted(() => ({ register: vi.fn() }));

vi.mock('../services/authService', () => ({
  AuthService: class {
    register = register;
  },
}));

import { AuthController } from './authController';

// Just enough of Express's res for the controller: each method records
// its call and returns res, so chains like res.status(201).json() work.
const fakeRes = () => {
  const res = {
    status: vi.fn(() => res),
    json: vi.fn(() => res),
    cookie: vi.fn(() => res),
  };
  return res;
};

const call = async (body: unknown) => {
  const res = fakeRes();
  await new AuthController().register({ body } as Request, res as unknown as Response);
  return res;
};

const valid = { name: 'Lena', email: '  Lena@Example.com ', password: 'correct horse' };

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    register.mockResolvedValue({ id: 'u1', name: 'Lena', email: 'lena@example.com' });
  });

  it('answers 400 and never calls the service when the password is too short', async () => {
    const res = await call({ ...valid, password: 'short' });

    expect(res.status).toHaveBeenCalledWith(400);
    expect(register).not.toHaveBeenCalled();
  });

  it('passes a trimmed, lowercased email to the service', async () => {
    await call(valid);

    expect(register).toHaveBeenCalledWith(expect.objectContaining({ email: 'lena@example.com' }));
  });

  it('answers 201 and sets an httpOnly auth cookie', async () => {
    const res = await call(valid);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.cookie).toHaveBeenCalledWith(
      'token',
      expect.any(String),
      expect.objectContaining({ httpOnly: true, sameSite: 'lax' })
    );
  });

  it('turns EmailAlreadyRegisteredError into 409', async () => {
    register.mockRejectedValue(new EmailAlreadyRegisteredError());

    const res = await call(valid);

    expect(res.status).toHaveBeenCalledWith(409);
  });
});

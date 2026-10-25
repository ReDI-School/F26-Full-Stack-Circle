import express from 'express';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.hoisted(() => {
  process.env.JWT_SECRET = 'test-secret-long-enough-for-vitest';
});

const { mockRegister } = vi.hoisted(() => ({
  mockRegister: vi.fn(),
}));

vi.mock('@/services/authService', () => ({
  AuthService: class {
    register = mockRegister;
  },
}));

import authRouter from '@/routes/authRoutes';
import { EmailAlreadyRegisteredError } from '@/errors/authErrors';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/auth', authRouter);

const validRegistration = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  password: 'securepassword123',
};

describe('Auth Routes - Response Codes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('POST /auth/register', () => {
    it('returns 201 for valid registration payload', async () => {
      mockRegister.mockResolvedValue({
        id: 'user-1',
        name: 'Ada Lovelace',
        email: 'ada@example.com',
      });

      const res = await request(app).post('/auth/register').send(validRegistration);

      expect(res.status).toBe(201);
    });

    it('returns 400 when password is too short', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({ ...validRegistration, password: 'short' });

      expect(res.status).toBe(400);
    });

    it('returns 400 when email format is invalid', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({ ...validRegistration, email: 'not-an-email' });

      expect(res.status).toBe(400);
    });

    it('returns 400 when request body is empty', async () => {
      const res = await request(app).post('/auth/register').send({});

      expect(res.status).toBe(400);
    });

    it('returns 409 when email is already registered', async () => {
      mockRegister.mockRejectedValue(new EmailAlreadyRegisteredError());

      const res = await request(app).post('/auth/register').send(validRegistration);

      expect(res.status).toBe(409);
    });

    it('returns 500 when auth service throws an unexpected error', async () => {
      mockRegister.mockRejectedValue(new Error('Unexpected database failure'));

      const res = await request(app).post('/auth/register').send(validRegistration);

      expect(res.status).toBe(500);
    });
  });
});


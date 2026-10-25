import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockGetAllUsers, mockGetUserById, mockCreateUser, mockUpdateUser, mockDeleteUser } =
  vi.hoisted(() => ({
    mockGetAllUsers: vi.fn(),
    mockGetUserById: vi.fn(),
    mockCreateUser: vi.fn(),
    mockUpdateUser: vi.fn(),
    mockDeleteUser: vi.fn(),
  }));

vi.mock('@/services/userService', () => ({
  UserService: class {
    getAllUsers = mockGetAllUsers;
    getUserById = mockGetUserById;
    createUser = mockCreateUser;
    updateUser = mockUpdateUser;
    deleteUser = mockDeleteUser;
  },
}));

import userRouter from '@/routes/userRoutes';

const app = express();
app.use(express.json());
app.use('/users', userRouter);

describe('User Routes - Response Codes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('GET /users', () => {
    it('returns 200 when users are fetched successfully', async () => {
      mockGetAllUsers.mockResolvedValue([{ id: 'u1', name: 'User 1' }]);

      const res = await request(app).get('/users');

      expect(res.status).toBe(200);
    });

    it('returns 500 when fetching users throws an error', async () => {
      mockGetAllUsers.mockRejectedValue(new Error('DB failure'));

      const res = await request(app).get('/users');

      expect(res.status).toBe(500);
    });
  });

  describe('GET /users/:id', () => {
    it('returns 200 when user is found', async () => {
      mockGetUserById.mockResolvedValue({ id: 'u1', name: 'User 1' });

      const res = await request(app).get('/users/u1');

      expect(res.status).toBe(200);
    });

    it('returns 404 when user is not found', async () => {
      mockGetUserById.mockResolvedValue(null);

      const res = await request(app).get('/users/nonexistent');

      expect(res.status).toBe(404);
    });

    it('returns 500 when fetching user by id throws an error', async () => {
      mockGetUserById.mockRejectedValue(new Error('DB failure'));

      const res = await request(app).get('/users/u1');

      expect(res.status).toBe(500);
    });
  });

  describe('POST /users', () => {
    it('returns 201 when user is created successfully', async () => {
      mockCreateUser.mockResolvedValue({ id: 'u1', name: 'User 1', email: 'u1@example.com' });

      const res = await request(app).post('/users').send({
        name: 'User 1',
        email: 'u1@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(201);
    });

    it('returns 500 when creating user throws an error', async () => {
      mockCreateUser.mockRejectedValue(new Error('DB failure'));

      const res = await request(app).post('/users').send({
        name: 'User 1',
        email: 'u1@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(500);
    });
  });

  describe('PUT /users/:id', () => {
    it('returns 200 when user is updated successfully', async () => {
      mockUpdateUser.mockResolvedValue({ id: 'u1', name: 'Updated Name' });

      const res = await request(app).put('/users/u1').send({ name: 'Updated Name' });

      expect(res.status).toBe(200);
    });

    it('returns 500 when updating user throws an error', async () => {
      mockUpdateUser.mockRejectedValue(new Error('DB failure'));

      const res = await request(app).put('/users/u1').send({ name: 'Updated Name' });

      expect(res.status).toBe(500);
    });
  });

  describe('DELETE /users/:id', () => {
    it('returns 200 when user is deleted successfully', async () => {
      mockDeleteUser.mockResolvedValue({ id: 'u1' });

      const res = await request(app).delete('/users/u1');

      expect(res.status).toBe(200);
    });

    it('returns 500 when deleting user throws an error', async () => {
      mockDeleteUser.mockRejectedValue(new Error('DB failure'));

      const res = await request(app).delete('/users/u1');

      expect(res.status).toBe(500);
    });
  });
});

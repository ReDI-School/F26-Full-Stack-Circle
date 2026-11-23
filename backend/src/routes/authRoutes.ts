import { Router } from 'express';
import { requireAuth } from '@/middleware/requireAuth';

import { AccountController } from '../controllers/accountController';
import { AuthController } from '../controllers/authController';

const authController = new AuthController();
const accountController = new AccountController();
const authRouter = Router();

authRouter.post('/register', (req, res) => authController.register(req, res));
authRouter.post('/login', (req, res) => authController.login(req, res));
authRouter.post('/logout', (_req, res) => authController.logout(_req, res));
// Same handler as GET /api/me so the two payloads cannot drift.
authRouter.get('/me', requireAuth, (req, res) => accountController.getMe(req, res));

export default authRouter;

import { Router } from 'express';
import { requireAuth } from '@/middleware/requireAuth';

import { AuthController } from '../controllers/authController';

const authController = new AuthController();
const authRouter = Router();

authRouter.post('/register', (req, res) => authController.register(req, res));
authRouter.post('/login', (req, res) => authController.login(req, res));
authRouter.post('/logout', (_req, res) => authController.logout(_req, res));
authRouter.get('/me', requireAuth, (req, res) => authController.me(req, res));

export default authRouter;

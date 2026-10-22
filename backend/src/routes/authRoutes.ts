import { Router } from 'express';

import { AuthController } from '../controllers/authController';

const authController = new AuthController();
const authRouter = Router();

authRouter.post('/register', (req, res) => authController.register(req, res));
authRouter.post('/login', (req, res) => authController.login(req, res));
authRouter.post('/logout', (_req, res) => authController.logout(_req, res));

export default authRouter;

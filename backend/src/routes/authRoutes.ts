import { Router } from 'express';

import { AuthController } from '../controllers/authController';

const authController = new AuthController();
const authRouter = Router();

authRouter.post('/register', (req, res) => authController.register(req, res));

export default authRouter;

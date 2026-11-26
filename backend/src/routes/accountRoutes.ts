import { Router } from 'express';

import { AccountController } from '../controllers/accountController';
import { requireAuth } from '../middleware/requireAuth';

const accountController = new AccountController();
const accountRouter = Router();

accountRouter.get('/', requireAuth, (req, res) => accountController.getMe(req, res));
accountRouter.patch('/', requireAuth, (req, res) => accountController.updateMe(req, res));
accountRouter.delete('/', requireAuth, (req, res) => accountController.deleteMe(req, res));

export default accountRouter;

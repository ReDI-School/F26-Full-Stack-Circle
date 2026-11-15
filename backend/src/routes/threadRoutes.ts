import { Router } from 'express';
import { ThreadController } from '../controllers/threadController';
import { requireAuth } from '../middleware/requireAuth';

const threadController = new ThreadController();
const threadRouter = Router();

// Both endpoints are personal: not logged in → 401 before the handler runs.
threadRouter.get('/', requireAuth, (req, res) => threadController.list(req, res));
threadRouter.get('/:id', requireAuth, (req, res) => threadController.getById(req, res));

export default threadRouter;

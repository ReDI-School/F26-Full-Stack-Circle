import { Router } from 'express';
import { ThreadController } from '../controllers/threadController';
import { requireAuth } from '../middleware/requireAuth';

const threadController = new ThreadController();
const threadRouter = Router();

// Every thread endpoint is personal: not logged in → 401 before the handler runs.
threadRouter.get('/', requireAuth, (req, res) => threadController.list(req, res));
threadRouter.get('/:id', requireAuth, (req, res) => threadController.getById(req, res));
threadRouter.post('/:id/messages', requireAuth, (req, res) =>
  threadController.sendMessage(req, res)
);
threadRouter.post('/:id/read', requireAuth, (req, res) => threadController.markRead(req, res));

export default threadRouter;

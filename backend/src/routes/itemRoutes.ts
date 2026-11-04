import { Router } from 'express';
import { ItemController } from '../controllers/itemController';
import { ThreadController } from '../controllers/threadController';
import { requireAuth } from '../middleware/requireAuth';

const itemController = new ItemController();
const itemRouter = Router();
const threadController = new ThreadController();

itemRouter.post('/', requireAuth, (req, res) => itemController.create(req, res));
itemRouter.get('/', (req, res) => itemController.getItems(req, res));
itemRouter.get('/:id', (req, res) => itemController.getById(req, res));
itemRouter.patch('/:id', requireAuth, (req, res) => itemController.update(req, res));

itemRouter.post('/:id/interest', requireAuth, (req, res) =>
  threadController.expressInterest(req, res)
);

export default itemRouter;

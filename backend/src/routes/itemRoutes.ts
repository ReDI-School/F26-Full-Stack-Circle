import { Router } from 'express';
import { ItemController } from '../controllers/itemController';
import { requireAuth } from '../middleware/requireAuth';

const itemController = new ItemController();
const itemRouter = Router();
itemRouter.post('/', requireAuth, (req, res) => itemController.create(req, res));
itemRouter.get('/', (req, res) => itemController.getItems(req, res));
itemRouter.get('/:id', (req, res) => itemController.getById(req, res));

export default itemRouter;

import { Router } from 'express';
import { ItemController } from '../controllers/itemController';

const itemController = new ItemController();
const itemRouter = Router();
itemRouter.get('/', (req, res) => itemController.getItems(req, res));
itemRouter.get('/:id', (req, res) => itemController.getById(req, res));

export default itemRouter;

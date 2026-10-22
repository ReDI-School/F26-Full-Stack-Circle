import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController';

const categoryController = new CategoryController();
const categoryRouter = Router();

categoryRouter.get('/', (req, res) => categoryController.getCategories(req, res));

export default categoryRouter;

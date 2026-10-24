import { Router } from 'express';
import { ShopController } from '@/controllers/shopController';

const shopController = new ShopController();
const shopRouter = Router();

shopRouter.get('/', (req, res) => shopController.getShops(req, res));
shopRouter.get('/:id', (req, res) => shopController.getShopById(req, res));

export default shopRouter;

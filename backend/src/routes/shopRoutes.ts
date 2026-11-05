import { Router } from 'express';
import { ShopController } from '@/controllers/shopController';

const router = Router();
const shopController = new ShopController();

router.get('/', shopController.getShops.bind(shopController));
router.get('/:id', shopController.getShopById.bind(shopController));

export default router;

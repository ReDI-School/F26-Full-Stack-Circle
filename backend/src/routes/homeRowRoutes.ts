import { Router } from 'express';
import { HomeRowController } from '../controllers/homeRowController';
import { requireAuth } from '../middleware/requireAuth';
import { requireAdmin } from '../middleware/requireAdmin';

const homeRowController = new HomeRowController();
const homeRowRouter = Router();

homeRowRouter.get('/', (req, res) => homeRowController.getHomeRows(req, res));

// Admin-only endpoint.
homeRowRouter.put('/:key', requireAuth, requireAdmin, (req, res) =>
  homeRowController.updateHomeRow(req, res)
);

export default homeRowRouter;

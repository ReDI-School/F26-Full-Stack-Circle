import { Request, Response } from 'express';
import { HomeRowService, HomeRowError } from '../services/homeRowService';

const homeRowService = new HomeRowService();

export class HomeRowController {
  // GET /api/home-rows
  async getHomeRows(req: Request, res: Response) {
    try {
      const homeRows = await homeRowService.getAllHomeRows();
      res.status(200).json(homeRows);
    } catch (error) {
      console.error('Error fetching home rows:', error);
      res.status(500).json({
        error: 'Failed to fetch homepage rows.',
      });
    }
  }

  // PUT /api/home-rows/:key
  async updateHomeRow(req: Request, res: Response) {
    try {
      const key = String(req.params.key);
      const { itemIds } = req.body ?? {};

      // Validate request body.
      if (
        !Array.isArray(itemIds) ||
        !itemIds.every((id: unknown) => typeof id === 'string' && id.length > 0)
      ) {
        return res.status(400).json({
          error: 'itemIds must be an array of item ID strings.',
        });
      }

      const result = await homeRowService.updateHomeRow(key, itemIds);

      return res.status(200).json(result);
    } catch (error: unknown) {
      if (error instanceof HomeRowError) {
        return res.status(error.statusCode).json({
          error: error.message,
        });
      }

      console.error('Error updating home row:', error);

      return res.status(500).json({
        error: 'Failed to update homepage row.',
      });
    }
  }
}

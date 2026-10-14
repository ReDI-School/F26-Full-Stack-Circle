import { Request, Response } from 'express';
import { CategoryService } from '../services/categoryService';

const categoryService = new CategoryService();

export class CategoryController {
  async getCategories(req: Request, res: Response) {
    try {
      const categories = await categoryService.getAllCategories();

      res.json({ categories });
    } catch (error) {
      console.error('Error fetching categories:', error);

      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  }
}

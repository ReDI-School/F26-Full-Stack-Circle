import { Request, Response } from 'express';
import { CategoryService } from '../services/categoryService';
import { TCategoryWithCount } from '../types/categories/TCategories';

const categoryService = new CategoryService();

const shapeCategories = (categories: TCategoryWithCount[]) => {
  return categories.map((category) => {
    const { _count, ...rest } = category;
    return { ...rest, itemsCount: _count.items };
  });
};

export class CategoryController {
  async getCategories(req: Request, res: Response) {
    try {
      const categories = await categoryService.getAllCategories();
      const shapedCategories = shapeCategories(categories);

      res.json({ categories: shapedCategories });
    } catch (error) {
      console.error('Error fetching categories:', error);

      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  }
}

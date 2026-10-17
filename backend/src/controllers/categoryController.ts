import { Request, Response } from 'express';
import { CategoryService } from '../services/categoryService';
import { TGetAllCategories, TGetAllCategoriesResponse } from '../types/categories/TCategories';
import { GetAllCategoriesResponseSchema } from '../schemas/GetAllCategoriesResponseSchema';

const categoryService = new CategoryService();

const shapeCategories = (categories: TGetAllCategories[]): TGetAllCategoriesResponse[] =>
  categories.map((category) =>
    GetAllCategoriesResponseSchema.parse({
      ...category,
      itemCount: category._count.items,
    })
  );

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

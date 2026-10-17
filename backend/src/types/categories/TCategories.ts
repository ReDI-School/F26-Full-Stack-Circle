import { z } from 'zod';
import type { CategoryService } from '../../services/categoryService';
import { GetAllCategoriesResponseSchema } from '../../schemas/GetAllCategoriesResponseSchema';

export type TGetAllCategories = Awaited<ReturnType<CategoryService['getAllCategories']>>[number];
export type TGetAllCategoriesResponse = z.infer<typeof GetAllCategoriesResponseSchema>;

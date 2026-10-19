import { z } from 'zod';

export const GetAllCategoriesResponseSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  emoji: z.string(),
  tint: z.number(),
  itemCount: z.number(),
});

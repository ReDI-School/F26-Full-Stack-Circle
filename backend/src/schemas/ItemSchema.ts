import { z } from 'zod';

export const getItemsQuerySchema = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
  shopId: z.string().optional(),
  take: z
    .string()
    .optional()
    .transform((val) => (val === undefined ? 50 : Number(val)))
    .pipe(z.number().int().positive().max(100)),
  skip: z
    .string()
    .optional()
    .transform((val) => (val === undefined ? 0 : Number(val)))
    .pipe(z.number().int().nonnegative()),
});

export type GetItemsQuery = z.infer<typeof getItemsQuerySchema>;

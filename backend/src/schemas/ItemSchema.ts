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

export const getItemByIdResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  priceCents: z.number().int(),
  oldPriceCents: z.number().int().nullable(),
  condition: z.string(),
  sold: z.boolean(),
  createdAt: z.date(),

  category: z.object({
    slug: z.string(),
    name: z.string(),
  }),

  shop: z.object({
    id: z.string(),
    name: z.string(),
    subline: z.string().nullable(),

    owner: z.object({
      id: z.string(),
      name: z.string(),
      avatarUrl: z.string().nullable(),
    }),
  }),

  photos: z.array(
    z.object({
      id: z.string(),
      url: z.string(),
      position: z.number().int().nonnegative(),
    })
  ),
});

export const getItemByIdRequestSchema = z.object({
  id: z.uuid(),
});

export type GetItemsQuery = z.infer<typeof getItemsQuerySchema>;
export type GetItemById = z.infer<typeof getItemByIdResponseSchema>;
export type GetItemByIdParams = z.infer<typeof getItemByIdRequestSchema>;

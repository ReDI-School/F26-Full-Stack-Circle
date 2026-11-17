import { z } from 'zod';

export const createItemSchema = z.object({
  title: z
    .string({ error: 'Title is required.' })
    .trim()
    .min(3, 'Title must be at least 3 characters.')
    .max(120, 'Title must be at most 120 characters.'),
  description: z
    .string({ error: 'Description is required.' })
    .trim()
    .max(2000, 'Description must be at most 2000 characters.'),
  priceCents: z
    .number({ error: 'Price must be a number of cents.' })
    .int('Price must be a whole number of cents.')
    .min(0, 'Price cannot be negative.')
    .max(1_000_000, 'Price must be at most 1000000 cents.'),
  condition: z.enum(['NEW', 'LIKE_NEW', 'GOOD', 'USED'], {
    error: 'Condition must be NEW, LIKE_NEW, GOOD or USED.',
  }),
  categoryId: z.uuid({ error: 'Choose a valid category ID.' }),
  photoUrls: z
    .array(
      z.url({
        protocol: /^https?$/,
        error: 'Each photo must be a valid HTTP or HTTPS URL.',
      }),
      { error: 'Photos must be an array of URLs.' }
    )
    .max(5, 'You can add at most 5 photos.')
    .optional(),
});

export type CreateItemInput = z.infer<typeof createItemSchema>;

// PATCH:

export const updateItemSchema = createItemSchema.partial().extend({
  oldPriceCents: z
    .null({ error: 'Old price is set by the server; send null to remove the discount.' })
    .optional(),
});

export type UpdateItemInput = z.infer<typeof updateItemSchema>;

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

import { z } from 'zod';

export const getShopsQuerySchema = z.object({
  take: z
    .string()
    .optional()
    .transform((val) => (val === undefined ? undefined : Number(val)))
    .pipe(z.number().int().positive().max(50).optional()),
});

export const getShopParamsSchema = z.object({
  id: z.uuid({ error: 'Shop ID must be a valid UUID.' }),
});

export type GetShopsQuery = z.infer<typeof getShopsQuerySchema>;
export type GetShopParams = z.infer<typeof getShopParamsSchema>;

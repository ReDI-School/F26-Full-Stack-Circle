import { z } from 'zod';

export const getShopsQuerySchema = z.object({
  take: z.coerce.number().int().positive().max(50).optional(),
});

export const getShopParamsSchema = z.object({
  id: z.uuid(),
});

export type GetShopsQuery = z.infer<typeof getShopsQuerySchema>;
export type GetShopParams = z.infer<typeof getShopParamsSchema>;

import { z } from '@/libs/zod';

export const getShopsQuerySchema = z.object({
  take: z.coerce
    .number()
    .int()
    .positive()
    .max(50)
    .optional()
    .openapi({
      param: { name: 'take', in: 'query' },
      description: 'Max number of shops to return',
      example: 4,
    }),
});

export const getShopParamsSchema = z.object({
  id: z.uuid().openapi({
    param: { name: 'id', in: 'path' },
    example: '3f1c2a9e-8b7d-4c6e-9f10-2a3b4c5d6e7f',
  }),
});

export type GetShopsQuery = z.infer<typeof getShopsQuerySchema>;
export type GetShopParams = z.infer<typeof getShopParamsSchema>;

import { z } from '@/libs/zod';
import { registry, errorResponse } from './registry';
import { getShopParamsSchema, getShopsQuerySchema } from '@/schemas/ShopSchema';

const ShopOwnerSchema = registry.register(
  'ShopOwner',
  z.object({
    id: z.uuid(),
    name: z.string(),
    avatarUrl: z.string().nullable(),
  }),
);

const ShopListItemSchema = registry.register(
  'ShopListItem',
  z.object({
    id: z.uuid(),
    name: z.string().openapi({ example: 'Second Chance Books' }),
    owner: ShopOwnerSchema,
    itemCount: z
      .number()
      .int()
      .openapi({ description: 'Number of unsold items', example: 12 }),
  }),
);

const ItemCardSchema = registry.register(
  'ItemCard',
  z.object({
    id: z.uuid(),
    title: z.string().openapi({ example: 'Vintage desk lamp' }),
    priceCents: z.number().int().openapi({ example: 1500 }),
    oldPriceCents: z.number().int().nullable().openapi({ example: 2500 }),
    condition: z.string().openapi({ example: 'GOOD' }),
    sold: z.boolean(),
    category: z.object({
      slug: z.string().openapi({ example: 'home' }),
      name: z.string().openapi({ example: 'Home' }),
    }),
    shop: z.object({
      id: z.uuid(),
      name: z.string(),
    }),
    photos: z.array(z.object({ url: z.string() })).openapi({
      description: 'Ordered by position',
    }),
  }),
);

const ShopDetailSchema = registry.register(
  'ShopDetail',
  z.object({
    id: z.uuid(),
    name: z.string(),
    subline: z.string().nullable(),
    owner: ShopOwnerSchema,
    items: z.array(ItemCardSchema).openapi({
      description: 'All items including sold ones, newest first',
    }),
  }),
);

registry.registerPath({
  method: 'get',
  path: '/shops',
  tags: ['Shops'],
  summary: 'List shops that have unsold items',
  description:
    'Sorted by itemCount (descending), ties by name. Shops without unsold items are excluded.',
  request: { query: getShopsQuerySchema },
  responses: {
    200: {
      description: 'List of shops',
      content: { 'application/json': { schema: z.array(ShopListItemSchema) } },
    },
    400: errorResponse('Invalid take'),
  },
});

registry.registerPath({
  method: 'get',
  path: '/shops/{id}',
  tags: ['Shops'],
  summary: 'Get a shop with all its items',
  request: { params: getShopParamsSchema },
  responses: {
    200: {
      description: 'Shop details',
      content: { 'application/json': { schema: ShopDetailSchema } },
    },
    400: errorResponse('Invalid id'),
    404: errorResponse('Shop not found'),
  },
});
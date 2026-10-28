// src/docs/registry.ts
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from '@/libs/zod';

export const registry = new OpenAPIRegistry();

export const ErrorResponseSchema = registry.register(
  'ErrorResponse',
  z.object({
    error: z.object({
      code: z.string().openapi({ example: 'NOT_FOUND' }),
      message: z.string().openapi({ example: 'Shop not found' }),
      details: z.unknown().optional(),
    }),
  })
);

export function errorResponse(description: string) {
  return {
    description,
    content: { 'application/json': { schema: ErrorResponseSchema } },
  };
}

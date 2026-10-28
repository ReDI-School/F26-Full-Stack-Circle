import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { registry } from './registry';

// Each module's docs file registers its paths on import
import './shop.docs';

export function buildOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'ReDiCycle API',
      version: '1.0.0',
    },
    servers: [{ url: '/api' }],
  });
}
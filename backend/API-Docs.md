# API Documentation (Swagger / OpenAPI)

Our backend API docs are generated from the same **Zod schemas** we use for validation.
One source of truth: change a validation rule, and the docs update with it.

- Swagger UI: `http://localhost:<PORT>/api/docs`
- Raw OpenAPI JSON: `http://localhost:<PORT>/api/docs.json`

Both are only served when `NODE_ENV !== 'production'`.

Libraries: [`@asteasolutions/zod-to-openapi`](https://github.com/asteasolutions/zod-to-openapi) + `swagger-ui-express`.

---

## What is automatic and what is not

| Automatic                                                                      | Manual (your job)                                                                                         |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| Request validation rules (types, min/max, uuid, optional…) show up in the docs | Every endpoint must be **registered** in a docs file. Express routes are **not** picked up automatically. |
| Reused schemas appear under "Schemas"                                          | **Response schemas** must be written by hand and kept in sync with the Prisma `select` in the service.    |

If you forget to register an endpoint or import a docs file, it silently disappears from Swagger. No error.

---

## File overview

| File                            | What it does                                              | When to touch it                      |
| ------------------------------- | --------------------------------------------------------- | ------------------------------------- |
| `src/libs/zod.ts`               | Extends Zod with `.openapi()` and re-exports `z`          | Never                                 |
| `src/schemas/<Module>Schema.ts` | Request validation (params, query, body) + param metadata | Every new module                      |
| `src/docs/registry.ts`          | Central registry, shared error shape, shared components   | Only for things shared across modules |
| `src/docs/<module>.docs.ts`     | Endpoints and response schemas of one module              | Every new module                      |
| `src/docs/openapi.ts`           | Imports all docs files and builds the document            | One import line per module            |
| `src/index.ts`                  | Serves Swagger UI (mounted **before** `helmet`)           | Never                                 |

### How it works at runtime

1. The server starts and calls `buildOpenApiDocument()`.
2. `openapi.ts` imports every `*.docs.ts` file.
3. Each docs file registers its endpoints on the shared `registry` when imported.
4. The generator turns the registry into an OpenAPI 3.0 document.
5. Swagger UI renders it at `/api/docs`.

---

## Rule #1: always import Zod from `@/libs/zod`

```ts
// ✅
import { z } from '@/libs/zod';

// ❌ — .openapi() will not exist
import { z } from 'zod';
```

This applies to the whole backend, not only to docs files.

---

## Adding a new module (4 steps)

Example: a `categories` module.

### 1. Schema file — `src/schemas/CategorySchema.ts`

One schema file per module (shared by its controller and service).
Add `.openapi({ param: ... })` to path and query params.

```ts
import { z } from '@/libs/zod';

export const getCategoryParamsSchema = z.object({
  slug: z.string().openapi({
    param: { name: 'slug', in: 'path' },
    example: 'home',
  }),
});

export type GetCategoryParams = z.infer<typeof getCategoryParamsSchema>;
```

### 2. Docs file — `src/docs/category.docs.ts`

Write the response schemas from the Prisma `select` in the service, then register the endpoints.

```ts
import { z } from '@/libs/zod';
import { registry, errorResponse } from './registry';
import { getCategoryParamsSchema } from '@/schemas/CategorySchema';

const CategorySchema = registry.register(
  'Category',
  z.object({
    id: z.uuid(),
    slug: z.string(),
    name: z.string(),
    emoji: z.string(),
    tint: z.number().int().min(0).max(2),
  })
);

registry.registerPath({
  method: 'get',
  path: '/categories/{slug}',
  tags: ['Categories'],
  summary: 'Get a category by slug',
  request: { params: getCategoryParamsSchema },
  responses: {
    200: {
      description: 'The category',
      content: { 'application/json': { schema: CategorySchema } },
    },
    400: errorResponse('Invalid slug'),
    404: errorResponse('Category not found'),
  },
});
```

For a request body, use:

```ts
request: {
  body: {
    content: { 'application/json': { schema: createCategoryBodySchema } },
  },
},
```

### 3. Import it — `src/docs/openapi.ts`

```ts
import './shop.docs';
import './category.docs'; // ← add this line
```

### 4. Test it

```bash
pnpm dev
```

Open `/api/docs`, use **Try it out** on each endpoint, and check that the real response matches the documented schema.

---

## Conventions

- **Path params use `{id}`, not `:id`.** Express: `/shops/:id` → Docs: `/shops/{id}`.
- **Don't duplicate request schemas.** Import the existing validation schema into the docs file.
- **Errors:** always use `errorResponse('...')` from `registry.ts`. It documents our error shape:
  ```json
  { "error": { "code": "NOT_FOUND", "message": "Shop not found", "details": null } }
  ```
- **Shared shapes live in one place.** If two modules return the same shape (e.g. `ItemCard`), move it to a shared docs file and import it. Don't copy it.
- **Protected endpoints** get the cookie security scheme:
  ```ts
  security: [{ cookieAuth: [] }],
  ```
  (The scheme is registered once in `registry.ts`.)
- **Use `tags`** with the module name so Swagger groups endpoints.
- **Show what the API actually returns.** If the service maps a value (e.g. `LIKE_NEW` → `'like-new'`), document the mapped value.

---

## When you change an existing endpoint

| You changed…                             | Also update…                              |
| ---------------------------------------- | ----------------------------------------- |
| The Prisma `select` in a service         | The response schema in `<module>.docs.ts` |
| A validation rule in `<Module>Schema.ts` | Nothing, docs update automatically        |
| A route path or HTTP method              | `path` / `method` in `registerPath`       |
| A status code (new 403, 409…)            | `responses` in `registerPath`             |

---

## PR checklist

```markdown
- [ ] New/changed endpoints are registered in `src/docs/<module>.docs.ts`
- [ ] New docs file is imported in `src/docs/openapi.ts`
- [ ] Response schemas match the Prisma `select` in the service
- [ ] Endpoint tried in Swagger UI at `/api/docs`
```

---

## Troubleshooting

| Problem                            | Likely cause                                                                      |
| ---------------------------------- | --------------------------------------------------------------------------------- |
| `.openapi is not a function`       | Zod imported from `'zod'` instead of `'@/libs/zod'`                               |
| Endpoint missing in Swagger        | Not registered, or docs file not imported in `openapi.ts`                         |
| Swagger UI is a blank page         | Docs route mounted after `helmet()` (CSP blocks it)                               |
| Path param not shown / shown twice | Path uses `:id` instead of `{id}`, or param is missing `.openapi({ param: ... })` |

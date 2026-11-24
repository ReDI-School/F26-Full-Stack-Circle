# Create an item

`POST /api/items` lists an item in the signed-in user's shop. The request uses the
HTTP-only login cookie from `POST /api/auth/login` or `POST /api/auth/register`.
Browser clients must include credentials when calling the API on another origin.

## Request

```json
{
  "title": "Oak bedside table",
  "description": "A small table with one drawer, ready for collection.",
  "priceCents": 2500,
  "condition": "GOOD",
  "categoryId": "128a5a09-f22d-41e5-a652-407f3e360ae1",
  "photoUrls": ["https://example.com/table-front.jpg", "https://example.com/table-side.jpg"]
}
```

Use an actual `categoryId` from `GET /api/categories`. IDs are UUID strings in the
current database, including category IDs. Numeric IDs and category slugs are not
accepted by this endpoint.

| Field         | Rules                                                                             |
| ------------- | --------------------------------------------------------------------------------- |
| `title`       | Required string, trimmed, 3–120 characters                                        |
| `description` | Required string, trimmed, at most 2000 characters; an empty string is allowed     |
| `priceCents`  | Required integer from 0 through 1,000,000; 0 means free                           |
| `condition`   | `NEW`, `LIKE_NEW`, `GOOD` or `USED`                                               |
| `categoryId`  | UUID of an existing category                                                      |
| `photoUrls`   | Optional array of up to five HTTP or HTTPS URLs; omitted or empty means no photos |

The server uses `req.user.shop.id` for ownership. Unknown fields, including
`shopId`, `sold`, `oldPriceCents` and `id`, are ignored. Photo uploads are outside
this endpoint's scope; the URLs are stored without downloading their contents.
Photos keep the supplied order, with positions starting at 0. The item and all
its photos are saved together.

## Responses

**201:** `{ "item": { ... } }`, with the same fields as `GET /api/items/:id`:
`id`, `title`, `description`, `priceCents`, `oldPriceCents`, `condition`, `sold`,
`createdAt`, `category`, `shop` (including its public owner), and ordered `photos`.
`createdAt` is an ISO timestamp in JSON. Newly listed items have `sold: false` and
`oldPriceCents: null`; no private user fields are exposed.

**400:** All invalid fields are reported in one response, including an unknown
category when other fields also fail. The `photoUrls` key identifies errors in
any photo URL or the photo count.

```json
{
  "error": "Validation failed",
  "fields": {
    "title": "Title must be at least 3 characters.",
    "priceCents": "Price cannot be negative.",
    "categoryId": "Category does not exist."
  }
}
```

**401:** `{ "error": "You need to log in." }` for a missing, invalid or expired
login cookie. Authentication runs before item validation.

**403:** `{ "error": "You need a shop to list an item." }` if a signed-in account
has no shop. Normal registration creates the shop automatically.

The created item is immediately available from `GET /api/items/:id`,
`GET /api/items` and `GET /api/items?shopId=<signed-in-shop-id>`.

## Local verification

Start the backend against a disposable local database, apply the existing
migrations and seed it, then run:

```sh
TASK35_API_URL=http://127.0.0.1:4000/api pnpm --filter backend test:create-item
```

The suite requires an explicit loopback URL, creates temporary accounts,
and cleans up those accounts and their items. It exercises the HTTP endpoint,
cookie authentication, persisted item details, browse and shop filters,
ownership, validation boundaries, aggregated errors, and photo ordering.

To try the endpoint manually with a local seeded account:

```sh
curl -sS -c /tmp/redicycle-item-cookies \
  -H 'Content-Type: application/json' \
  -d '{"email":"lena@redi-school.org","password":"redicycle123"}' \
  http://localhost:4000/api/auth/login

curl -sS http://localhost:4000/api/categories

# Replace categoryId with a UUID returned above.
curl -i -b /tmp/redicycle-item-cookies \
  -H 'Content-Type: application/json' \
  -d '{"title":"Oak bedside table","description":"Ready for collection.","priceCents":2500,"condition":"GOOD","categoryId":"128a5a09-f22d-41e5-a652-407f3e360ae1"}' \
  http://localhost:4000/api/items
```

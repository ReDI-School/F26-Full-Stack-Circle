export const categories = [
  { id: 'c1cb48bd-1fc3-4a8a-884a-769a9cccb031', name: 'Clothing', slug: 'clothing' },
  { id: 'c1cb48bd-1fc3-4a8a-884a-769a9cccb032', name: 'Books', slug: 'books' },
  { id: 'c1cb48bd-1fc3-4a8a-884a-769a9cccb033', name: 'Electronics', slug: 'electronics' },
  { id: 'c1cb48bd-1fc3-4a8a-884a-769a9cccb034', name: 'Home', slug: 'home' },
  { id: 'c1cb48bd-1fc3-4a8a-884a-769a9cccb035', name: 'Sports', slug: 'sports' },
] as const;

export const conditions = [
  { value: 'NEW', label: 'New' },
  { value: 'LIKE_NEW', label: 'Like new' },
  { value: 'GOOD', label: 'Good' },
  { value: 'USED', label: 'Used' },
] as const;

export type CreateItemRequest = {
  title: string;
  description: string;
  priceCents: number;
  condition: (typeof conditions)[number]['value'];
  categoryId: string;
  photoUrls?: string[];
};

export const initialItem: CreateItemRequest = {
  title: 'Ceramic plant pot',
  description: 'A favourite from my windowsill. Glazed ceramic, 16 cm wide, with a drainage hole.',
  priceCents: 1200,
  condition: 'GOOD',
  categoryId: categories[3].id,
};

// Story fixtures only: no requests, credentials or database records are created.
export const mockCreateItemResponse = (request: CreateItemRequest) => {
  if (!Number.isFinite(request.priceCents)) {
    return {
      status: 400 as const,
      body: {
        error: 'Validation failed',
        fields: { priceCents: 'Price must be a number of cents.' },
      },
    };
  }

  const category = categories.find(({ id }) => id === request.categoryId) ?? categories[3];

  return {
    status: 201 as const,
    body: {
      item: {
        id: '96b29bca-a0f5-4d97-ab68-cc9ee7f5f721',
        title: request.title.trim(),
        description: request.description.trim(),
        priceCents: request.priceCents,
        oldPriceCents: null,
        condition: request.condition,
        sold: false,
        createdAt: '2026-11-01T12:00:00.000Z',
        category: { name: category.name, slug: category.slug },
        shop: {
          id: 'be0223f7-6e56-4c31-8242-17c592c2dab8',
          name: "Lena's shop",
          subline: 'Little things, a second life.',
          owner: { id: 'c08eb936-0ffa-45f0-9c5a-d7dd6b9c90a8', name: 'Lena', avatarUrl: null },
        },
        photos: (request.photoUrls ?? []).map((url, position) => ({
          id: `677b67c3-eeb0-4a18-b3bb-988995b4230${position}`,
          url,
          position,
        })),
      },
    },
  };
};

export type CreateItemResponse =
  | ReturnType<typeof mockCreateItemResponse>
  | { status: 400; body: { error: string; fields: Record<string, string> } }
  | { status: 401 | 403; body: { error: string } };

export const VARIANTS = {
  condition: ['NEW', 'LIKE_NEW', 'GOOD', 'USED'] as const,
  size: ['sm', 'md'] as const,
};
export type TCondition = (typeof VARIANTS.condition)[number];
export const LABELS: Record<TCondition, string> = {
  NEW: '✦ New',
  LIKE_NEW: 'Like new',
  GOOD: 'Good',
  USED: 'Used',
};

export type TSize = (typeof VARIANTS.size)[number];

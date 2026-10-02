export const CONDITIONS = {
  new: {
    param: 'NEW',
    variant: 'new',
    label: '✦ New',
  },
  likeNew: {
    param: 'LIKE_NEW',
    variant: 'like-new',
    label: 'Like New',
  },
  good: {
    param: 'GOOD',
    variant: 'good',
    label: 'Good',
  },
  used: {
    param: 'USED',
    variant: 'used',
    label: 'Used',
  },
} as const;

export const SIZES = {
  sm: { param: 'sm', size: 'small' },
  md: { param: 'md', size: 'medium' },
} as const;

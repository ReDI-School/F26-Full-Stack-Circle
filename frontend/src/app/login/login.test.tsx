import React from 'react';
import { vi } from 'vitest';

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: React.ComponentProps<'a'> & { href: string }) =>
    React.createElement('a', { href, ...props }, children),
}));

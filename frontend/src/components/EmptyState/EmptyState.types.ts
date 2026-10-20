import type { ReactNode } from 'react';

export interface EmptyStateProps {
    emoji?: string;
    title: string;
    description?: string;
    action?: ReactNode;
    variant?: 'plain' | 'boxed';
}
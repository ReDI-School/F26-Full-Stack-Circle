'use client';

import { useEffect, useRef } from 'react';
import { Button } from '../components/Button';
import { CategoryTile } from '../components/CategoryTile';
import { EmptyState } from '../components/EmptyState';
import { useApi, useToast } from '../hooks';

type Category = {
  id: string;
  name: string;
  emoji: string;
  tint: number;
  itemCount: number;
};

const tints = ['primary', 'secondary', 'tertiary'] as const;

/** Small real-API example for #47; the full browse experience belongs to #48/#50. */
const HomeCategories = () => {
  const { data, error, loading, refetch } = useApi<{ categories: Category[] }>('/categories');
  const toast = useToast();
  const notifyOnCompletion = useRef(false);

  useEffect(() => {
    if (loading || !notifyOnCompletion.current) return;
    notifyOnCompletion.current = false;
    if (error) toast.error('Unable to refresh categories. Please try again.');
    else toast.success('Categories updated.');
  }, [data, error, loading, toast]);

  const refresh = () => {
    notifyOnCompletion.current = true;
    refetch();
  };

  return (
    <section aria-labelledby="categories-heading" className="mt-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <h2 id="categories-heading">Explore categories</h2>
        <Button variant="ghost" size="sm" disabled={loading} onClick={refresh}>
          {loading ? 'Loading categories…' : error ? 'Try again' : 'Refresh categories'}
        </Button>
      </div>
      <div aria-busy={loading}>
        {loading ? (
          <div role="status" aria-label="Loading categories">
            <span className="sr-only">Loading categories…</span>
            <div aria-hidden="true" className="flex flex-wrap gap-3">
              {Array.from({ length: 5 }, (_, index) => (
                <div
                  key={index}
                  className="h-16 w-40 rounded-pill bg-border motion-safe:animate-pulse"
                />
              ))}
            </div>
          </div>
        ) : error ? (
          <p role="alert" className="text-danger-text">
            We couldn&apos;t load categories. Please try again.
          </p>
        ) : !data?.categories.length ? (
          <EmptyState
            emoji="📦"
            title="No categories are available yet."
            description="Please check back soon."
          />
        ) : (
          <ul className="flex flex-wrap gap-3" aria-label="Categories">
            {data.categories.map((category) => (
              <li key={category.id} className="flex flex-col items-center gap-2">
                <CategoryTile
                  name={category.name}
                  emoji={category.emoji}
                  tint={tints[category.tint] ?? 'primary'}
                  onClick={() =>
                    toast.success(`${category.name}: ${category.itemCount} items available.`)
                  }
                />
                <span className="text-caption text-muted">{category.itemCount} items</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default HomeCategories;

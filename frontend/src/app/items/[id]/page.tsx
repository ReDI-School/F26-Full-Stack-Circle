import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import ItemDetail, { type ItemDetailData } from './ItemDetail';

interface ItemResponse {
  item: ItemDetailData;
}

/** Use the backend directly in development and the current deployment origin in production. */
const getApiOrigin = async (): Promise<string> => {
  if (process.env.API_INTERNAL_URL) return process.env.API_INTERNAL_URL.replace(/\/$/, '');
  if (process.env.NODE_ENV !== 'production') return 'http://localhost:4000';

  const requestHeaders = await headers();
  const host = requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host');
  const protocol = requestHeaders.get('x-forwarded-proto') ?? 'https';
  if (!host) throw new Error('Unable to determine the application origin.');
  return `${protocol}://${host}`;
};

const getItem = async (id: string): Promise<ItemDetailData | null> => {
  const origin = await getApiOrigin();
  const response = await fetch(`${origin}/api/items/${encodeURIComponent(id)}`, {
    cache: 'no-store',
  });

  if (response.status === 404 || response.status === 400) return null;
  if (!response.ok) throw new Error(`Unable to load item (${response.status}).`);

  const result = (await response.json()) as ItemResponse;
  return result.item;
};

interface ItemPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ItemPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const item = await getItem(id);
    if (!item) return { title: 'Item not found' };
    return {
      title: item.title,
      description: item.description.slice(0, 160),
      openGraph: { title: item.title, description: item.description.slice(0, 160) },
    };
  } catch {
    return { title: 'Item details' };
  }
}

export default async function ItemPage({ params }: ItemPageProps) {
  const { id } = await params;
  const item = await getItem(id);
  if (!item) notFound();
  return <ItemDetail item={item} />;
}

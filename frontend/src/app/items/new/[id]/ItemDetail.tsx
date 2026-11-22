'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Avatar, ConditionBadge, ImageSlot } from '@/components';
import { formatPrice } from '@/lib/price';

export interface ItemDetailData {
  id: string;
  title: string;
  description: string;
  priceCents: number;
  oldPriceCents: number | null;
  condition: 'NEW' | 'LIKE_NEW' | 'GOOD' | 'USED';
  sold: boolean;
  category: { slug: string; name: string };
  shop: {
    id: string;
    name: string;
    subline: string | null;
    owner: { id: string; name: string; avatarUrl: string | null };
  };
  photos: { id: string; url: string; position: number }[];
}

interface ItemDetailProps {
  item: ItemDetailData;
}

const ItemDetail = ({ item }: ItemDetailProps) => {
  const [activePhoto, setActivePhoto] = useState(0);
  const photos = item.photos ?? [];
  const selectedPhoto = photos[activePhoto]?.url;
  const hasDiscount = item.oldPriceCents !== null && item.oldPriceCents > item.priceCents;

  return (
    <div className="mx-auto w-full max-w-[1076px] px-8 py-7 pb-20">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-body font-semibold text-ink transition-colors hover:text-primary"
      >
        <span aria-hidden="true">←</span> Back to browse
      </Link>

      <div className="grid grid-cols-1 items-start gap-8 min-[800px]:grid-cols-[1.1fr_1fr]">
        <section aria-label="Item photos" className="min-w-0">
          <div className="relative h-[420px] overflow-hidden rounded-[24px] border border-border bg-bg">
            {selectedPhoto ? (
  <>
    {/* eslint-disable-next-line @next/next/no-img-element -- item photos may come from any seller-hosted URL. */}
    <img
      src={selectedPhoto}
      alt={item.title}
      className="h-full w-full object-cover"
    />
  </>
) : (
  <ImageSlot
    value={null}
    alt={item.title}
    placeholder="No photos available"
    className="flex h-full w-full items-center justify-center rounded-[24px] bg-[repeating-linear-gradient(135deg,#f5f7f8_0px,#f5f7f8_10px,#e9eff1_10px,#e9eff1_20px)]"
  />
)}
          </div>

          <div className="mt-3 flex gap-3">
            {Array.from({ length: Math.max(3, photos.length) }, (_, index) => index).map(
              (index) => {
                const photo = photos[index];
                if (!photo) {
                  return (
                    <div
                      key={`more-${index}`}
                      className="flex h-[84px] flex-1 items-center justify-center rounded-[14px] border border-dashed border-border text-caption font-semibold text-muted"
                    >
                      + more
                    </div>
                  );
                }
                return (
                  <button
                    key={photo.id}
                    type="button"
                    aria-label={`Show photo ${index + 1}`}
                    aria-pressed={activePhoto === index}
                    onClick={() => setActivePhoto(index)}
                    className={`relative h-[84px] min-w-0 flex-1 overflow-hidden rounded-[14px] border transition-colors ${activePhoto === index ? 'border-primary' : 'border-border hover:border-primary'}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- seller photo URLs are not restricted to configured image hosts. */}
                    <img
                      src={photo.url}
                      alt={`${item.title}, photo ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                );
              }
            )}
          </div>
        </section>

        <section className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <ConditionBadge condition={item.condition} />
            <span className="inline-flex rounded-pill border-[1.5px] border-[#cfdee4] bg-white px-3.5 py-1.5 text-caption font-semibold text-ink">
              {item.category.name}
            </span>
          </div>

          <h1 className="font-display text-[34px] leading-tight font-black tracking-[-0.5px] text-ink">
            {item.title}
          </h1>

          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-[32px] leading-none font-extrabold text-ink">
              {formatPrice(item.priceCents)}
            </span>
            {hasDiscount && (
              <span className="text-[17px] text-muted line-through">
                {formatPrice(item.oldPriceCents as number)}
              </span>
            )}
          </div>

          <p className="whitespace-pre-wrap text-[15px] leading-[1.65] text-body">
            {item.description}
          </p>

          <div className="mt-2 flex flex-col gap-3.5 rounded-card border border-border bg-white p-5">
            <Link
              href={`/shops/${item.shop.id}`}
              className="group -m-2 flex items-center gap-3 rounded-input p-2 transition-colors hover:bg-bg"
            >
              <Avatar
                name={item.shop.owner.name}
                src={item.shop.owner.avatarUrl ?? undefined}
                size="md"
              />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 font-extrabold text-ink">
                  <span className="truncate">{item.shop.name}</span>
                  <span
                    aria-hidden="true"
                    className="text-primary transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
                <span className="block text-caption text-muted">Sells &amp; ships from Berlin</span>
              </span>
            </Link>

            {/* ITEM-DETAIL-STATE: sold notice / seller state block is owned by the next ticket. */}
            <div data-testid="item-detail-state-slot" className="hidden" aria-hidden="true" />
          </div>
        </section>
      </div>
    </div>
  );
};

export default ItemDetail;

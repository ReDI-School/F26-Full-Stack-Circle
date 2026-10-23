import type { Meta, StoryObj } from '@storybook/react-vite';

import ItemCard from './ItemCard';
import { ItemCardProps } from './ItemCard.types';

const meta: Meta<typeof ItemCard> = {
  title: 'Components/ItemCard',
  component: ItemCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'One item for sale. This is the most repeated component in the app: the home page rows, ' +
          'the browse results and every shop page are all grids of these.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ItemCard>;

export const Default: Story = {
  decorators: [],
  render: () => {
    const item: ItemCardProps = {
      title: 'Vintage Denim Jacket',
      priceCents: 4500,
      condition: 'GOOD' as ItemCardProps['condition'],
      category: 'Clothing',
      seller: 'Riddhi',
      imageUrl: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=600',
    };
    return (
      <div className="grid w-full max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">
        <ItemCard {...item} size="md" />
      </div>
    );
  },
};

export const Discounted: Story = {
  decorators: [],
  render: () => {
    const item: ItemCardProps = {
      title: 'Classic Leather Bag',
      priceCents: 1850,
      oldPriceCents: 2990,
      condition: 'NEW' as ItemCardProps['condition'],
      category: 'Accessories',
      seller: 'Maya',
      imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600',
    };
    return (
      <div className="grid w-full max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">
        <ItemCard {...item} size="md" />
      </div>
    );
  },
};

export const Free: Story = {
  decorators: [],
  render: () => {
    const item: ItemCardProps = {
      title: 'Free Coffee Table',
      priceCents: 0,
      oldPriceCents: undefined,
      condition: 'USED' as ItemCardProps['condition'],
      category: 'Furniture',
      seller: 'Alex',
      imageUrl: undefined,
    };
    return (
      <div className="grid w-full max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">
        <ItemCard {...item} size="md" />
      </div>
    );
  },
};

export const Sold: Story = {
  decorators: [],
  render: () => {
    const item: ItemCardProps = {
      title: 'Sold Winter Coat',
      priceCents: 2500,
      sold: true,
      condition: 'GOOD' as ItemCardProps['condition'],
      category: 'Clothing',
      seller: 'Maya',
    };
    return (
      <div className="grid w-full max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">
        <ItemCard {...item} size="md" />
      </div>
    );
  },
};

export const NoPhoto: Story = {
  decorators: [],
  render: () => {
    const item: ItemCardProps = {
      title: 'Ceramic Flower Vase',
      priceCents: 1200,
      imageUrl: undefined,
      condition: 'LIKE_NEW' as ItemCardProps['condition'],
      category: 'Home & Living',
      seller: 'Riddhi',
      size: 'sm',
    };
    return (
      <div className="grid w-full max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">
        <ItemCard {...item} size="md" />
      </div>
    );
  },
};

export const Small: Story = {
  decorators: [],
  render: () => {
    const item: ItemCardProps = {
      title: 'Beautiful Vintage Leather Jacket with Multiple Pockets',
      priceCents: 1850,
      oldPriceCents: 2500,
      condition: 'NEW' as ItemCardProps['condition'],
      size: 'sm',
      category: 'Clothing',
      seller: 'Riddhi',
      imageUrl: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=600',
    };
    return (
      <div className="grid w-full max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">
        <ItemCard {...item} />
      </div>
    );
  },
};

export const Grid: Story = {
  decorators: [],
  render: () => {
    const items: ItemCardProps[] = [
      {
        title: 'Denim Jacket',
        priceCents: 4500,
        condition: 'USED' as ItemCardProps['condition'],
        category: 'Clothing',
        seller: 'Alex',
        imageUrl: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=400',
      },
      {
        title: 'Vintage Leather Bag',
        priceCents: 1850,
        oldPriceCents: 2990,
        condition: 'GOOD' as ItemCardProps['condition'],
        category: 'Accessories',
        seller: 'Maya',
        imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600',
      },
      {
        title: 'Free Coffee Table',
        priceCents: 0,
        condition: 'NEW' as ItemCardProps['condition'],
        category: 'Furniture',
        seller: 'Alex',
        imageUrl: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=400',
      },
      {
        title: 'Winter Coat',
        priceCents: 3200,
        condition: 'LIKE_NEW' as ItemCardProps['condition'],
        category: 'Clothing',
        seller: 'Sam',
        sold: true,
        imageUrl: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=400',
      },
      {
        title: 'Ceramic Vase',
        priceCents: 1200,
        condition: 'LIKE_NEW' as ItemCardProps['condition'],
        category: 'Home & Living',
        seller: 'Riddhi',
      },
      {
        title: 'Beautiful Vintage Leather Jacket with Pockets',
        priceCents: 1850,
        condition: 'GOOD' as ItemCardProps['condition'],
        category: 'Clothing',
        seller: 'Maya',
        imageUrl: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=600',
      },
    ];

    return (
      <div className="grid w-full max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((item, index) => (
          <ItemCard key={`${item.title}-${index}`} {...item} size="md" />
        ))}
      </div>
    );
  },
};

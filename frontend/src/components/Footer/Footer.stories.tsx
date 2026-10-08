import type { Meta, StoryObj } from '@storybook/react-vite';

import Footer from './Footer';

const meta: Meta<typeof Footer> = {
  title: 'Components/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The four-column footer at the bottom of every browse screen. The links come in as ' +
          'props, so the page decides where they point.',
      },
    },
  },
  args: {
    categoryLinks: [
      { label: 'clothing', href: '/browse?category=clothing' },
      { label: 'books', href: '/browse?category=books' },
      { label: 'electronics', href: '/browse?category=electronics' },
      { label: 'home', href: '/browse?category=home' },
      { label: 'sports', href: '/browse?category=sports' },
    ],
    infoLinks: [
      { label: 'how to buy', href: '/how-to-buy' },
      { label: 'how to sell', href: '/how-to-sell' },
      { label: 'safety tips', href: '/safety' },
      { label: 'FAQ', href: '/faq' },
    ],
    accountLinks: [
      { label: 'my shop', href: '/login' },
      { label: 'account settings', href: '/login' },
      { label: 'sell an item', href: '/login' },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {};

/** Below 800px  */
export const Mobile: Story = {
  globals: {
    viewport: { value: 'mobile2', isRotated: false },
  },
};

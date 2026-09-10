import type { Meta, StoryObj } from '@storybook/react-vite';

import ShopCard from './ShopCard';

const meta: Meta<typeof ShopCard> = {
  title: 'Components/ShopCard',
  component: ShopCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "A person's shop in miniature — their avatar, the shop name and how many items they have " +
          "listed. Used in the 'shops we love' row on the home page.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ShopCard>;

export const Default: Story = {
  args: {
    name: "Lena's shop",
  },
};

// TODO: as you add props to ShopCard.types.ts, add a story for each variant and
// state so you can see them all side by side. Something like:
//
// export const WithItemCount: Story = {
//   args: { name: "Lena's shop", itemCount: 4 },
// };
//
// export const SingleItem: Story = {
//   args: { name: "Omar's shop", itemCount: 1 },
// };

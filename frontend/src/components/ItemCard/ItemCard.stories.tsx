import type { Meta, StoryObj } from '@storybook/react-vite';

import ItemCard from './ItemCard';

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
  args: {
    title: 'Vintage denim jacket',
  },
};

// TODO: as you add props to ItemCard.types.ts, add a story for each variant and
// state so you can see them all side by side. Something like:
//
// export const Jacket: Story = {
//   args: {
//     title: 'Vintage denim jacket',
//     price: 18,
//     condition: 'like-new',
//     category: 'Clothing',
//     seller: "Lena's shop",
//   },
// };
//
// export const Book: Story = {
//   args: {
//     title: 'JavaScript: The Good Parts',
//     price: 6,
//     condition: 'good',
//     category: 'Books',
//     seller: "Omar's shop",
//   },
// };

import type { Meta, StoryObj } from '@storybook/react-vite';

import StepCard from './StepCard';

const meta: Meta<typeof StepCard> = {
  title: 'Components/StepCard',
  component: StepCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'One numbered step on the info pages that explain how to buy, how to sell and how to stay ' +
          'safe.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof StepCard>;

export const Default: Story = {
  args: {
    title: 'Browse & find',
  },
};

// TODO: as you add props to StepCard.types.ts, add a story for each variant and
// state so you can see them all side by side. Something like:
//
// export const FirstStep: Story = {
//   args: {
//     step: 1,
//     title: 'Browse & find',
//     description:
//       'Search or wander the categories. Every item shows its condition, price, and the shop it belongs to.',
//   },
// };
//
// export const SecondStep: Story = {
//   args: {
//     step: 2,
//     title: 'Message the seller',
//     description:
//       'Agree on a price and a place to meet. ReDiCycle never touches the payment — that is between the two of you.',
//   },
// };

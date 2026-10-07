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
    markerType: 'number',
    step: 1,
    text: 'Search or wander the categories. Every item shows its condition, price, and the shop it belongs to.',
  },
};

export const HowToBuy: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <StepCard
        markerType="number"
        step={1}
        title="Browse & find"
        text="Search or wander the categories. Every item shows its condition, price, and the shop it belongs to."
      />

      <StepCard
        markerType="number"
        step={2}
        title="Say you're interested"
        text={
          'Tap "I\'m interested" on the item. The seller gets a notification and you get a thread in your inbox.'
        }
      />

      <StepCard
        markerType="number"
        step={3}
        title="Agree on the details"
        text="Chat about price, payment method, and whether it's pickup or shipping. Everything is between you two."
      />

      <StepCard
        markerType="number"
        step={4}
        title="Meet, pay, enjoy"
        text="Settle the payment however suits you both — cash on pickup or a bank transfer. ReDiCycle never touches the money."
      />
    </div>
  ),
};

export const StaySafe: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <StepCard
        title="Meet in public places"
        text="Cafés, train stations, campus — anywhere with people around. Bring a friend for bigger handovers."
      />

      <StepCard
        title="Check before you pay"
        text="Inspect the item at handover. Plug it in, try it on, flip through it — then pay."
      />

      <StepCard
        title="Keep chat on ReDiCycle"
        text="Agree on everything in your inbox thread, so there's a record if something goes sideways."
      />

      <StepCard
        title="Trust your gut"
        text="Deal feels off? Price too good? Walk away and report the listing — no explanation needed."
      />
    </div>
  ),
};

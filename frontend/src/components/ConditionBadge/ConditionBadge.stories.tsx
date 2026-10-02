import type { Meta, StoryObj } from '@storybook/react-vite';

import ConditionBadge from './ConditionBadge';

const meta: Meta<typeof ConditionBadge> = {
  title: 'Components/ConditionBadge',
  component: ConditionBadge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Tells a buyer what state an item is in. It sits on the top-left corner of the photo in ' +
          'an ItemCard, and again on the item detail page.',
      },
    },
  },
  argTypes: {
    condition: {
      control: 'select',
      options: ['NEW', 'LIKE_NEW', 'GOOD', 'USED'],
      description: 'The condition of the item',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'The size of badge',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ConditionBadge>;

export const Default: Story = {
  args: {
    condition: 'NEW',
  },
};

// TODO: as you add props to ConditionBadge.types.ts, add a story for each variant and
// state so you can see them all side by side. Something like:
//
export const AllConditions: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2.5">
      <ConditionBadge condition="NEW" />
      <ConditionBadge condition="LIKE_NEW" />
      <ConditionBadge condition="GOOD" />
      <ConditionBadge condition="USED" />
    </div>
  ),
};

export const Small: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2.5">
      <ConditionBadge condition="NEW" size="sm" />
      <ConditionBadge condition="LIKE_NEW" size="sm" />
      <ConditionBadge condition="GOOD" size="sm" />
      <ConditionBadge condition="USED" size="sm" />
    </div>
  ),
};

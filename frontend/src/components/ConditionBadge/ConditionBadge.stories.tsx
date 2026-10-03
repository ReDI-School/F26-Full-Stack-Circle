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
      table: {
        type: { summary: "'NEW' | 'LIKE_NEW' | 'GOOD' | 'USED'" },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'The size of the badge',
      table: {
        type: { summary: "'sm' | 'md'" },
        defaultValue: { summary: "'md'" },
      },
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

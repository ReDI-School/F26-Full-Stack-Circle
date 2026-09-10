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
};

export default meta;
type Story = StoryObj<typeof ConditionBadge>;

export const Default: Story = {
  args: {
    condition: 'like-new',
  },
};

// TODO: as you add props to ConditionBadge.types.ts, add a story for each variant and
// state so you can see them all side by side. Something like:
//
// export const AllConditions: Story = {
//   render: () => (
//     <div className="flex flex-wrap gap-2.5">
//       <ConditionBadge condition="new" />
//       <ConditionBadge condition="like-new" />
//       <ConditionBadge condition="good" />
//       <ConditionBadge condition="used" />
//     </div>
//   ),
// };

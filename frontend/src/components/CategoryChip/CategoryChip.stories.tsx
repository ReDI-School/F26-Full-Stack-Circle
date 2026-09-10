import type { Meta, StoryObj } from '@storybook/react-vite';

import CategoryChip from './CategoryChip';

const meta: Meta<typeof CategoryChip> = {
  title: 'Components/CategoryChip',
  component: CategoryChip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A small filter pill. Clicking one narrows the browse results to that category; clicking ' +
          'it again clears the filter.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CategoryChip>;

export const Default: Story = {
  args: {
    label: 'Clothing',
  },
};

// TODO: as you add props to CategoryChip.types.ts, add a story for each variant and
// state so you can see them all side by side. Something like:
//
// export const Selected: Story = {
//   args: { label: 'Books', selected: true },
// };
//
// export const ChipRow: Story = {
//   render: () => (
//     <div className="flex flex-wrap gap-2.5">
//       <CategoryChip label="Clothing" />
//       <CategoryChip label="Books" selected />
//       <CategoryChip label="Electronics" />
//       <CategoryChip label="Home" />
//       <CategoryChip label="Sports" />
//     </div>
//   ),
// };

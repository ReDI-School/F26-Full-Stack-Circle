import type { Meta, StoryObj } from '@storybook/react-vite';

import CategoryTile from './CategoryTile';

const meta: Meta<typeof CategoryTile> = {
  title: 'Components/CategoryTile',
  component: CategoryTile,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The big friendly category buttons on the home page — an emoji in a white circle next to ' +
          'the category name. Their background cycles through the three pale brand tints.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CategoryTile>;

export const Default: Story = {
  args: {
    name: 'clothing',
  },
};

// TODO: as you add props to CategoryTile.types.ts, add a story for each variant and
// state so you can see them all side by side. Something like:
//
// export const TileRow: Story = {
//   render: () => (
//     <div className="flex flex-wrap gap-3.5">
//       <CategoryTile name="clothing" emoji="👕" tint="primary" />
//       <CategoryTile name="books" emoji="📚" tint="secondary" />
//       <CategoryTile name="electronics" emoji="🔌" tint="tertiary" />
//       <CategoryTile name="home" emoji="🪴" tint="primary" />
//       <CategoryTile name="sports" emoji="⚽" tint="secondary" />
//     </div>
//   ),
// };
//
// export const Selected: Story = {
//   args: { name: 'books', emoji: '📚', selected: true },
// };

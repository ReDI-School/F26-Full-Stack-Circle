import type { Meta, StoryObj } from '@storybook/react-vite';

import Avatar from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The round picture of a person. When someone has no profile picture, it falls back to ' +
          'their initials on a brand colour picked from their name, so the same person is always ' +
          'the same colour.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    name: 'Lena Koch',
  },
};

// TODO: as you add props to Avatar.types.ts, add a story for each variant and
// state so you can see them all side by side. Something like:
//
// export const Sizes: Story = {
//   render: () => (
//     <div className="flex items-center gap-4">
//       <Avatar name="Lena Koch" size="sm" />
//       <Avatar name="Omar Mansour" size="md" />
//       <Avatar name="Priya Raman" size="lg" />
//     </div>
//   ),
// };
//
// export const WithPicture: Story = {
//   args: { name: 'Lena Koch', src: '/lena.jpg' },
// };

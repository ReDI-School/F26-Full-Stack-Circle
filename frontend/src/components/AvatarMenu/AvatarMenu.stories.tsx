import type { Meta, StoryObj } from '@storybook/react-vite';

import AvatarMenu from './AvatarMenu';

const meta: Meta<typeof AvatarMenu> = {
  title: 'Components/AvatarMenu',
  component: AvatarMenu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The dropdown that opens when you click your avatar in the navbar. It is the way into ' +
          'your shop, your account settings and, for admins, the admin screen.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AvatarMenu>;

export const Default: Story = {
  args: {
    items: ['My shop', 'Account settings', 'Admin', 'Log out'],
  },
};

// TODO: as you add props to AvatarMenu.types.ts, add a story for each variant and
// state so you can see them all side by side. Something like:
//
// export const WithActions: Story = {
//   args: {
//     items: [
//       { label: 'My shop', onClick: () => {} },
//       { label: 'Account settings', onClick: () => {} },
//       { label: 'Admin', onClick: () => {} },
//       { label: 'Log out', onClick: () => {}, danger: true, separated: true },
//     ],
//   },
// };

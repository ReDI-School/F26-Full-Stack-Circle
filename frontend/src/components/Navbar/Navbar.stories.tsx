import type { Meta, StoryObj } from '@storybook/react-vite';

import Navbar from './Navbar';

const meta: Meta<typeof Navbar> = {
  title: 'Components/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "The sticky bar at the top of every page. Signed in you get search, '+ Add item', your " +
          "inbox and your avatar; signed out you get 'Log in' and 'Start selling' instead.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Default: Story = {
  args: {
    userName: 'Lena Koch',
  },
};

// TODO: as you add props to Navbar.types.ts, add a story for each variant and
// state so you can see them all side by side. Something like:
//
// export const LoggedIn: Story = {
//   args: { userName: 'Lena Koch', unreadCount: 2 },
// };
//
// export const Guest: Story = {
//   args: {},
// };

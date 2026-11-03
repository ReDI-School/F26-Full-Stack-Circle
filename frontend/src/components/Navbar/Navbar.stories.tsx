import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, userEvent, within } from 'storybook/test';

import type { AvatarMenuEntry } from '../AvatarMenu';
import Navbar from './Navbar';

const AdminBadge = () => (
  <span
    aria-hidden="true"
    className="bg-secondary-100 text-danger-text inline-flex h-4 w-4 items-center justify-center rounded-[4px] text-[12px] font-extrabold"
  >
    A
  </span>
);

const user = { name: 'Lena Koch' };

const menuItems: AvatarMenuEntry[] = [
  { label: 'My shop', onClick: fn() },
  { label: 'Account settings', onClick: fn() },
  { type: 'divider' },
  { label: 'Log out', onClick: fn(), danger: true },
];

const adminMenuItems: AvatarMenuEntry[] = [
  { label: 'My shop', onClick: fn() },
  { label: 'Account settings', onClick: fn() },
  { label: 'Admin', icon: <AdminBadge />, onClick: fn() },
  { type: 'divider' },
  { label: 'Log out', onClick: fn(), danger: true },
];

const meta: Meta<typeof Navbar> = {
  title: 'Components/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  parameters: {
    // The bar is full-width, so render it edge to edge
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "The sticky bar at the top of every page. Signed in you get search, '+ Add item', your " +
          "inbox and your avatar; signed out you get 'Log in' and 'Start selling' instead.",
      },
    },
  },
  args: {
    onSearchChange: fn(),
    onSearch: fn(),
    onLogoClick: fn(),
    onAddItem: fn(),
    onInbox: fn(),
    onLogin: fn(),
    onRegister: fn(),
  },
  decorators: [
    (Story) => (
      // Leaves room below the bar for the avatar dropdown
      <div className="min-h-80">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Guest: Story = {
  args: {
    user: null,
  },
};

export const LoggedIn: Story = {
  args: {
    user,
    menuItems,
  },
};

export const LoggedInWithUnread: Story = {
  args: {
    user,
    menuItems,
    unreadCount: 2,
  },
};

/** Anything above 99 shows "99+" so the badge never pushes the layout around. */
export const LoggedInWithManyUnread: Story = {
  args: {
    user,
    menuItems,
    unreadCount: 128,
  },
};

/** The page passes an extra "Admin" entry; the Navbar itself knows nothing about roles. */
export const Admin: Story = {
  args: {
    user,
    menuItems: adminMenuItems,
    unreadCount: 2,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /account menu/i }));
  },
};

/** Below 800px the search field moves to its own full-width line. */
export const Mobile: Story = {
  args: {
    user,
    menuItems,
    unreadCount: 2,
  },
  globals: {
    viewport: { value: 'mobile2', isRotated: false },
  },
};

/** Scroll the canvas: the bar stays stuck to the top. */
export const StickyOnScroll: Story = {
  args: {
    user,
    menuItems,
    unreadCount: 2,
  },
  render: (args) => (
    <>
      <Navbar {...args} />
      <div className="mx-auto flex max-w-[1076px] flex-col gap-4 p-5">
        {Array.from({ length: 30 }, (_, index) => (
          <p key={index} className="bg-surface rounded-card p-5">
            Placeholder content {index + 1}
          </p>
        ))}
      </div>
    </>
  ),
};

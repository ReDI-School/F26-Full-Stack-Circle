import type { Meta, StoryObj } from '@storybook/react-vite';
import { StrictMode } from 'react';
import { fn, userEvent, within } from 'storybook/test';

import AvatarMenu from './AvatarMenu';
import type { AvatarMenuEntry } from './AvatarMenu.types';

const StorefrontIcon = () => (
  <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M232,96a7.89,7.89,0,0,0-.3-2.2L217.35,43.6A16.07,16.07,0,0,0,202,32H54A16.07,16.07,0,0,0,38.65,43.6L24.31,93.8A7.89,7.89,0,0,0,24,96h0v16a40,40,0,0,0,16,32v72a8,8,0,0,0,8,8H208a8,8,0,0,0,8-8V144a40,40,0,0,0,16-32V96ZM54,48H202l11.42,40H42.61Zm50,56h48v8a24,24,0,0,1-48,0Zm-16,0v8a24,24,0,0,1-35.12,21.26,7.88,7.88,0,0,0-1.82-1.06A24,24,0,0,1,40,112v-8ZM200,208H56V151.2a40.57,40.57,0,0,0,8,.8,40,40,0,0,0,32-16,40,40,0,0,0,64,0,40,40,0,0,0,32,16,40.57,40.57,0,0,0,8-.8Zm4.93-75.8a8.08,8.08,0,0,0-1.8,1.05A24,24,0,0,1,168,112v-8h48v8A24,24,0,0,1,204.93,132.2Z" />
  </svg>
);

const GearIcon = () => (
  <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z" />
  </svg>
);

const AdminBadge = () => (
  <span
    aria-hidden="true"
    className="bg-secondary-100 text-danger-text inline-flex h-4 w-4 items-center justify-center rounded-[4px] text-[12px] font-extrabold"
  >
    A
  </span>
);

const user = { name: 'Lena Koch' };

const mainItems: AvatarMenuEntry[] = [
  { label: 'My shop', icon: <StorefrontIcon />, onClick: fn() },
  { label: 'Account settings', icon: <GearIcon />, onClick: fn() },
];

const adminItem: AvatarMenuEntry = { label: 'Admin', icon: <AdminBadge />, onClick: fn() };

const logoutItems: AvatarMenuEntry[] = [
  { type: 'divider' },
  { label: 'Log out', onClick: fn(), danger: true },
];

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
  decorators: [
    (Story) => (
      <StrictMode>
        <div className="flex h-72 justify-end p-4">
          <Story />
        </div>
      </StrictMode>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AvatarMenu>;

const openMenu: Story['play'] = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole('button', { name: /account menu/i }));
};

export const Closed: Story = {
  args: {
    user,
    items: [...mainItems, ...logoutItems],
  },
};

export const Open: Story = {
  args: {
    user,
    items: [...mainItems, ...logoutItems],
  },
  play: openMenu,
};

export const OpenAsAdmin: Story = {
  args: {
    user,
    items: [...mainItems, adminItem, ...logoutItems],
  },
  play: openMenu,
};

export const Guest: Story = {
  args: {
    user: undefined,
    items: [...mainItems, ...logoutItems],
  },
};

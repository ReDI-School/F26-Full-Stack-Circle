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

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar name="Lena Koch" size="sm" />
      <Avatar name="Omar Mansour" size="md" />
      <Avatar name="Priya Raman" size="lg" />
    </div>
  ),
};

export const WithPicture: Story = {
  args: {
    name: 'Lena Koch',
    src: 'https://i.pravatar.cc/150?img=47',
  },
};

export const Colours: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar name="Lena Koch" />
      <Avatar name="Omar Mansour" />
      <Avatar name="Priya Raman" />
      <Avatar name="David Smith" />
      <Avatar name="Sarah Miller" />
      <Avatar name="Ahmed Hassan" />
    </div>
  ),
};
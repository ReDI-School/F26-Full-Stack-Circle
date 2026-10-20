import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../Button';
import EmptyState from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['plain', 'boxed'],
    },
    action: {
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof EmptyState>;

export const NoResults: Story = {
  args: {
    variant: 'plain',
    emoji: '🕵️',
    title: 'Nothing here yet',
    description: 'Try another search or category.',
  },
};

export const EmptyShop: Story = {
  args: {
    variant: 'boxed',
    emoji: '🧦',
    title: 'Your shop is empty',
    description: 'That drawer full of stuff you never use? List it!',
    action: (
      <Button type="button" variant="primary">
        + Add your first item
      </Button>
    ),
  },
};

export const NoMessages: Story = {
  args: {
    variant: 'plain',
    emoji: '📭',
    title: 'No messages yet',
    description:
      'Found something you like? Tap "I\'m interested" on an item.',
  },
};
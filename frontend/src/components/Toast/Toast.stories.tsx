import type { Meta, StoryObj } from '@storybook/react-vite';

import Toast from './Toast';

const meta: Meta<typeof Toast> = {
  title: 'Components/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The short message that slides up at the bottom of the screen to confirm something ' +
          'worked, or to explain why it did not.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  args: {
    message: "Item listed! It's live in your shop.",
  },
};

export const Success: Story = {
  args: { message: "Item listed! It's live in your shop.", variant: 'success' },
};

export const Error: Story = {
  args: { message: 'Wrong email or password.', variant: 'error' },
};

export const LongMessage: Story = {
  args: {
    message:
      'This is a really long toast message that should wrap onto multiple lines instead of running off the edge of the screen.',
    variant: 'success',
  },
};

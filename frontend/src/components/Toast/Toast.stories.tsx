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

// TODO: as you add props to Toast.types.ts, add a story for each variant and
// state so you can see them all side by side. Something like:
//
export const Success: Story = {
  args: { message: "Item listed! It's live in your shop.", variant: 'success' },
};

export const Error: Story = {
  args: { message: 'Wrong email or password.', variant: 'error' },
};

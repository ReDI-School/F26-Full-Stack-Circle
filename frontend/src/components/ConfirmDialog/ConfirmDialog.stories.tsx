import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import ConfirmDialog from './ConfirmDialog';

const meta: Meta<typeof ConfirmDialog> = {
  title: 'Components/ConfirmDialog',
  component: ConfirmDialog,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "The modal that asks 'are you sure?' before something irreversible — removing an item " +
          'from your shop, or deleting your account altogether.',
      },
    },
  },
  args: {
    open: true,
    description: 'This action cannot be undone.',
    onConfirm: fn(),
    onCancel: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ConfirmDialog>;

export const RemoveItem: Story = {
  args: {
    title: 'Remove this item?',
    description: 'It will disappear from your shop and from the browse pages.',
    cancelLabel: 'Keep it',
    confirmLabel: 'Remove it',
  },
};

export const DeleteAccount: Story = {
  args: {
    title: 'Delete your account?',
    description: "Your shop and all 4 listed items will be gone. This can't be undone.",
    cancelLabel: 'Keep it',
    confirmLabel: 'Delete',
  },
};

export const Closed: Story = {
  args: {
    open: false,
    title: 'Remove this item?',
    description: 'It will disappear from your shop and from the browse pages.',
    onCancel: fn(),
    onConfirm: fn(),
  },
};

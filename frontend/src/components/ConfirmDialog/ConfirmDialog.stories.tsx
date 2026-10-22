import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

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

// A story with a play function is also a test. Storybook renders it, then
// runs these steps like a user would, in a real browser.
export const EscapeCancels: Story = {
  args: {
    title: 'Remove this item?',
    cancelLabel: 'Keep it',
    confirmLabel: 'Remove it',
  },
  play: async ({ args, canvas, userEvent }) => {
    // The safe choice gets focus first, so Enter can't delete by accident.
    await expect(canvas.getByRole('button', { name: 'Keep it' })).toHaveFocus();

    await userEvent.keyboard('{Escape}');

    await expect(args.onCancel).toHaveBeenCalledOnce();
    await expect(args.onConfirm).not.toHaveBeenCalled();
  },
};

export const ConfirmCallsOnConfirm: Story = {
  args: {
    title: 'Delete your account?',
    cancelLabel: 'Keep it',
    confirmLabel: 'Delete',
  },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Delete' }));

    await expect(args.onConfirm).toHaveBeenCalledOnce();
  },
};

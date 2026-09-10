import type { Meta, StoryObj } from '@storybook/react-vite';

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
};

export default meta;
type Story = StoryObj<typeof ConfirmDialog>;

export const Default: Story = {
  args: {
    title: 'Delete your account?',
  },
};

// TODO: as you add props to ConfirmDialog.types.ts, add a story for each variant and
// state so you can see them all side by side. Something like:
//
// export const DeleteAccount: Story = {
//   args: {
//     open: true,
//     title: 'Delete your account?',
//     description: "Your shop and all 4 listed items will be gone. This can't be undone.",
//     cancelLabel: 'Keep it',
//     confirmLabel: 'Delete',
//   },
// };
//
// export const RemoveItem: Story = {
//   args: {
//     open: true,
//     title: 'Remove this item?',
//     description: 'It will disappear from your shop and from the browse pages.',
//     cancelLabel: 'Keep it',
//     confirmLabel: 'Remove',
//   },
// };

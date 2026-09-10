import type { Meta, StoryObj } from '@storybook/react-vite';

import Button from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The button used everywhere in ReDiCycle. It is always a pill. `primary` is the orange ' +
          'one that asks for the main action, `secondary` the dark teal one, `ghost` the outlined ' +
          'one for cancelling, and `danger` the soft red one for destructive actions.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Add item',
  },
};

// TODO: as you add props to Button.types.ts, add a story for each variant and
// state so you can see them all side by side. Something like:
//
// export const Variants: Story = {
//   render: () => (
//     <div className="flex flex-wrap items-center gap-3.5">
//       <Button variant="primary">Add item</Button>
//       <Button variant="secondary">Contact seller</Button>
//       <Button variant="ghost">Cancel</Button>
//       <Button variant="danger">Delete account</Button>
//     </div>
//   ),
// };
//
// export const Small: Story = {
//   args: { children: 'Start selling', size: 'sm' },
// };
//
// export const Disabled: Story = {
//   args: { children: 'Add item', disabled: true },
// };

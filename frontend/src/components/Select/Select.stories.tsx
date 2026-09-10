import type { Meta, StoryObj } from '@storybook/react-vite';

import Select from './Select';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A dropdown built to match TextField, so forms line up. Used for the item condition and ' +
          'the category when someone lists something.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    label: 'Condition',
  },
};

// TODO: as you add props to Select.types.ts, add a story for each variant and
// state so you can see them all side by side. Something like:
//
// export const WithOptions: Story = {
//   args: {
//     label: 'Condition',
//     options: [
//       { label: 'New', value: 'new' },
//       { label: 'Like new', value: 'like-new' },
//       { label: 'Good', value: 'good' },
//       { label: 'Used', value: 'used' },
//     ],
//   },
// };

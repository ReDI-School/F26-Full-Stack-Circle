import type { Meta, StoryObj } from '@storybook/react-vite';

import TextField from './TextField';

const meta: Meta<typeof TextField> = {
  title: 'Components/Form/TextField',
  component: TextField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The standard text input, with its label above and its error message below. Used in log ' +
          'in, register, the add-item form and account settings.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextField>;

export const Default: Story = {
  args: {
    label: 'Email',
  },
};

// TODO: as you add props to TextField.types.ts, add a story for each variant and
// state so you can see them all side by side. Something like:
//
// export const WithPlaceholder: Story = {
//   args: { label: 'Email', type: 'email', placeholder: 'you@redi-school.org' },
// };
//
// export const WithError: Story = {
//   args: {
//     label: 'Password',
//     type: 'password',
//     error: 'At least 8 characters, please.',
//   },
// };

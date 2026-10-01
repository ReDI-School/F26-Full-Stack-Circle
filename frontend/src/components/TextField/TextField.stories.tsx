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

export const WithPlaceholder: Story = {
  args: { label: 'Email', type: 'email', placeholder: 'you@redi-school.org' },
};

export const WithError: Story = {
  args: {
    label: 'Password',
    type: 'password',
    error: 'At least 8 characters, please.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'you@redi-school.org',
    disabled: true,
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-5">
      <TextField label="Email" type="email" placeholder="you@redi-school.org" />
      <TextField label="Email" type="email" defaultValue="lena@redi-school.org" />
      <TextField
        label="Password"
        type="password"
        defaultValue="abc"
        error="At least 8 characters, please."
      />
      <TextField label="Email" type="email" placeholder="you@redi-school.org" disabled />
    </div>
  ),
};

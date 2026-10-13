import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import TextField from '../TextField/TextField';
import Textarea from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Form/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A labelled multi-line input for item descriptions and messages. Uses the TextField ' +
          'styles, resizes vertically, and defaults to four rows. Errors replace helper text.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: { label: 'Description' },
};

export const WithPlaceholder: Story = {
  args: {
    label: 'Description',
    placeholder: 'Tell buyers about your item…',
  },
};

export const WithError: Story = {
  args: {
    label: 'Description',
    error: 'Description is required',
    helperText: 'Maximum 500 characters',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Description',
    placeholder: 'Tell buyers about your item…',
    disabled: true,
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Description',
    helperText: 'Maximum 500 characters',
    maxLength: 500,
  },
};

export const CustomRows: Story = {
  args: {
    label: 'Description',
    rows: 8,
    defaultValue: 'A wooden chair in good condition.\nCollection available this weekend.',
  },
};

export const Controlled: Story = {
  args: {
    label: 'Description',
    id: 'item-description',
    name: 'description',
    required: true,
    maxLength: 500,
    helperText: 'Maximum 500 characters',
    'aria-describedby': 'description-guidance',
  },
  render: function Render(args) {
    const [value, setValue] = useState('');

    return (
      <div>
        <p id="description-guidance">Describe the condition and any signs of wear.</p>
        <Textarea {...args} value={value} onChange={(event) => setValue(event.target.value)} />
      </div>
    );
  },
};

export const WithTextField: Story = {
  render: () => (
    <div className="grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
      <TextField label="Title" placeholder="What are you selling?" />
      <Textarea label="Description" placeholder="Tell buyers about your item…" />
      <TextField label="Title with error" error="Title is required" />
      <Textarea label="Description with error" error="Description is required" />
      <TextField label="Disabled title" placeholder="What are you selling?" disabled />
      <Textarea label="Disabled description" placeholder="Tell buyers about your item…" disabled />
    </div>
  ),
};

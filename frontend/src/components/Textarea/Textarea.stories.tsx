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
          'styles, resizes vertically, and defaults to four rows. Non-blank errors replace helper ' +
          'text. One line is reserved for messages; longer messages expand naturally.',
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

export const EmptyError: Story = {
  args: {
    label: 'Description',
    error: '',
    helperText: 'Maximum 500 characters',
  },
};

export const WhitespaceError: Story = {
  args: {
    label: 'Description',
    error: '   ',
    helperText: 'Maximum 500 characters',
  },
};

export const ExternalInvalid: Story = {
  args: {
    label: 'Description',
    error: '   ',
    'aria-invalid': true,
  },
};

export const MessageChanges: Story = {
  args: {
    label: 'Description',
    id: 'changing-description',
    'aria-describedby': 'message-guidance',
  },
  render: function Render(args) {
    const [messageState, setMessageState] = useState('none');
    let error: string | undefined;
    if (messageState === 'error') {
      error = 'Description is required';
    } else if (messageState === 'long') {
      error =
        'Please describe the item, including its condition, dimensions, any signs of wear, ' +
        'and collection details so buyers can decide whether it is right for them.';
    }

    return (
      <div className="flex w-full max-w-sm flex-col gap-4">
        <label>
          Message state
          <select value={messageState} onChange={(event) => setMessageState(event.target.value)}>
            <option value="none">No message</option>
            <option value="helper">Helper text</option>
            <option value="error">Error message</option>
            <option value="long">Long error message</option>
          </select>
        </label>
        <p id="message-guidance">Describe your item for buyers.</p>
        <Textarea
          {...args}
          error={error}
          helperText={messageState === 'helper' ? 'Maximum 500 characters' : undefined}
        />
        <p>The next field stays in place for single-line messages.</p>
      </div>
    );
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

import type { Meta, StoryObj } from '@storybook/react-vite';

import Select from './Select';

const conditionOptions = [
  { label: 'New', value: 'NEW' },
  { label: 'Like new', value: 'LIKE_NEW' },
  { label: 'Good', value: 'GOOD' },
  { label: 'Used', value: 'USED' },
];

const categoryOptions = ['Clothing', 'Books', 'Electronics', 'Home', 'Sports'].map((category) => ({
  label: category,
  value: category,
}));

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
    options: conditionOptions,
  },
};

export const Condition: Story = {
  args: {
    label: 'Condition',
    placeholder: 'Please choose a condition',
    options: conditionOptions,
    defaultValue: '',
  },
};

export const Category: Story = {
  args: {
    label: 'Category',
    placeholder: 'Please choose a category',
    options: categoryOptions,
    defaultValue: '',
  },
};

export const WithError: Story = {
  args: {
    label: 'Condition',
    placeholder: 'Please choose a condition',
    options: conditionOptions,
    defaultValue: '',
    error: 'Please choose a condition',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Condition',
    placeholder: 'Please choose a condition',
    options: conditionOptions,
    defaultValue: '',
    disabled: true,
  },
};

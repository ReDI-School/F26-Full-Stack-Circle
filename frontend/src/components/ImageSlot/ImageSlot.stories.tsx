import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import ImageSlot from './ImageSlot';

const meta: Meta<typeof ImageSlot> = {
  title: 'Components/ImageSlot',
  component: ImageSlot,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'size can be set by className,',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ImageSlot>;

export const Filled: Story = {
  args: {
    value:
      'https://images.unsplash.com/photo-1642328443098-b237b5fefac2?q=80&w=2148&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    className: 'w-[280px] h-[220px]',
    onChange: fn(),
  },
};

export const BrokenUrl: Story = {
  args: {
    value: 'https://example.com/does-not-exist.jpg',
    placeholder: 'Drop the main photo',
    className: 'w-[280px] h-[220px]',
    onChange: fn(),
  },
};

export const Empty: Story = {
  args: {
    placeholder: 'Drop the main photo',
    className: 'w-[280px] h-[220px]',
    onChange: fn(),
  },
};

export const Circle: Story = {
  args: {
    value:
      'https://images.unsplash.com/photo-1642328443098-b237b5fefac2?q=80&w=2148&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Your photo',
    shape: 'circle',
    className: 'size-[140px]',
    onChange: fn(),
  },
};

export const CircleEmpty: Story = {
  args: {
    placeholder: 'Your photo',
    shape: 'circle',
    className: 'size-[140px]',
  },
};

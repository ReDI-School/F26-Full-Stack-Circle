import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import Toast from './Toast';
import type { ToastProps } from './Toast.types';

const ToastDemo = ({ message, variant, duration = 4000 }: ToastProps) => {
  const [open, setOpen] = useState(false);
  const [toastKey, setToastKey] = useState(0);

  return (
    <>
      <button
      className="rounded bg-ink px-4 py-2 text-white hover:bg-ink/80"
        type="button"
        onClick={() => {
          setToastKey((current) => current + 1);
          setOpen(true);
        }}
      >
        Show toast
      </button>

      <Toast
        key={toastKey}
        message={message}
        variant={variant}
        duration={duration}
        open={open}
        onDismiss={() => setOpen(false)}
      />
    </>
  );
};

const meta: Meta<typeof ToastDemo> = {
  title: 'Components/Toast',
  component: ToastDemo,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The short message that slides up at the bottom of the screen to confirm something ' +
          'worked, or to explain why it did not.',
      },
    },
  },
  args: {
    message: "Item listed! It's live in your shop.",
    variant: 'success',
    duration: 4000,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Success: Story = {
  args: {
    message: "Item listed! It's live in your shop.",
    variant: 'success',
  },
};

export const Error: Story = {
  args: {
    message: 'Wrong email or password.',
    variant: 'error',
  },
};

export const LongMessage: Story = {
  args: {
    message:
      'This is a really long toast message that should wrap onto multiple lines instead of running off the edge of the screen.',
    variant: 'success',
  },
};


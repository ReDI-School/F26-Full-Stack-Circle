import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useToast } from '../../hooks';
import { Button } from '../Button';
import ToastProvider from './ToastProvider';

const Actions = () => {
  const toast = useToast();
  return (
    <div className="flex flex-wrap gap-3 p-8">
      <Button onClick={() => toast.success("Item listed! It's live in your shop.")}>
        Show success
      </Button>
      <Button variant="secondary" onClick={() => toast.error('Wrong email or password.')}>
        Show error
      </Button>
      <Button
        variant="ghost"
        onClick={() => toast.error(`Unable to upload ${'long-filename'.repeat(20)}. Try again.`)}
      >
        Show long message
      </Button>
    </div>
  );
};

const meta = {
  title: 'Feedback/ToastProvider',
  component: ToastProvider,
  parameters: { layout: 'fullscreen' },
  args: { children: <Actions /> },
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
};

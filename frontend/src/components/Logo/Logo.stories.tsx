import type { Meta, StoryObj } from '@storybook/react-vite';

import Logo from './Logo';

const meta: Meta<typeof Logo> = {
  title: 'Components/Logo',
  component: Logo,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The ReDiCycle mark and wordmark. This one is already built for you — use it as a ' +
          'reference for how the other components are put together.',
      },
    },
  },
  argTypes: {
    size: { control: { type: 'range', min: 16, max: 96, step: 4 } },
  },
};

export default meta;
type Story = StoryObj<typeof Logo>;

export const Default: Story = {
  args: {
    size: 28,
  },
};

/** Just the recycle mark, for tight spaces like a favicon or a mobile navbar. */
export const MarkOnly: Story = {
  args: {
    size: 48,
    withWordmark: false,
  },
};

/** The wordmark scales with the mark, so the two stay balanced. */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-5">
      <Logo size={20} />
      <Logo size={28} />
      <Logo size={48} />
    </div>
  ),
};

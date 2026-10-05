import type { Meta, StoryObj } from '@storybook/react-vite';
import MessageBubble from './MessageBubble';

const meta: Meta<typeof MessageBubble> = {
  title: 'Components/MessageBubble',
  component: MessageBubble,
  decorators: [
    (Story) => (
      <div className="flex flex-col gap-2 w-100 p-4 bg-gray-50">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof MessageBubble>;

export const Own: Story = {
  args: { own: true, text: 'Hey, are we still on for tomorrow?' },
};

export const Theirs: Story = {
  args: { own: false, text: 'Yes! Same time, same place.' },
};

export const WithTimestamp: Story = {
  render: () => (
    <>
      <MessageBubble own={false} text="Did you see the doc?" timestamp="10:41" />
      <MessageBubble own text="Just reading it now." timestamp="10:42" />
    </>
  ),
};

export const Multiline: Story = {
  args: { own: true, text: 'First line\nSecond line\n\nAfter a blank line' },
};

export const LongUnbrokenString: Story = {
  args: { own: false, text: 'a'.repeat(200) },
};

export const LongUrl: Story = {
  args: {
    own: true,
    text:
      'https://example.com/' + 'very-long-path-segment-'.repeat(8) + '?q=' + 'x'.repeat(60),
  },
};

export const Conversation: Story = {
  render: () => (
    <>
      <MessageBubble own={false} text="Hi!" />
      <MessageBubble own text="Hello 👋" />
      <MessageBubble own={false} text={'a'.repeat(200)} />
    </>
  ),
};
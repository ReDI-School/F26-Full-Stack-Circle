import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';

import ThreadList from './ThreadList';
import type { Thread } from './ThreadList.types';
const threads: Thread[] = [
  {
    id: '1',
    withName: 'Lena',
    itemTitle: 'Blue bike',
    lastMessage: 'is it available?',
    time: '2m',
    unread: true,
  },
  {
    id: '2',
    withName: 'Omar',
    itemTitle: 'Desk lamp',
    lastMessage: 'I can pick it up tomorrow.',
    time: '1h',
    unread: false,
  },
];
const meta: Meta<typeof ThreadList> = {
  title: 'Components/ThreadList',
  component: ThreadList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The conversation list down the left side of the inbox — one row per conversation, showing who it' +
          ' ' +
          'is with, which item it is about, and the last message.',
      },
    },
  },
  args: {
    onSelect: fn(),
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();

    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm">Selected id: {args.activeId ?? 'none'}</p>
        <ThreadList
          {...args}
          onSelect={(id) => {
            updateArgs({ activeId: id });
            args.onSelect(id);
          }}
        />
      </div>
    );
  },
  argTypes: {
    activeId: {
      control: 'text',
      description: 'Active and highlighted thread ID',
      table: {
        defaultValue: { summary: 'undefined' },
      },
    },
    threads: {
      control: 'object',
      description: 'Message list data array',
      table: {
        defaultValue: { summary: '[]' },
      },
    },
    onSelect: {
      description: 'Called with the id of the clicked row',
    },
  },
};
export default meta;
type Story = StoryObj<typeof ThreadList>;

export const Default: Story = {
  args: {
    threads,
    activeId: '1',
  },
};
export const WithUnread: Story = {
  args: {
    threads: threads.map((t) => ({ ...t, unread: true })),
    activeId: '2',
  },
};
export const Selected: Story = {
  args: {
    threads: threads,
    activeId: '2',
  },
};

export const LongMessage: Story = {
  args: {
    threads: [
      {
        id: '1',
        withName: 'Alexander von Humboldt',
        itemTitle: 'Vintage Leather Armchair from the 19th Century',
        lastMessage:
          'Hello, this is a very, very long text and test that would push the entire 340px card wider if min-w-0 is missing from the flex parent.',
        time: 'Just now',
        unread: true,
      },
    ],
    activeId: '1',
  },
};

export const Empty: Story = {
  args: {
    threads: [],
    activeId: undefined,
  },
};

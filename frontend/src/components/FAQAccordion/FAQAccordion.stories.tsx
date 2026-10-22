import type { Meta, StoryObj } from '@storybook/react-vite';

import FAQAccordion from './FAQAccordion';
import { FAQItems } from './FAQs';

const meta: Meta<typeof FAQAccordion> = {
  title: 'Components/FAQAccordion',
  component: FAQAccordion,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'An FAQ accordion is a UI component that hides answer text and reveals it when a user clicks or taps on a question header',
      },
    },
  },
  args: {
    items: FAQItems,
  },
  argTypes: {
    defaultOpenId: {
      control: 'select',
      options: [undefined, ...FAQItems.map((i) => i.id)],
    },
  },
};

export default meta;
type Story = StoryObj<typeof FAQAccordion>;

export const Default: Story = {};

export const OneOpen: Story = {
  args: { defaultOpenId: FAQItems[0].id },
};

export const LongAnswer: Story = {
  args: {
    items: [
      {
        id: 'long',
        question: 'Can you give me a very detailed answer?',
        answer:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam blanditiis odit amet consequatur minima temporibus quasi voluptate doloremque molestiae reprehenderit laudantium ullam itaque nostrum necessitatibus, placeat officiis architecto dolor vel.',
      },
      ...FAQItems.slice(0, 2),
    ],
    defaultOpenId: 'long',
  },
};

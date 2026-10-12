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

export const Default: Story = {
  args: {},
};

import type { Meta, StoryObj } from '@storybook/react';
import { FaqAccordion } from './FaqAccordion';

const meta: Meta<typeof FaqAccordion> = {
  title: 'Components/FaqAccordion',
  component: FaqAccordion,
};

export default meta;

type Story = StoryObj<typeof FaqAccordion>;

export const Default: Story = {
  args: {
    items: [
      {
        question: 'What is this?',
        answer: 'This is an FAQ accordion.',
      },
      {
        question: 'How does it work?',
        answer: 'It displays questions and answers.',
      },
    ],
  },
};

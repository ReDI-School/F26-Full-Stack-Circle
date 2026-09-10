import type { Meta, StoryObj } from '@storybook/react-vite';

import Textarea from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Form/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The multi-line input, used for the item description when someone lists something and for ' +
          'writing a message to a seller.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    label: 'Description',
  },
};

// TODO: as you add props to Textarea.types.ts, add a story for each variant and
// state so you can see them all side by side. Something like:
//
// export const WithPlaceholder: Story = {
//   args: {
//     label: 'Description',
//     placeholder: 'Tell buyers about your item…',
//     rows: 4,
//   },
// };

import type { Meta, StoryObj } from '@storybook/react-vite';
import Banner from './Banner';
import { Button } from '../Button';

const meta: Meta<typeof Banner> = {
  title: 'Components/Banner',
  component: Banner,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The wide coloured band used as a page header. The `hero` variant opens the home page and ' +
          'the info pages; the `cta` variant sits just above the footer and nudges people to start ' +
          'selling.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Hero: Story = {
  args: {
    variant: 'hero',
    title: "Someone's old, your new ♻",
    description: `   Secondhand treasures from the community. No fees, no middleman — 
    you and the seller sort it out directly.`,
  },
};

export const Cta: Story = {
  args: {
    variant: 'cta',
    title: 'That drawer full of stuff you never use?',
    description: 'Open a shop and give it a second life.',
    action: <Button variant="primary">Start selling</Button>,
  },
};

export const CtaMobile: Story = {
  args: {
    ...Cta.args,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// TODO: as you add props to Banner.types.ts, add a story for each variant and
// state so you can see them all side by side. Something like:
//
// export const Hero: Story = {
//   args: {
//     variant: 'hero',
//     title: "someone's old, your new ♻",
//     subtitle:
//       'secondhand treasures from the community. no fees, no middleman — you and the seller sort it out directly.',
//   },
// };
//
// export const Cta: Story = {
//   args: {
//     variant: 'cta',
//     title: 'that drawer full of stuff you never use?',
//     subtitle: 'open a shop and give it a second life.',
//     action: <Button>Sell something</Button>,
//   },
// };

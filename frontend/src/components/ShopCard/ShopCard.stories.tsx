import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import ShopCard from './ShopCard';
import type { AvatarColour } from '../Avatar';

const meta = {
  title: 'Components/ShopCard',
  component: ShopCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A shop summary using the shared Avatar. Pass the full shop name unchanged. ' +
          'Providing onClick makes the whole card a keyboard-accessible button; without it, the card is static. ' +
          'For a row, cycle avatarColour through bg-primary, bg-secondary and bg-tertiary. ' +
          'Long names are visually truncated but remain available to assistive technology and on hover.',
      },
    },
  },
  args: {
    name: "Lena's shop",
    itemCount: 4,
    onClick: fn(),
  },
  argTypes: {
    avatarColour: {
      control: 'select',
      options: ['bg-primary', 'bg-secondary', 'bg-tertiary'],
    },
  },
} satisfies Meta<typeof ShopCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithPhoto: Story = {
  args: {
    name: "Omar's shop",
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
  },
};

export const SingleItem: Story = {
  args: { name: "Priya's shop", itemCount: 1, avatarColour: 'bg-secondary' },
};

export const Row: Story = {
  parameters: { layout: 'padded' },
  render: (args) => {
    const colours: AvatarColour[] = ['bg-primary', 'bg-secondary', 'bg-tertiary'];
    const shops = [
      { name: "Lena's shop", itemCount: 4 },
      { name: "Omar's shop", itemCount: 1 },
      { name: "Priya's shop", itemCount: 12 },
      { name: "Alex's shop", itemCount: 0 },
    ];

    return (
      <div className="flex flex-wrap gap-4">
        {shops.map((shop, index) => (
          <ShopCard {...args} {...shop} key={shop.name} avatarColour={colours[index % 3]} />
        ))}
      </div>
    );
  },
};

export const LongName: Story = {
  args: { name: "Lena's collection of pre-loved books and vintage home treasures" },
};

export const EmptyShop: Story = {
  args: { itemCount: 0 },
};

export const Static: Story = {
  args: { onClick: undefined },
};

export const KeyboardActivation: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByRole('button', { name: "Lena's shop 4 items" });
    await userEvent.click(card);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalledTimes(2);
    await userEvent.keyboard(' ');
    await expect(args.onClick).toHaveBeenCalledTimes(3);
  },
};

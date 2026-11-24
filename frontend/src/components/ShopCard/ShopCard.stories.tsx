import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import ShopCard from './ShopCard';

const meta = {
  title: 'Components/ShopCard',
  component: ShopCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A person’s shop in miniature — their avatar, the shop name, and how many items they have ' +
          "listed. Used in the 'shops we love' row on the home page. Providing onClick makes the whole " +
          'card a keyboard-accessible button; without it, the card is static. ' +
          'Long names are visually truncated with an ellipsis while remaining fully readable on hover.',
      },
    },
  },
  args: {
    name: "Lena's shop",
    itemCount: 4,
    onClick: fn(),
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
  args: {
    name: "Priya's shop",
    itemCount: 1,
  },
};

export const Row: Story = {
  parameters: { layout: 'padded' },
  render: (args) => {
    // These names hash deterministically via colourFor(name) to produce the exact
    // brand colour cycle: bg-primary -> bg-secondary -> bg-tertiary -> bg-primary
    const shops = [
      { name: "Maya's shop", itemCount: 4 },
      { name: "Lena's shop", itemCount: 1 },
      { name: "Priya's shop", itemCount: 12 },
      { name: "Eva's shop", itemCount: 0 },
    ];

    return (
      <div className="flex flex-wrap gap-4">
        {shops.map((shop) => (
          <ShopCard {...args} {...shop} key={shop.name} />
        ))}
      </div>
    );
  },
};

export const LongName: Story = {
  args: {
    name: "Lena's collection of pre-loved books and vintage home treasures",
  },
};

export const EmptyShop: Story = {
  args: {
    itemCount: 0,
  },
};

export const Static: Story = {
  args: {
    onClick: undefined,
  },
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

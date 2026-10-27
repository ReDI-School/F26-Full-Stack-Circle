import type { Meta, StoryObj } from '@storybook/react-vite';

import ShopCard from './ShopCard';

const meta: Meta<typeof ShopCard> = {
  title: 'Components/ShopCard',
  component: ShopCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "A person's shop in miniature — their avatar, the shop name and how many items they have " +
          "listed. Used in the 'shops we love' row on the home page.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ShopCard>;

export const Default: Story = {
  args: {
    name: 'Lena Koch',
    itemCount: 6,
  },
};

export const WithPhoto: Story = {
  args: { name: 'Omar Mansour', itemCount: 1, avatarUrl: 'https://i.pravatar.cc/150?img=47' },
};

export const SingleItem: Story = {
  args: { name: 'Omar Mansour', itemCount: 1 },
};

export const Row: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ShopCard name="Lena Koch" itemCount={4} />
      <ShopCard name="Sarah Miller" itemCount={1} />
      <ShopCard name="Omar Mansour" itemCount={2} />
    </div>
  ),
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import type { AvatarMenuEntry } from '@/components/AvatarMenu';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import Layout from './Layout';

/*
 * Layout itself never imports Navbar or Footer: they come in as props.
 * Only the stories import them, to show the real frame of a page.
 */

const menuItems: AvatarMenuEntry[] = [
  { label: 'My shop', onClick: fn() },
  { label: 'Account settings', onClick: fn() },
  { type: 'divider' },
  { label: 'Log out', onClick: fn(), danger: true },
];

const navbar = (
  <Navbar
    user={{ name: 'Lena Koch' }}
    unreadCount={2}
    menuItems={menuItems}
    onSearchChange={fn()}
    onSearch={fn()}
    onLogoClick={fn()}
    onAddItem={fn()}
    onInbox={fn()}
  />
);

const footer = (
  <Footer
    categoryLinks={[
      { label: 'clothing', href: '/browse?category=clothing' },
      { label: 'books', href: '/browse?category=books' },
      { label: 'electronics', href: '/browse?category=electronics' },
      { label: 'home', href: '/browse?category=home' },
      { label: 'sports', href: '/browse?category=sports' },
    ]}
    infoLinks={[
      { label: 'how to buy', href: '/how-to-buy' },
      { label: 'how to sell', href: '/how-to-sell' },
      { label: 'safety tips', href: '/safety' },
      { label: 'FAQ', href: '/faq' },
    ]}
    accountLinks={[
      { label: 'my shop', href: '/login' },
      { label: 'account settings', href: '/login' },
      { label: 'sell an item', href: '/login' },
    ]}
  />
);

const Card = ({ index }: { index: number }) => (
  <div className="bg-surface rounded-card p-5">Item {index + 1}</div>
);

const meta: Meta<typeof Layout> = {
  title: 'Components/Layout',
  component: Layout,
  tags: ['autodocs'],
  parameters: {
    // Layout is the whole page, so render it edge to edge
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The shell every page sits inside: the navbar on top, the page content in a centred ' +
          'column, and the footer at the bottom. `bare` drops both for login and register.',
      },
    },
  },
  args: {
    navbar,
    footer,
  },
};

export default meta;
type Story = StoryObj<typeof Layout>;

export const Default: Story = {
  args: {
    children: (
      <div className="flex flex-col gap-4 py-8">
        <h1>Browse the shop</h1>
        <p>Secondhand treasures from the community.</p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <Card key={index} index={index} />
          ))}
        </div>
      </div>
    ),
  },
};

/** Almost empty page: the footer must still sit at the bottom of the screen. */
export const ShortContent: Story = {
  args: {
    children: <p className="py-8">Nothing here yet.</p>,
  },
};

/** Lots of content: the page scrolls, the navbar stays on top and the footer follows the content. */
export const LongContent: Story = {
  args: {
    children: (
      <div className="flex flex-col gap-4 py-8">
        {Array.from({ length: 30 }, (_, index) => (
          <Card key={index} index={index} />
        ))}
      </div>
    ),
  },
};

/** No navbar, no footer, no width cap: used by /login and /register. */
export const Bare: Story = {
  args: {
    variant: 'bare',
    children: (
      <div className="grid flex-1 grid-cols-2">
        <div className="bg-tertiary p-8 font-bold text-white">Branding side</div>
        <div className="bg-surface p-8 font-bold">Form side</div>
      </div>
    ),
  },
};

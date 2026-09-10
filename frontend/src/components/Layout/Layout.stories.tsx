import type { Meta, StoryObj } from '@storybook/react-vite';

import Layout from './Layout';

const meta: Meta<typeof Layout> = {
  title: 'Components/Layout',
  component: Layout,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The shell every page sits inside: the navbar on top, the page content in a centred ' +
          'column, and the footer at the bottom.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Layout>;

export const Default: Story = {
  args: {
    children: 'Every page of ReDiCycle is rendered inside this shell.',
  },
};

// TODO: as you add props to Layout.types.ts, add a story for each variant and
// state so you can see them all side by side. Something like:
//
// export const WithAPage: Story = {
//   render: () => (
//     <Layout>
//       <h1>Browse the shop</h1>
//       <p>secondhand treasures from the community.</p>
//     </Layout>
//   ),
// };

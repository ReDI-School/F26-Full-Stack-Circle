import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { CreateItemDemo } from './CreateItemDemo';
import {
  initialItem,
  mockCreateItemResponse,
  type CreateItemRequest,
  type CreateItemResponse,
} from './CreateItem.fixtures';

const screenshotGallery = [
  '\n\n## Captured examples\n\nDesktop at 1440 px and mobile at 390 px, captured after the story interactions finish.',
  `### Listed item\n\n![Listed item on desktop](${new URL('./screenshots/create-item-success-desktop.png', import.meta.url).href})`,
  `### Free item\n\n![Free item on desktop](${new URL('./screenshots/create-item-free-item-desktop.png', import.meta.url).href})`,
  `### Field errors\n\n![Validation errors on desktop](${new URL('./screenshots/create-item-validation-errors-desktop.png', import.meta.url).href})`,
  `### Sign-in required\n\n![Sign-in required on desktop](${new URL('./screenshots/create-item-unauthenticated-desktop.png', import.meta.url).href})`,
  `### Mobile\n\n![Listed item on mobile](${new URL('./screenshots/create-item-success-mobile.png', import.meta.url).href})`,
].join('\n\n');

const meta = {
  title: 'API/Create item',
  component: CreateItemDemo,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: {
      description: {
        component: [
          'A Storybook-only demonstration of the POST /api/items contract for issue #35, built from shared components. ',
          'Every submit callback is a local response fixture: these stories do not call the API, sign in or save data. ',
          'They check how a caller presents 201, 400 and 401 responses; backend integration tests cover the real endpoint.\n\n',
          'Real requests use POST /api/items, credentials: "include" and Content-Type: application/json. ',
          'Send title (trimmed, 3–120 characters), description (present, trimmed, at most 2000 characters; empty is valid), ',
          'priceCents (integer, 0–1,000,000), condition (NEW, LIKE_NEW, GOOD or USED), categoryId (an existing UUID), ',
          'and optional photoUrls (up to 5 http(s) URLs). The UUIDs below are fixtures, not seed database IDs.\n\n',
          'The server derives shop ownership from the authenticated user; a supplied shopId is ignored. ',
          'Success returns 201 { item } in the GET /api/items/:id shape, with photos ordered by position. ',
          'Validation returns 400 { error: "Validation failed", fields: { ... } } with all field failures. ',
          'Unauthenticated requests return 401 { error: "You need to log in." }; an account without a shop receives 403. ',
          'The stories preserve form values after errors and focus the first invalid field, or the response summary.',
          screenshotGallery,
        ].join(''),
      },
    },
  },
} satisfies Meta<typeof CreateItemDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: { submit: fn(async (request: CreateItemRequest) => mockCreateItemResponse(request)) },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const title = canvas.getByRole('textbox', { name: 'Item title' });
    await userEvent.clear(title);
    await userEvent.type(title, '  Ceramic plant pot  ');
    await userEvent.click(canvas.getByRole('button', { name: 'List item' }));

    await expect(
      await canvas.findByRole('heading', { name: 'Your item is listed.' })
    ).toBeVisible();
    await expect(args.submit).toHaveBeenCalledWith({
      ...initialItem,
      title: '  Ceramic plant pot  ',
    });
    await expect(
      canvas.getByRole('button', { name: /Ceramic plant pot.*Home.*Lena/ })
    ).toBeVisible();
    await expect(canvas.getByRole('status')).toHaveFocus();
  },
};

export const FreeItem: Story = {
  args: {
    initialValues: { title: 'A home for your next plant', priceCents: 0 },
    submit: fn(async (request: CreateItemRequest) => mockCreateItemResponse(request)),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('button', { name: 'List item' }).focus();
    await userEvent.keyboard('{Enter}');

    await expect(await canvas.findByText('Free', { exact: true })).toBeVisible();
    await expect(args.submit).toHaveBeenCalledWith(expect.objectContaining({ priceCents: 0 }));
  },
};

export const ValidationErrors: Story = {
  args: {
    initialValues: { title: 'Hi', priceCents: -100 },
    submit: fn(async (): Promise<CreateItemResponse> => ({
      status: 400,
      body: {
        error: 'Validation failed',
        fields: {
          title: 'Title must be at least 3 characters.',
          priceCents: 'Price cannot be negative.',
        },
      },
    })),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'List item' }));

    await expect(await canvas.findByRole('alert')).toHaveTextContent('Validation failed');
    await expect(canvas.getByRole('textbox', { name: 'Item title' })).toHaveFocus();
    await expect(canvas.getByRole('textbox', { name: 'Item title' })).toHaveAttribute(
      'aria-invalid',
      'true'
    );
    await expect(canvas.getByRole('textbox', { name: 'Price in cents' })).toHaveAttribute(
      'aria-invalid',
      'true'
    );
    await expect(canvas.getByRole('textbox', { name: 'Price in cents' })).toHaveValue('-100');
  },
};

export const Unauthenticated: Story = {
  args: {
    submit: fn(async (): Promise<CreateItemResponse> => ({
      status: 401,
      body: { error: 'You need to log in.' },
    })),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'List item' }));

    await expect(await canvas.findByRole('alert')).toHaveTextContent('You need to log in.');
    await expect(canvas.getByRole('alert')).toHaveFocus();
    await expect(canvas.getByRole('textbox', { name: 'Item title' })).toHaveValue(
      initialItem.title
    );
    await expect(
      canvas.queryByRole('heading', { name: 'Your item is listed.' })
    ).not.toBeInTheDocument();
  },
};

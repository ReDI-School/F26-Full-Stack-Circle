import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { page, userEvent } from 'vitest/browser';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { Avatar } from '../Avatar';
import { ShopCard, getInitials } from './index';
import '../../assets/css/global.css';

let root: Root;
let container: HTMLDivElement;

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});

const mount = async (element: React.ReactNode) => {
  await act(async () => root.render(element));
};

it('preserves the complete shop name and derives shared initials', async () => {
  await mount(<ShopCard name="Lena's shop" itemCount={4} />);
  expect(container.textContent).toBe("LSLena's shop4 items");
  expect(getInitials("Lena's shop")).toBe('LS');
  expect(getInitials('  Omar   Mansour  ')).toBe('OM');
  expect(getInitials('')).toBe('');
});

it.each([0, 1, 2])('uses the correct item count for %i', async (itemCount) => {
  await mount(<ShopCard name="Lena's shop" itemCount={itemCount} />);
  expect(container.textContent).toContain(`${itemCount} ${itemCount === 1 ? 'item' : 'items'}`);
});

it('activates once per click, Enter and Space without submitting its parent form', async () => {
  const onClick = vi.fn();
  const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
  await mount(
    <form onSubmit={onSubmit}>
      <ShopCard name="Lena's shop" itemCount={4} onClick={onClick} />
    </form>
  );
  const card = page.getByRole('button', { name: "Lena's shop 4 items" });
  await userEvent.tab();
  expect(document.activeElement).toBe(container.querySelector('button'));
  await userEvent.keyboard('{Enter}');
  expect(onClick).toHaveBeenCalledTimes(1);
  await userEvent.keyboard(' ');
  expect(onClick).toHaveBeenCalledTimes(2);
  await card.click();
  expect(onClick).toHaveBeenCalledTimes(3);
  expect(onSubmit).not.toHaveBeenCalled();
});

it('does not create an inactive button or tab stop when no action is provided', async () => {
  await mount(<ShopCard name="Lena's shop" itemCount={0} />);
  expect(container.querySelector('button, [role="button"], [tabindex]')).toBeNull();
});

it('shows the supplied image in the shared Avatar instead of initials', async () => {
  const photo =
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="56" height="56"/%3E';
  await mount(<ShopCard name="Lena's shop" itemCount={4} avatarUrl={photo} />);
  const image = container.querySelector('img')!;
  expect(image.getAttribute('src')).toBe(photo);
  expect(image.alt).toBe("Lena's shop");
  expect(container.textContent).toBe("Lena's shop4 items");
});

it('keeps the full accessible name while truncating a long unbroken label', async () => {
  const name = 'VeryLongShopName'.repeat(15);
  await mount(<ShopCard name={name} itemCount={1} onClick={vi.fn()} />);
  const card = page.getByRole('button', { name: `${name} 1 item` }).element();
  const label = container.querySelector<HTMLElement>('[title]')!;
  expect(label.textContent).toBe(name);
  expect(label.scrollWidth).toBeGreaterThan(label.clientWidth);
  expect(getComputedStyle(label).textOverflow).toBe('ellipsis');
  expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth);
});

it('uses the 56px avatar and 19px initials without changing the existing large Avatar', async () => {
  await mount(
    <>
      <ShopCard name="Lena's shop" itemCount={4} />
      <Avatar name="Lena Koch" size="lg" />
    </>
  );
  const avatars = container.querySelectorAll('[role="img"]');
  const shopStyle = getComputedStyle(avatars[0].parentElement!);
  const defaultStyle = getComputedStyle(avatars[1].parentElement!);
  expect(shopStyle.width).toBe('56px');
  expect(shopStyle.height).toBe('56px');
  expect(shopStyle.fontSize).toBe('19px');
  expect(shopStyle.color).toBe('rgb(255, 255, 255)');
  expect(defaultStyle.width).toBe('64px');
  expect(defaultStyle.fontSize).toBe('22px');
});

it('cycles row colours by the supplied position rather than the shop name', async () => {
  const colours = ['bg-primary', 'bg-secondary', 'bg-tertiary', 'bg-primary'] as const;
  await mount(
    <div>
      {colours.map((colour, index) => (
        <ShopCard key={index} name="Same shop" itemCount={index} avatarColour={colour} />
      ))}
    </div>
  );
  const actual = [...container.querySelectorAll('[role="img"]')].map(
    (avatar) => getComputedStyle(avatar.parentElement!).backgroundColor
  );
  expect(actual).toEqual([
    'rgb(88, 173, 197)',
    'rgb(240, 90, 33)',
    'rgb(56, 90, 101)',
    'rgb(88, 173, 197)',
  ]);
});

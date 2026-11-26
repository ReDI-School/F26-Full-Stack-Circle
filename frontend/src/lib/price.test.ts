import { expect, it } from 'vitest';
import { parsePriceToCents } from './price';

it.each([
  ['18', 1800],
  ['18.50', 1850],
  ['18,50', 1850],
  ['18.1', 1810],
  [' 7,5 ', 750],
  ['0', 0],
  ['10000', 1_000_000],
])('converts %j to %i cents', (input, cents) => {
  expect(parsePriceToCents(input)).toEqual({ ok: true, cents });
});

it.each(['', '   ', 'abc', '-5', '18.505', '1.2.3', '18e2', '10000.01'])('rejects %j', (input) => {
  const result = parsePriceToCents(input);
  expect(result.ok).toBe(false);
  if (!result.ok) expect(result.error).toMatch(/\w/);
});

it('explains that negative prices are not allowed', () => {
  expect(parsePriceToCents('-5')).toEqual({ ok: false, error: 'Price cannot be negative.' });
});

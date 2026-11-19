/**
 * Formats a price in cents for messages sent to the client.
 * Mirrors frontend/src/lib/price.ts so both sides show prices the same way.
 *
 * 1800 -> "€ 18"
 * 1850 -> "€ 18.50"
 */
export const formatPrice = (cents: number): string =>
  `€ ${cents % 100 === 0 ? cents / 100 : (cents / 100).toFixed(2)}`;

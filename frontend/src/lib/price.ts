/**
 * Formats a price received from the API in cents.
 *
 * 1800 -> "€ 18"
 * 1850 -> "€ 18.50"
 * 0    -> "Free"
 */
export const formatPrice = (cents: number): string => {
  if (!Number.isFinite(cents)) {
    throw new Error('Price must be a finite number.');
  }

  if (cents === 0) {
    return 'Free';
  }

  const euros = cents / 100;

  if (cents % 100 === 0) {
    return `€ ${euros}`;
  }

  return `€ ${euros.toFixed(2)}`;
};

/** The API's upper limit for priceCents. */
export const MAX_PRICE_CENTS = 1_000_000;

export type ParsedPrice = { ok: true; cents: number } | { ok: false; error: string };

/**
 * Converts what a seller typed in euros into the cents the API expects.
 *
 * "18"    -> 1800
 * "18.50" -> 1850
 * "18,50" -> 1850 (comma decimal separator, as typed in most of Europe)
 * "0"     -> 0    (valid: the item is given away)
 * "", "abc", "-5" -> a readable error instead of NaN
 */
export const parsePriceToCents = (input: string): ParsedPrice => {
  const value = input.trim().replace(',', '.');

  if (value === '') {
    return { ok: false, error: 'Enter a price, or 0 to give it away.' };
  }
  if (value.startsWith('-')) {
    return { ok: false, error: 'Price cannot be negative.' };
  }
  if (!/^\d+(\.\d{1,2})?$/.test(value)) {
    return { ok: false, error: 'Enter a price in euros, like 18 or 18.50.' };
  }

  const cents = Math.round(Number(value) * 100);

  if (cents > MAX_PRICE_CENTS) {
    return { ok: false, error: `Price cannot be more than ${formatPrice(MAX_PRICE_CENTS)}.` };
  }

  return { ok: true, cents };
};

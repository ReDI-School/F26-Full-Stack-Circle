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

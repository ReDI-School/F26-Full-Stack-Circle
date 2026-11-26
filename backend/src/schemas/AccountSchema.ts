import { z } from 'zod';

const httpOrHttpsUrl = z.string().refine(
  (value) => {
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  },
  { error: 'Avatar URL must be an http:// or https:// URL.' }
);

/**
 * Any subset of the account-settings fields. Extra keys (including
 * `password` / `passwordHash`) are rejected: this ticket does not
 * change a password without verifying the current one.
 */
export const updateAccountSchema = z
  .object({
    name: z
      .string({ error: 'Name must be a string.' })
      .trim()
      .min(1, "Name can't be empty.")
      .max(80, 'Name is too long (max 80 characters).')
      .optional(),
    email: z
      .string({ error: 'Email must be a string.' })
      .trim()
      .toLowerCase()
      .email({ error: 'Enter a valid email address.' })
      .optional(),
    shopName: z
      .string({ error: 'Shop name must be a string.' })
      .trim()
      .min(1, "Shop name can't be empty.")
      .max(80, 'Shop name is too long (max 80 characters).')
      .optional(),
    avatarUrl: z
      .union([httpOrHttpsUrl, z.null()], {
        error: 'Avatar URL must be an http:// or https:// URL, or null to clear it.',
      })
      .optional(),
  })
  .strict();

export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;

import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().toLowerCase().email(),
  // The character limit is what a person sees. The byte check stays as a
  // backstop: bcrypt hashes only the first 72 bytes and silently drops
  // the rest, and 64 characters of emoji or Cyrillic can still exceed
  // that. Truncation would let the prefix alone log you in.
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(64, 'Password must be at most 64 characters.')
    .refine((value) => Buffer.byteLength(value, 'utf8') <= 72, {
      message: 'Password is too long.',
    }),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

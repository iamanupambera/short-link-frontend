import { z } from 'zod';

/**
 * Reusable strong-password refinement that matches the backend policy:
 * ≥ 8 chars, uppercase, lowercase, digit, and special character.
 */
export const strongPassword = z
  .string()
  .min(8, 'Use at least 8 characters.')
  .regex(/[a-z]/, 'Include a lowercase letter.')
  .regex(/[A-Z]/, 'Include an uppercase letter.')
  .regex(/[0-9]/, 'Include a number.')
  .regex(/[^a-zA-Z0-9]/, 'Include a special character.');

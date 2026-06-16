import { z } from 'zod';

export const verifyEmailSchema = z.object({
  email: z.email('Enter a valid email address.').min(1, 'Email is required.'),
});

export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;

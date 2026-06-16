import { z } from 'zod';

import { strongPassword } from '@/features/auth/schemas/password';

export const resetPasswordSchema = z
  .object({
    password: strongPassword,
    confirmPassword: z.string().min(1, 'Confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

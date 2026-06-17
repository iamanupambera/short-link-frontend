import { z } from 'zod';

import { strongPassword } from '@/features/auth/schemas/password';

export const resetPasswordSchema = z
  .object({
    email: z.string().email('Please enter a valid email.'),
    otp: z.string().length(6, 'OTP must be exactly 6 digits.'),
    password: strongPassword,
    confirmPassword: z.string().min(1, 'Confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

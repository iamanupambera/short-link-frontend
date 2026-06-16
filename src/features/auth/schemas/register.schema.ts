import { z } from 'zod';

import { strongPassword } from '@/features/auth/schemas/password';

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    email: z.email('Enter a valid email address.').min(1, 'Email is required.'),
    password: strongPassword,
    confirmPassword: z.string().min(1, 'Confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

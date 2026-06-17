import { z } from 'zod';

export const verifyEmailSchema = z.object({
  email: z.email('Enter a valid email address.').min(1, 'Email is required.'),
});

export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;

export const verifyOtpSchema = z.object({
  email: z.email('Enter a valid email address.').min(1, 'Email is required.'),
  otp: z.string().length(6, 'OTP must be exactly 6 digits.'),
});

export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;

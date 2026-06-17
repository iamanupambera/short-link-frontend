'use client';

import { useState, useTransition } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SendIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  verifyOtpSchema,
  type VerifyOtpFormValues,
} from '@/features/auth/schemas/verify-email.schema';
import { resendVerificationRequest } from '@/features/auth/api/resend-verification';
import { verifyOtpRequest } from '@/features/auth/api/verify-otp';
import { setSession } from '@/lib/auth/cookies';
import { FormMessage } from '@/features/auth/components/form-message';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp';
import type { FormActionState } from '@/features/auth/types/auth.types';

interface VerifyEmailFormProps {
  defaultEmail?: string;
  isRegistered?: boolean;
  isUnverified?: boolean;
}

export function VerifyEmailForm({
  defaultEmail = '',
  isRegistered = false,
  isUnverified = false,
}: VerifyEmailFormProps) {
  const router = useRouter();
  const [serverState, setServerState] = useState<FormActionState>({
    status: 'idle',
  });
  const [pending, startTransition] = useTransition();
  const [resending, startResendTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email: defaultEmail,
      otp: '',
    },
  });

  function onSubmit(data: VerifyOtpFormValues) {
    setServerState({ status: 'idle' });

    startTransition(async () => {
      try {
        const result = await verifyOtpRequest({
          email: data.email,
          otp: data.otp,
        });

        if (result.session) {
          setServerState({
            status: 'success',
            message: 'Email verified successfully! Logging you in...',
          });
          await setSession(result.session);
          router.replace('/dashboard');
        } else {
          setServerState({
            status: 'success',
            message: 'Email verified successfully! Redirecting to login...',
          });
          router.replace('/auth/login');
        }
      } catch (error) {
        setServerState({
          status: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'Verification failed. Please try again.',
        });
      }
    });
  }

  const handleResend = () => {
    const email = getValues('email');
    if (!email) {
      setError('email', {
        type: 'manual',
        message: 'Email is required to resend verification code.',
      });
      return;
    }

    setServerState({ status: 'idle' });
    startResendTransition(async () => {
      try {
        const message = await resendVerificationRequest(email);
        setServerState({
          status: 'success',
          message: message || 'Verification code resent successfully.',
        });
      } catch (error) {
        setServerState({
          status: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'Failed to resend verification code.',
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {isRegistered && serverState.status === 'idle' && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 space-y-1">
          <p className="font-semibold">Registration successful!</p>
          <p>
            We&apos;ve sent a 6-digit OTP code to{' '}
            <span className="font-semibold">{defaultEmail}</span>. Please check
            your inbox and enter the code below to verify your email.
          </p>
        </div>
      )}
      {isUnverified && serverState.status === 'idle' && (
        <div className="rounded-lg border border-teal-200 bg-teal-50 p-4 text-sm text-teal-800 space-y-1">
          <p className="font-semibold">Email verification required</p>
          <p>
            Your email has not been verified yet. We have sent a fresh OTP code
            to <span className="font-semibold">{defaultEmail}</span>. Please
            check your inbox and enter the code below to verify.
          </p>
        </div>
      )}
      <FormMessage state={serverState} />
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            {...register('email')}
          />
          <FieldError errors={errors.email ? [errors.email] : undefined} />
        </Field>

        <Field>
          <FieldLabel htmlFor="otp">6-digit OTP Code</FieldLabel>
          <div className="flex flex-col gap-2">
            <Controller
              control={control}
              name="otp"
              render={({ field }) => (
                <InputOTP
                  id="otp"
                  maxLength={6}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={pending || resending}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
            <div className="flex justify-end">
              <Button
                type="button"
                variant="link"
                size="sm"
                className="text-teal-700 hover:text-teal-800 h-auto p-0 font-medium text-xs underline"
                onClick={handleResend}
                disabled={pending || resending}
              >
                {resending ? 'Resending code...' : 'Resend verification code'}
              </Button>
            </div>
          </div>
          <FieldError errors={errors.otp ? [errors.otp] : undefined} />
        </Field>
      </FieldGroup>
      <Button type="submit" className="w-full" disabled={pending || resending}>
        <SendIcon />
        {pending ? 'Verifying...' : 'Verify email'}
      </Button>
    </form>
  );
}

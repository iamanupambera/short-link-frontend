'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SendIcon } from 'lucide-react';
import {
  verifyEmailSchema,
  type VerifyEmailFormValues,
} from '@/features/auth/schemas/verify-email.schema';
import { resendVerificationAction } from '@/features/auth/actions/resend-verification.action';
import { FormMessage } from '@/features/auth/components/form-message';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { FormActionState } from '@/features/auth/types/auth.types';

export function VerifyEmailForm() {
  const [serverState, setServerState] = useState<FormActionState>({
    status: 'idle',
  });
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { email: '' },
  });

  function onSubmit(data: VerifyEmailFormValues) {
    setServerState({ status: 'idle' });

    startTransition(async () => {
      const formData = new FormData();
      formData.set('email', data.email);

      const result = await resendVerificationAction(serverState, formData);
      setServerState(result);
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
      </FieldGroup>
      <Button type="submit" className="w-full" disabled={pending}>
        <SendIcon />
        {pending ? 'Sending' : 'Send verification'}
      </Button>
    </form>
  );
}

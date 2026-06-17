'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MailIcon } from 'lucide-react';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '../schemas/forgot-password.schema';
import { forgotPasswordAction } from '../actions/forgot-password.action';
import { FormMessage } from '../components/form-message';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { FormActionState } from '../types/auth.types';

export function ForgotPasswordForm() {
  const router = useRouter();
  const [serverState, setServerState] = useState<FormActionState>({
    status: 'idle',
  });
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  useEffect(() => {
    if (serverState.status === 'success') {
      const email = getValues('email');
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    }
  }, [serverState.status, router, getValues]);

  function onSubmit(data: ForgotPasswordFormValues) {
    setServerState({ status: 'idle' });

    startTransition(async () => {
      const formData = new FormData();
      formData.set('email', data.email);

      const result = await forgotPasswordAction(serverState, formData);
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
        <MailIcon />
        {pending ? 'Sending' : 'Send reset link'}
      </Button>
    </form>
  );
}

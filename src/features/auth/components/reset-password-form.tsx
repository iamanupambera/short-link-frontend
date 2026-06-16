'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRoundIcon } from 'lucide-react';
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '@/features/auth/schemas/reset-password.schema';
import { resetPasswordAction } from '@/features/auth/actions/reset-password.action';
import { FormMessage } from '@/features/auth/components/form-message';
import { PasswordInput } from '@/features/auth/components/password-input';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import type { FormActionState } from '@/features/auth/types/auth.types';

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [serverState, setServerState] = useState<FormActionState>({
    status: 'idle',
  });
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  function onSubmit(data: ResetPasswordFormValues) {
    setServerState({ status: 'idle' });

    startTransition(async () => {
      const formData = new FormData();
      formData.set('token', token);
      formData.set('password', data.password);

      const result = await resetPasswordAction(serverState, formData);
      setServerState(result);
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FormMessage state={serverState} />
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="password">New password</FieldLabel>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            {...register('password')}
          />
          <FieldError
            errors={errors.password ? [errors.password] : undefined}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.confirmPassword)}
            {...register('confirmPassword')}
          />
          <FieldError
            errors={
              errors.confirmPassword ? [errors.confirmPassword] : undefined
            }
          />
        </Field>
      </FieldGroup>
      <Button type="submit" className="w-full" disabled={pending || !token}>
        <KeyRoundIcon />
        {pending ? 'Resetting' : 'Reset password'}
      </Button>
    </form>
  );
}

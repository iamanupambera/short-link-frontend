'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { LogInIcon } from 'lucide-react';
import {
  loginSchema,
  type LoginFormValues,
} from '@/features/auth/schemas/login.schema';
import { useLogin } from '@/features/auth/hooks/use-login';
import { FormMessage } from '@/features/auth/components/form-message';
import { PasswordInput } from '@/features/auth/components/password-input';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export function LoginForm() {
  const { login, serverState, pending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  function onSubmit(data: LoginFormValues) {
    login(data);
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
        <Field>
          <div className="flex items-center justify-between gap-3">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Link
              href="/auth/forgot-password"
              className="text-xs font-medium text-teal-700 underline-offset-4 hover:underline"
            >
              Forgot password
            </Link>
          </div>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            {...register('password')}
          />
          <FieldError
            errors={errors.password ? [errors.password] : undefined}
          />
        </Field>
      </FieldGroup>
      <Button type="submit" className="w-full" disabled={pending}>
        <LogInIcon />
        {pending ? 'Signing in' : 'Sign in'}
      </Button>
    </form>
  );
}

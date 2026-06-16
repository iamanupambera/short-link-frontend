'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlusIcon } from 'lucide-react';
import {
  registerSchema,
  type RegisterFormValues,
} from '@/features/auth/schemas/register.schema';
import { useRegister } from '@/features/auth/hooks/use-register';
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

export function RegisterForm() {
  const { register: registerUser, serverState, pending } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  function onSubmit(data: RegisterFormValues) {
    registerUser(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FormMessage state={serverState} />
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input
            id="name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            {...register('name')}
          />
          <FieldError errors={errors.name ? [errors.name] : undefined} />
        </Field>
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
          <FieldLabel htmlFor="password">Password</FieldLabel>
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
      <Button type="submit" className="w-full" disabled={pending}>
        <UserPlusIcon />
        {pending ? 'Creating account' : 'Create account'}
      </Button>
    </form>
  );
}

'use client';

import { useState, useTransition } from 'react';
import { registerAction } from '@/features/auth/actions/register.action';
import type { RegisterFormValues } from '@/features/auth/schemas/register.schema';
import type { FormActionState } from '@/features/auth/types/auth.types';

export function useRegister() {
  const [serverState, setServerState] = useState<FormActionState>({
    status: 'idle',
  });
  const [pending, startTransition] = useTransition();

  const handleRegister = (data: RegisterFormValues) => {
    setServerState({ status: 'idle' });

    startTransition(async () => {
      const formData = new FormData();
      formData.set('name', data.name);
      formData.set('email', data.email);
      formData.set('password', data.password);
      formData.set('confirmPassword', data.confirmPassword);

      const result = await registerAction(serverState, formData);
      setServerState(result || { status: 'idle' });
    });
  };

  return { register: handleRegister, serverState, pending };
}

'use client';

import { useState, useTransition } from 'react';
import { loginAction } from '@/features/auth/actions/login.action';
import type { LoginFormValues } from '@/features/auth/schemas/login.schema';
import type { FormActionState } from '@/features/auth/types/auth.types';

export function useLogin() {
  const [serverState, setServerState] = useState<FormActionState>({
    status: 'idle',
  });
  const [pending, startTransition] = useTransition();

  const handleLogin = (data: LoginFormValues) => {
    setServerState({ status: 'idle' });

    startTransition(async () => {
      const formData = new FormData();
      formData.set('email', data.email);
      formData.set('password', data.password);

      const result = await loginAction(serverState, formData);
      setServerState(result || { status: 'idle' });
    });
  };

  return { login: handleLogin, serverState, pending };
}

import type { FormActionState } from '../types/auth.types';
import { cn } from '@/lib/utils/cn';

type FormMessageProps = {
  state: FormActionState;
};

export function FormMessage({ state }: FormMessageProps) {
  if (!state.message) {
    return null;
  }

  return (
    <div
      className={cn(
        'rounded-lg border px-3 py-2 text-sm leading-5',
        state.status === 'success'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
          : 'border-red-200 bg-red-50 text-red-800',
      )}
    >
      {state.message}
    </div>
  );
}

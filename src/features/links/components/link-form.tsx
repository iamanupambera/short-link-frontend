'use client';

import { useActionState } from 'react';
import { SaveIcon } from 'lucide-react';

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
import type { ShortLink } from '@/features/links/types/link.types';

type LinkFormProps = {
  mode: 'create' | 'edit';
  action: (
    state: FormActionState,
    formData: FormData,
  ) => Promise<FormActionState>;
  link?: ShortLink;
};

export function LinkForm({ mode, action, link }: LinkFormProps) {
  const [state, formAction, pending] = useActionState(action, {
    status: 'idle',
  } as FormActionState);
  const isEdit = mode === 'edit';

  return (
    <form action={formAction} className="space-y-5">
      <FormMessage state={state} />
      {link ? <input type="hidden" name="id" value={link.id} /> : null}
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="originalUrl">Destination URL</FieldLabel>
          <Input
            id="originalUrl"
            name="originalUrl"
            type="url"
            defaultValue={link?.originalUrl}
            placeholder="https://example.com/product"
            aria-invalid={Boolean(state.errors?.originalUrl)}
            required
          />
          <FieldError errors={state.errors?.originalUrl?.map(toFieldError)} />
        </Field>
        <div className="grid gap-5 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="customAlias">Custom alias</FieldLabel>
            <Input
              id="customAlias"
              name="customAlias"
              defaultValue={link?.customAlias ?? ''}
              placeholder="launch-2026"
              aria-invalid={Boolean(state.errors?.customAlias)}
            />
            <FieldError errors={state.errors?.customAlias?.map(toFieldError)} />
          </Field>
          <Field>
            <FieldLabel htmlFor="expiresAt">Expiration</FieldLabel>
            <Input
              id="expiresAt"
              name="expiresAt"
              type="datetime-local"
              defaultValue={toDatetimeLocal(link?.expiresAt)}
            />
          </Field>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              aria-invalid={Boolean(state.errors?.password)}
            />
            <FieldError errors={state.errors?.password?.map(toFieldError)} />
          </Field>
          {isEdit ? (
            <Field>
              <FieldLabel htmlFor="status">Status</FieldLabel>
              <select
                id="status"
                name="status"
                defaultValue={
                  link?.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE'
                }
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </Field>
          ) : null}
        </div>
      </FieldGroup>
      <Button type="submit" disabled={pending}>
        <SaveIcon />
        {pending ? 'Saving' : isEdit ? 'Save changes' : 'Create link'}
      </Button>
    </form>
  );
}

function toFieldError(message: string) {
  return { message };
}

function toDatetimeLocal(value?: string | null) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

'use client';

import { useState } from 'react';
import { SaveIcon, Loader2Icon } from 'lucide-react';
import {
  useUpdateProfile,
  useUpdateProfilePicture,
} from '@/features/profile/hooks/use-profile';
import { getErrorMessage } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { User } from '@/features/profile/types/user.types';

type ProfileFormProps = {
  user: User;
};

export function ProfileForm({ user }: ProfileFormProps) {
  const updateProfile = useUpdateProfile();
  const updatePicture = useUpdateProfilePicture();

  const [name, setName] = useState(user.name);
  const [location, setLocation] = useState(user.location ?? '');
  const [prevUser, setPrevUser] = useState(user);

  if (
    user.id !== prevUser.id ||
    user.name !== prevUser.name ||
    user.location !== prevUser.location
  ) {
    setPrevUser(user);
    setName(user.name);
    setLocation(user.location ?? '');
  }

  const [message, setMessage] = useState<{
    status: 'success' | 'error';
    text: string;
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setErrors(null);

    const formData = new FormData(e.currentTarget);
    const name = (formData.get('name') as string).trim();
    const location = (formData.get('location') as string).trim();
    const file = formData.get('profilePicture') as File;

    if (name.length < 2) {
      setErrors({ name: ['Name must be at least 2 characters.'] });
      return;
    }

    try {
      // 1. Update text profile details
      await updateProfile.mutateAsync({
        name,
        location: location || null,
      });

      // 2. Upload file if selected
      if (file && file.size > 0) {
        const fileForm = new FormData();
        fileForm.append('file', file);
        await updatePicture.mutateAsync(fileForm);
      }

      setMessage({ status: 'success', text: 'Profile updated.' });
    } catch (err) {
      setMessage({
        status: 'error',
        text: getErrorMessage(err),
      });
    }
  };

  const isPending = updateProfile.isPending || updatePicture.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {message ? (
        <div
          className={`rounded-lg p-3 text-sm border ${
            message.status === 'success'
              ? 'bg-teal-50 text-teal-800 border-teal-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {message.text}
        </div>
      ) : null}

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={Boolean(errors?.name)}
            required
          />
          <FieldError errors={errors?.name?.map((msg) => ({ message: msg }))} />
        </Field>
        <Field>
          <FieldLabel htmlFor="location">Location</FieldLabel>
          <Input
            id="location"
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="profilePicture">Profile picture</FieldLabel>
          <Input
            id="profilePicture"
            name="profilePicture"
            type="file"
            accept="image/*"
          />
        </Field>
      </FieldGroup>
      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <Loader2Icon className="size-4 animate-spin" />
        ) : (
          <SaveIcon className="size-4" />
        )}
        {isPending ? 'Saving' : 'Save profile'}
      </Button>
    </form>
  );
}

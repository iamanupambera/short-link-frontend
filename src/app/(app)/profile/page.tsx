'use client';

import { Loader2Icon } from 'lucide-react';
import { ProfileForm, useProfile } from '@/features/profile';
import { UserAvatar } from '@/components/shared/user-avatar';

export default function ProfilePage() {
  const { data: user, isLoading, isError } = useProfile();

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2Icon className="size-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="rounded-lg border border-red-950/30 bg-red-950/10 p-6 text-center text-red-400">
        <p className="font-medium">Failed to load profile details.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <UserAvatar user={user} size="lg" />
        <div>
          <h1 className="text-2xl font-semibold tracking-normal text-white">
            {user.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <section className="rounded-lg border border-border bg-card p-5">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-white">Account</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep your profile details current.
          </p>
        </div>
        <ProfileForm user={user} />
      </section>
    </div>
  );
}

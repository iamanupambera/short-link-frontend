'use client';

import { BadgeCheckIcon, ShieldCheckIcon, Loader2Icon } from 'lucide-react';
import { ProfileForm } from '@/features/profile/components/profile-form';
import { useProfile } from '@/features/profile/hooks/use-profile';

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
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700">
        <p className="font-medium">Failed to load profile details.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">Profile</h1>
        <p className="mt-1 text-sm text-slate-500">
          Account details and workspace security status.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-5">
            <h2 className="text-base font-semibold">Account</h2>
            <p className="mt-1 text-sm text-slate-500">
              Keep your profile details current.
            </p>
          </div>
          <ProfileForm user={user} />
        </section>

        <aside className="space-y-4">
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <BadgeCheckIcon className="size-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold">Email</h2>
                <p className="text-sm text-slate-500">
                  {user.isEmailVerified ? 'Verified' : 'Pending verification'}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <ShieldCheckIcon className="size-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold">Role</h2>
                <p className="text-sm text-slate-500">{user.role}</p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

'use client';

import type { User } from '@/features/profile/types/user.types';

type UserAvatarProps = {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export function UserAvatar({ user, size = 'md', className }: UserAvatarProps) {
  const initials = user.name?.slice(0, 2).toUpperCase();

  const sizeClasses = {
    sm: 'size-6 text-[10px]',
    md: 'size-8 text-xs',
    lg: 'size-16 text-lg',
  }[size];

  if (user?.profilePicture) {
    return (
      <div
        className={`relative flex shrink-0 rounded-full select-none overflow-hidden ${sizeClasses} ${className ?? ''}`}
      >
        <img
          src={user?.profilePicture}
          alt={user.name}
          className="aspect-square size-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-teal-50 font-semibold text-teal-700 select-none overflow-hidden border border-teal-100 ${sizeClasses} ${className ?? ''}`}
    >
      {initials}
    </div>
  );
}

import Link from 'next/link';
import {
  BarChart3Icon,
  CircleUserRoundIcon,
  LinkIcon,
  LogOutIcon,
  PlusIcon,
  QrCodeIcon,
} from 'lucide-react';
import { logoutAction } from '@/features/auth';
import type { User } from '@/features/profile';
import { cn } from '@/lib/utils/cn';

type DashboardShellProps = {
  user: User;
  children: React.ReactNode;
};

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: BarChart3Icon,
  },
  {
    href: '/links',
    label: 'Links',
    icon: LinkIcon,
  },
  {
    href: '/links/new',
    label: 'Create',
    icon: PlusIcon,
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: CircleUserRoundIcon,
  },
];

export function DashboardShell({ user, children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-slate-200 bg-white lg:border-r lg:border-b-0">
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-teal-600 text-white">
                <QrCodeIcon className="size-4" />
              </div>
              <div>
                <div className="text-sm font-semibold">ShortLink</div>
                <div className="text-xs text-slate-500">Share and track</div>
              </div>
            </div>

            <nav className="flex gap-1 overflow-x-auto px-3 py-3 lg:flex-1 lg:flex-col lg:overflow-visible">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex h-9 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950',
                    item.href === '/links/new' &&
                      'bg-teal-50 text-teal-700 hover:bg-teal-100 hover:text-teal-800',
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden border-t border-slate-200 p-4 lg:block">
              <div className="rounded-lg bg-slate-100 p-3">
                <div className="truncate text-sm font-medium">{user.name}</div>
                <div className="truncate text-xs text-slate-500">
                  {user.email}
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{user.name}</div>
              <div className="truncate text-xs text-slate-500">
                {user.email}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/links/new"
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-teal-600 px-3 text-sm font-medium text-white transition-colors hover:bg-teal-700"
              >
                <PlusIcon className="size-4" />
                New link
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="inline-flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950"
                  aria-label="Sign out"
                >
                  <LogOutIcon className="size-4" />
                </button>
              </form>
            </div>
          </header>

          <main className="min-w-0 flex-1 px-4 py-6 sm:px-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

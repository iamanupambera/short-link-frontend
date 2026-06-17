'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3Icon,
  CircleUserRoundIcon,
  LinkIcon,
  LogOutIcon,
  QrCodeIcon,
  MenuIcon,
  XIcon,
} from 'lucide-react';
import { logoutAction, useAuthState } from '@/features/auth';
import type { User } from '@/features/profile';
import { UserAvatar } from '@/components/shared/user-avatar';
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
    href: '/profile',
    label: 'Profile',
    icon: CircleUserRoundIcon,
  },
];

const SidebarContent = ({
  user,
  pathname,
  collapsed = false,
  isMobile = false,
  setIsMobileOpen,
  setIsCollapsed,
}: {
  user: User;
  pathname: string;
  collapsed?: boolean;
  isMobile?: boolean;
  setIsMobileOpen: (open: boolean) => void;
  setIsCollapsed: (collapsed: boolean) => void;
}) => {
  return (
    <div className="flex h-full flex-col bg-white">
      {/* Sidebar Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white">
            <QrCodeIcon className="size-4" />
          </div>
          {!collapsed && (
            <div className="min-w-0 animate-in fade-in duration-300">
              <div className="text-sm font-semibold truncate">ShortLink</div>
              <div className="text-xs text-slate-500 truncate">
                Share and track
              </div>
            </div>
          )}
        </div>

        {isMobile ? (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            aria-label="Close sidebar"
          >
            <XIcon className="size-4" />
          </button>
        ) : (
          <button
            onClick={() => setIsCollapsed(!collapsed)}
            className="hidden size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-950 lg:flex"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <MenuIcon className="size-4" />
          </button>
        )}
      </div>

      {/* Sidebar Nav */}
      <nav className="flex flex-1 flex-col gap-1 px-3 py-3 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => isMobile && setIsMobileOpen(false)}
              className={cn(
                'flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-teal-50 text-teal-600'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
                collapsed ? 'justify-center px-0' : '',
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon
                className={cn(
                  'size-4 shrink-0',
                  isActive ? 'text-teal-600' : 'text-slate-500',
                )}
              />
              {!collapsed && (
                <span className="truncate animate-in fade-in duration-300">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="border-t border-slate-200 p-4">
        {collapsed ? (
          <div className="flex justify-center">
            <UserAvatar user={user} size="sm" />
          </div>
        ) : (
          <div className="rounded-lg bg-slate-100 p-3 overflow-hidden animate-in fade-in duration-300">
            <div className="truncate text-sm font-medium">{user.name}</div>
            <div className="truncate text-xs text-slate-500">{user.email}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export function DashboardShell({
  user: initialUser,
  children,
}: DashboardShellProps) {
  const { user: clientUser } = useAuthState();
  const user = { ...initialUser, ...clientUser };
  const pathname = usePathname();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 flex">
      {/* Mobile Drawer Sidebar */}
      {isMobileOpen && (
        <>
          {/* Backdrop overlay */}
          <div
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity lg:hidden"
          />
          {/* Mobile Sidebar Content */}
          <aside className="fixed inset-y-0 left-0 z-50 w-[260px] border-r border-slate-200 shadow-xl lg:hidden animate-in slide-in-from-left duration-300">
            <SidebarContent
              user={user}
              pathname={pathname}
              isMobile
              setIsMobileOpen={setIsMobileOpen}
              setIsCollapsed={setIsCollapsed}
            />
          </aside>
        </>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden border-r border-slate-200 bg-white lg:flex lg:flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out shrink-0',
          isCollapsed ? 'w-[72px]' : 'w-[260px]',
        )}
      >
        <SidebarContent
          user={user}
          pathname={pathname}
          collapsed={isCollapsed}
          setIsMobileOpen={setIsMobileOpen}
          setIsCollapsed={setIsCollapsed}
        />
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 min-w-0 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-950 lg:hidden"
              aria-label="Open sidebar"
            >
              <MenuIcon className="size-5" />
            </button>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{user.name}</div>
              <div className="truncate text-xs text-slate-500">
                {user.email}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <UserAvatar user={user} size="md" />
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
  );
}

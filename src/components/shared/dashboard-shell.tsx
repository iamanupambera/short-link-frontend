'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3Icon,
  CircleUserRoundIcon,
  LinkIcon,
  LogOutIcon,
  Link2Icon,
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
    <div className="flex h-full flex-col bg-card">
      {/* Sidebar Header */}
      <div className="flex h-16 items-center justify-between border-b border-border px-5">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-teal-500 to-cyan-500 text-slate-950 shadow-md animate-in zoom-in-50 duration-300">
            <Link2Icon className="size-5 font-bold" />
          </div>
          {!collapsed && (
            <div className="min-w-0 animate-in fade-in duration-300">
              <div className="text-sm font-semibold truncate text-white">
                ShortLink
              </div>
              <div className="text-xs text-muted-foreground truncate">
                Share and track
              </div>
            </div>
          )}
        </div>

        {isMobile ? (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Close sidebar"
          >
            <XIcon className="size-4" />
          </button>
        ) : (
          <button
            onClick={() => setIsCollapsed(!collapsed)}
            className="hidden size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-accent hover:text-foreground lg:flex"
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
                  ? 'bg-teal-500/10 text-teal-400 font-semibold'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                collapsed ? 'justify-center px-0' : '',
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon
                className={cn(
                  'size-4 shrink-0',
                  isActive ? 'text-teal-400' : 'text-muted-foreground',
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
      <div className="border-t border-border p-4">
        {collapsed ? (
          <div className="flex justify-center">
            <UserAvatar user={user} size="sm" />
          </div>
        ) : (
          <div className="rounded-lg bg-muted/30 p-3 overflow-hidden animate-in fade-in duration-300 border border-border/50">
            <div className="truncate text-sm font-medium text-foreground">
              {user.name}
            </div>
            <div className="truncate text-xs text-muted-foreground">
              {user.email}
            </div>
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
    <div className="min-h-screen bg-background text-foreground flex relative">
      {/* Background gradients wrapper */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] size-[500px] rounded-full bg-teal-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] size-[500px] rounded-full bg-violet-500/10 blur-[120px]" />
      </div>

      {/* Mobile Drawer Sidebar */}
      {isMobileOpen && (
        <>
          {/* Backdrop overlay */}
          <div
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs transition-opacity lg:hidden"
          />
          {/* Mobile Sidebar Content */}
          <aside className="fixed inset-y-0 left-0 z-50 w-[260px] border-r border-border shadow-xl lg:hidden animate-in slide-in-from-left duration-300">
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
          'hidden border-r border-border bg-card lg:flex lg:flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out shrink-0',
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
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden"
              aria-label="Open sidebar"
            >
              <MenuIcon className="size-5" />
            </button>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-foreground">
                {user.name}
              </div>
              <div className="truncate text-xs text-muted-foreground">
                {user.email}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <UserAvatar user={user} size="md" />
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
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

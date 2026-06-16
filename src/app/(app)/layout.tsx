import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/shared/dashboard-shell';
import { getSession } from '@/lib/auth/session';

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  if (!session) {
    redirect('/auth/login');
  }

  return <DashboardShell user={session.user}>{children}</DashboardShell>;
}

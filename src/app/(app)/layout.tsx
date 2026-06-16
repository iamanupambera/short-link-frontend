import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
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

  return <DashboardLayout user={session.user}>{children}</DashboardLayout>;
}

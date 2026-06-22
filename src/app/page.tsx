import { HomePageContent } from '@/features/home/components/home-page';
import { getSession } from '@/lib/auth/session';

export default async function HomePage() {
  const session = await getSession();
  return <HomePageContent isAuthenticated={!!session} />;
}

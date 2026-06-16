import { useAuthState } from '../store/use-auth';

export function useCurrentUser() {
  const { user, isAuthenticated, accessToken, hydrated } = useAuthState();
  return { user, isAuthenticated, accessToken, hydrated };
}

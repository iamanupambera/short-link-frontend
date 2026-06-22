export async function register() {
  if (typeof window === 'undefined') {
    const { validateAllEnv } = await import('@/env');
    validateAllEnv();

    const { registerSessionPersister } = await import('@/lib/api/client');
    const { setSession } = await import('@/lib/auth/session');
    registerSessionPersister(setSession);
  }
}

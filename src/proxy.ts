import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has('shortlink.session');
  const hasRefreshToken = request.cookies.has('refresh-token');
  const canRefreshSession = hasSession || hasRefreshToken;

  const isAuthPath = pathname.includes('auth');
  const isProtectedPath = !isAuthPath && pathname !== '/' && !pathname.includes('.');

  if (isProtectedPath && !canRefreshSession) {
    const loginUrl = new URL('/auth/login', request.url);
    // Optionally: loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPath && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next (Next.js internals)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next|favicon.ico).*)',
  ],
};

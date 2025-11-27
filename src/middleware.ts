import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const hasToken = request.cookies.has('admin-auth-token');

  const isProtectedPath = path.startsWith('/ad-panel/dashboard');
  const isAdminLoginPage = path === '/ad-panel';

  // If trying to access a protected page without a token, redirect to login.
  if (isProtectedPath && !hasToken) {
    const loginUrl = new URL('/ad-panel', request.url);
    loginUrl.searchParams.set('from', path);
    return NextResponse.redirect(loginUrl);
  }

  // If on the login page with a token, redirect to the dashboard.
  if (isAdminLoginPage && hasToken) {
    const dashboardUrl = new URL('/ad-panel/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// Define the paths this middleware should apply to.
export const config = {
  matcher: ['/ad-panel/dashboard/:path*', '/ad-panel'],
};

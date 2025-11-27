import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isSessionValid(request: NextRequest): boolean {
  const authTokenCookie = request.cookies.get('admin-auth-token');
  // Check if the cookie exists and has the value 'true'
  return authTokenCookie?.value === 'true';
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith('/ad-panel/dashboard')) {
    if (!isSessionValid(request)) {
      const url = request.nextUrl.clone();
      url.pathname = '/ad-panel';
      url.search = ''; // Clear any query params
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/ad-panel/dashboard/:path*'],
};

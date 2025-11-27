
import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith('/ad-panel/dashboard')) {
    const authCookie = request.cookies.get('admin-auth');
    if (!authCookie || authCookie.value !== 'true') {
      return NextResponse.redirect(new URL('/ad-panel', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/ad-panel/dashboard/:path*'],
};

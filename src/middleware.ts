import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { initializeFirebase } from '@/firebase/server';

async function validateToken(token: string): Promise<boolean> {
  try {
    const { auth } = await initializeFirebase();
    await auth.verifyIdToken(token);
    return true;
  } catch (error) {
    console.warn('Token validation failed:', error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith('/ad-panel/dashboard')) {
    const authTokenCookie = request.cookies.get('admin-auth-token');
    
    if (!authTokenCookie || !(await validateToken(authTokenCookie.value))) {
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

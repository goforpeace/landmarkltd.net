import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';

async function isSessionValid(request: NextRequest): Promise<boolean> {
  const tokenCookie = request.cookies.get('admin-auth-token');
  if (!tokenCookie) {
    return false;
  }

  const url = request.nextUrl.clone();
  url.pathname = '/api/auth/session';
  
  try {
    const response = await fetch(url.toString(), {
      headers: {
        'Cookie': `admin-auth-token=${tokenCookie.value}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.isValid;
    }
    return false;
  } catch (error) {
    console.error('Error validating session in middleware:', error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect the dashboard
  if (path.startsWith('/ad-panel/dashboard')) {
    const valid = await isSessionValid(request);
    if (!valid) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/ad-panel';
      loginUrl.search = '';
      return NextResponse.redirect(loginUrl);
    }
  }
  // If user is logged in and tries to access login page, redirect to dashboard
  else if (path === '/ad-panel') {
    const valid = await isSessionValid(request);
    if (valid) {
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = '/ad-panel/dashboard';
      dashboardUrl.search = '';
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/ad-panel/dashboard/:path*', '/ad-panel'],
};

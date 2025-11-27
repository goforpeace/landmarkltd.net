import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { initializeFirebase } from '@/firebase/server';
import { getAuth } from 'firebase-admin/auth';

// This must run on the Node.js runtime because it uses the Firebase Admin SDK.
export const runtime = 'nodejs';

// This function initializes Firebase Admin and verifies the token.
async function verifyAdminToken(token: string): Promise<boolean> {
  if (!token) {
    return false;
  }
  try {
    initializeFirebase();
    const decodedToken = await getAuth().verifyIdToken(token, true);
    return decodedToken.isAdmin === true;
  } catch (error) {
    console.error('Error verifying auth token in middleware:', error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('admin-auth-token')?.value;

  const isProtectedPath = path.startsWith('/ad-panel/dashboard');
  const isAdminLoginPage = path === '/ad-panel';

  let isValid = false;
  if (token) {
    isValid = await verifyAdminToken(token);
  }

  // If trying to access a protected page without a valid session, redirect to login.
  if (isProtectedPath && !isValid) {
    const loginUrl = new URL('/ad-panel', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If already logged in and trying to access the login page, redirect to the dashboard.
  if (isAdminLoginPage && isValid) {
    const dashboardUrl = new URL('/ad-panel/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// Define the paths this middleware should apply to.
export const config = {
  matcher: ['/ad-panel/dashboard/:path*', '/ad-panel'],
};

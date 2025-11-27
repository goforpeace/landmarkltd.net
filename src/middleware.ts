import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { initializeFirebase as initializeFirebaseAdmin } from './firebase/server';
import { getAuth } from 'firebase-admin/auth';

export const runtime = 'nodejs';

async function isSessionValid(request: NextRequest): Promise<boolean> {
  const authTokenCookie = request.cookies.get('admin-auth-token');
  const token = authTokenCookie?.value;

  if (!token) {
    return false;
  }
  
  try {
    // We need to initialize the admin app here to verify the token
    initializeFirebaseAdmin();
    const decodedToken = await getAuth().verifyIdToken(token, true);
    // Check if the custom claim is present
    return decodedToken.isAdmin === true;
  } catch (error) {
     try {
        const decodedToken = await getAuth().verifyIdToken(token);
        return decodedToken.isAdmin === true;
     } catch (error) {
        console.error('Error verifying auth token:', error);
        return false;
     }
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith('/ad-panel/dashboard')) {
    const valid = await isSessionValid(request);
    if (!valid) {
      const url = request.nextUrl.clone();
      url.pathname = '/ad-panel';
      url.search = ''; // Clear any query params
      return NextResponse.redirect(url);
    }
  } else if (path === '/ad-panel') {
     const valid = await isSessionValid(request);
     if(valid) {
        const url = request.nextUrl.clone();
        url.pathname = '/ad-panel/dashboard';
        url.search = '';
        return NextResponse.redirect(url);
     }
  }


  return NextResponse.next();
}

export const config = {
  matcher: ['/ad-panel/dashboard/:path*', '/ad-panel'],
};

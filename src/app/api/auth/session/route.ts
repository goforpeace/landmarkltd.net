import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { initializeFirebase as initializeFirebaseAdmin } from '@/firebase/server';
import { getAuth } from 'firebase-admin/auth';

export const runtime = 'nodejs';

// This function verifies the admin token from the cookie.
async function verifyToken(token: string): Promise<boolean> {
  if (!token) {
    return false;
  }
  
  try {
    // Initialize Firebase Admin SDK
    initializeFirebaseAdmin();
    // Verify the ID token and check for the 'isAdmin' custom claim.
    const decodedToken = await getAuth().verifyIdToken(token, true); // The second argument checks for revocation
    return decodedToken.isAdmin === true;
  } catch (error) {
    // This will catch errors like expired tokens, invalid tokens, etc.
    console.error('Error verifying auth token in API route:', error);
    return false;
  }
}

// The GET handler for the /api/auth/session route.
export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('admin-auth-token')?.value;

  if (!token) {
    // No token found, so the session is not valid.
    return NextResponse.json({ isValid: false }, { status: 401 });
  }

  const isValid = await verifyToken(token);

  if (isValid) {
    // The token is valid and has the admin claim.
    return NextResponse.json({ isValid: true });
  } else {
    // The token is invalid or does not have the admin claim.
    return NextResponse.json({ isValid: false }, { status: 401 });
  }
}

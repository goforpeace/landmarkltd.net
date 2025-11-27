import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { initializeFirebase as initializeFirebaseAdmin } from '@/firebase/server';
import { getAuth } from 'firebase-admin/auth';

export const runtime = 'nodejs';

async function verifyToken(token: string): Promise<boolean> {
  if (!token) {
    return false;
  }
  
  try {
    initializeFirebaseAdmin();
    const decodedToken = await getAuth().verifyIdToken(token, true);
    return decodedToken.isAdmin === true;
  } catch (error) {
    console.error('Error verifying auth token in API route:', error);
    return false;
  }
}

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('admin-auth-token')?.value;

  if (!token) {
    return NextResponse.json({ isValid: false }, { status: 401 });
  }

  const isValid = await verifyToken(token);

  if (isValid) {
    return NextResponse.json({ isValid: true });
  } else {
    return NextResponse.json({ isValid: false }, { status: 401 });
  }
}

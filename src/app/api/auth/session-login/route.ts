import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic' // defaults to auto

// This route acts as a proxy to pass the httpOnly cookie to the client as a JSON response.
export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const tokenCookie = cookieStore.get('admin-auth-token');

  if (!tokenCookie) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Pass the token value to the client.
  return NextResponse.json({ token: tokenCookie.value });
}

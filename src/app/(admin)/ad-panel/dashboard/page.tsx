'use client';

import { useEffect } from 'react';
import { useAuth, useUser } from '@/firebase';
import { signInWithCustomToken } from 'firebase/auth';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import AdminDashboard from '@/components/admin/admin-dashboard';

export default function DashboardPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isUserLoading || !auth) return; // Wait for auth service and user status

    const token = Cookies.get('admin-auth-token');
    
    // If there is no user session, try to sign in with the token from the cookie
    if (!user && token) {
      signInWithCustomToken(auth, token).catch((error) => {
        console.error("Admin sign-in failed:", error);
        // If token is invalid, clear it and redirect to login
        Cookies.remove('admin-auth-token');
        router.push('/ad-panel');
      });
    } else if (!token) {
        // If there's no token at all, redirect to login
        router.push('/ad-panel');
    }

  }, [auth, user, isUserLoading, router]);
  
  // While checking auth state or if there's no user, show a loader
  if (isUserLoading || !user) {
    return (
        <div className="flex h-screen items-center justify-center">
            <p>Loading...</p>
        </div>
    )
  }

  return <AdminDashboard />;
}

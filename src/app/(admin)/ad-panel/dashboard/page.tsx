'use client';

import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@/firebase';
import { signInWithCustomToken } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import AdminDashboard from '@/components/admin/admin-dashboard';

export default function DashboardPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(true);

  useEffect(() => {
    if (isUserLoading || !auth) return;

    if (user) {
      // If user is already loaded (from a previous session restore), no need to sign in again.
      setIsSigningIn(false);
      return;
    }

    // This function will be called to attempt sign-in
    const attemptSignIn = async () => {
      try {
        const response = await fetch('/api/auth/session-login');
        if (!response.ok) {
          throw new Error('Could not get session token.');
        }
        const { token } = await response.json();
        
        if (token) {
          await signInWithCustomToken(auth, token);
          // onAuthStateChanged will handle the user state update
        } else {
          // If no token, redirect to login
          router.push('/ad-panel');
        }
      } catch (error) {
        console.error("Admin sign-in failed:", error);
        router.push('/ad-panel');
      } finally {
        setIsSigningIn(false);
      }
    };
    
    attemptSignIn();

  }, [auth, user, isUserLoading, router]);
  
  if (isUserLoading || isSigningIn) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // After loading, if there's still no user, redirect.
  // This can happen if the token was invalid.
  if (!user) {
    router.push('/ad-panel');
    return (
       <div className="flex h-screen items-center justify-center">
         <p>Redirecting...</p>
       </div>
    )
  }

  // If we have a user, show the dashboard
  return <AdminDashboard />;
}

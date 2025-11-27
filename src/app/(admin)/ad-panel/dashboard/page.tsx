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
      // If user is already loaded (from a previous session restore or successful sign-in), we are good.
      setIsSigningIn(false);
      return;
    }

    // If there is no user and we are done loading, attempt to sign in with the custom token.
    const attemptSignIn = async () => {
      try {
        const response = await fetch('/api/auth/session-login');
        if (!response.ok) {
          throw new Error('Could not get session token.');
        }
        const { token } = await response.json();
        
        if (token) {
          await signInWithCustomToken(auth, token);
          // The onAuthStateChanged listener in the FirebaseProvider will update the `user` state,
          // which will cause a re-render. On the next render, `user` will exist.
        } else {
          // If there's no token, they aren't logged in. Redirect.
          router.push('/ad-panel');
        }
      } catch (error) {
        console.error("Admin sign-in failed:", error);
        router.push('/ad-panel');
      } finally {
        // Set signing in to false only after the attempt is made,
        // but the redirect will handle the UI state.
        setIsSigningIn(false);
      }
    };
    
    attemptSignIn();

  }, [auth, user, isUserLoading, router]);
  
  // Show a loading screen while the initial user check is happening or while we are attempting to sign in.
  if (isUserLoading || isSigningIn) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading admin session...</p>
      </div>
    );
  }

  // After all loading and sign-in attempts, if there is still no user, they are not authorized.
  if (!user) {
    // This part should ideally not be reached if the redirects work, but serves as a final guard.
    router.push('/ad-panel');
    return (
       <div className="flex h-screen items-center justify-center">
         <p>Redirecting to login...</p>
       </div>
    );
  }

  // If we have a user, it means sign-in was successful. Show the dashboard.
  return <AdminDashboard />;
}

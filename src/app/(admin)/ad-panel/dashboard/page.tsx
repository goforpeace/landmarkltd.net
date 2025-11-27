'use client';

import { useEffect } from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import AdminDashboard from '@/components/admin/admin-dashboard';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If the initial auth state check is complete and there is still no user,
    // it means they are not logged in. Redirect them to the login page.
    if (!isUserLoading && !user) {
      router.replace('/ad-panel');
    }
  }, [user, isUserLoading, router]);

  // While we wait for the auth state, show a loading indicator.
  // This prevents the AdminDashboard from rendering and trying to fetch data
  // before we know if the user is authenticated.
  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading admin session...</p>
      </div>
    );
  }

  // If the auth check is done and we have a user, it means the sign-in
  // from the login page was successful. Render the dashboard.
  if (user) {
    return <AdminDashboard />;
  }

  // If we reach here, it means we are about to redirect, so we show a
  // loading/redirecting message to avoid a flash of unstyled content.
  return (
    <div className="flex h-screen items-center justify-center">
      <p>Redirecting to login...</p>
    </div>
  );
}

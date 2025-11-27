'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/admin/auth-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Building } from 'lucide-react';
import { useUser } from '@/firebase';

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    // If the user object exists and loading is complete, it means they are already signed in.
    // Redirect them to the dashboard.
    if (!isUserLoading && user) {
      router.replace('/ad-panel/dashboard');
    }
  }, [user, isUserLoading, router]);

  // Show a loader while checking for a user or if we are about to redirect.
  // This prevents the login form from flashing on screen for an already-logged-in user.
  if (isUserLoading || user) {
    return <div className="flex min-h-screen items-center justify-center"><p>Loading...</p></div>;
  }
  
  // If no user and not loading, it's safe to show the login form.
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
        <div className="flex items-center gap-2 mb-6">
            <Building className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary font-headline">Landmark Estates - Admin Panel</h1>
        </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Admin Access</CardTitle>
          <CardDescription>Enter your PIN to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm />
        </CardContent>
      </Card>
    </div>
  );
}

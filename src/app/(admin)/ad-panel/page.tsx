'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import AuthForm from '@/components/admin/auth-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Building } from 'lucide-react';
import { useUser } from '@/firebase';

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    // If the user is already signed in (from a valid token), redirect to the dashboard.
    if (!isUserLoading && user) {
      router.push('/ad-panel/dashboard');
    }
  }, [user, isUserLoading, router]);

  // While checking for user, you can show a loader or nothing
  if (isUserLoading || user) {
    return <div className="flex min-h-screen items-center justify-center"><p>Loading...</p></div>;
  }
  
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

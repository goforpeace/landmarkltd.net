'use client';

import { useState } from 'react';
import AuthForm from '@/components/admin/auth-form';
import AdminDashboard from '@/components/admin/admin-dashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Building, Loader2 } from 'lucide-react';
import { useUser } from '@/firebase';

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const [isAdminVerified, setIsAdminVerified] = useState(false);

  // If the user hook is loading, show a loading state.
  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-lg">Initializing Admin Panel...</p>
      </div>
    );
  }

  // If the user is loaded AND isAdminVerified is true, show the dashboard.
  // This is the key change: we wait for explicit verification.
  if (user && isAdminVerified) {
    return <AdminDashboard />;
  }

  // If we are not loading and there's no verified user, show the login form.
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
          {/* Pass the verification setter to the auth form */}
          <AuthForm onLoginSuccess={() => setIsAdminVerified(true)} />
        </CardContent>
      </Card>
    </div>
  );
}

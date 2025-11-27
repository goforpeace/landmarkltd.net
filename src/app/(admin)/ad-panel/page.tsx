'use client';

import { useEffect } from 'react';
import AuthForm from '@/components/admin/auth-form';
import AdminDashboard from '@/components/admin/admin-dashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Building } from 'lucide-react';
import { useUser } from '@/firebase';

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  
  // The AdminDashboard is now rendered conditionally on this page.
  // The useUser hook will update when signInWithCustomToken succeeds in AuthForm.
  // When 'user' becomes available, this component re-renders, showing the dashboard.
  if (!isUserLoading && user) {
    return <AdminDashboard />;
  }

  // Show a loading indicator while Firebase initializes, but not if the user is already found.
  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading admin panel...</p>
      </div>
    );
  }

  // If not loading and no user, show the login form.
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

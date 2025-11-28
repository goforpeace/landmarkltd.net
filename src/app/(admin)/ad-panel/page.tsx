'use client';

import { useState } from 'react';
import AuthForm from '@/components/admin/auth-form';
import AdminDashboard from '@/components/admin/admin-dashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Building } from 'lucide-react';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // If the user is logged in, show the dashboard.
  if (isLoggedIn) {
    return <AdminDashboard onLogout={() => setIsLoggedIn(false)} />;
  }

  // Otherwise, show the login form.
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
          <AuthForm onLoginSuccess={() => setIsLoggedIn(true)} />
        </CardContent>
      </Card>
    </div>
  );
}

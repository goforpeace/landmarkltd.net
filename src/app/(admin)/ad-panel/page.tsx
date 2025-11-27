import PinAuth from '@/components/admin/pin-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Building } from 'lucide-react';

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
        <div className="flex items-center gap-2 mb-6">
            <Building className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary font-headline">Landmark Estates - Admin Panel</h1>
        </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Enter Access PIN</CardTitle>
          <CardDescription>Please enter your PIN to access the admin dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <PinAuth />
        </CardContent>
      </Card>
    </div>
  );
}

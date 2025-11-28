'use client';

import AdminDashboard from '@/components/admin/admin-dashboard';

export default function AdminPage() {
  // The AdminDashboard is now rendered directly, removing the need for login state.
  return <AdminDashboard />;
}

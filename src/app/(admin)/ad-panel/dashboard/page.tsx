import AdminDashboard from '@/components/admin/admin-dashboard';
import { getProjects } from '@/lib/actions';

export default async function DashboardPage() {
    // initialMessages can be removed since we are fetching client-side
    const projects = await getProjects();
  return <AdminDashboard initialMessages={[]} initialProjects={projects} />;
}

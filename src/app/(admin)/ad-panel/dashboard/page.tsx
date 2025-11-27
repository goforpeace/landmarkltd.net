import AdminDashboard from '@/components/admin/admin-dashboard';
import { getContactMessages, getProjects } from '@/lib/actions';

export default async function DashboardPage() {
    const messages = await getContactMessages();
    const projects = await getProjects();
  return <AdminDashboard initialMessages={messages} initialProjects={projects} />;
}

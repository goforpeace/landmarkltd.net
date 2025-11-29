
import type { Project } from '@/lib/types';
import { Metadata } from 'next';
import ProjectDetailsClient from '@/components/project-details-client';


export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // This function now returns generic metadata to avoid build-time data fetching errors.
  // The specific project title will be reflected in the document title on the client side.
  return {
    title: 'Project Details | Landmark New Homes Ltd.',
    description: "Explore the details of our real estate projects.",
  };
}


export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  // This is a Server Component that passes the ID to the client component.
  return <ProjectDetailsClient id={params.id} />;
}

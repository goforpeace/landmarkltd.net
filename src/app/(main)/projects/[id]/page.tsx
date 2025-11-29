
import { getDoc, doc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase/client';
import type { Project } from '@/lib/types';
import { Metadata } from 'next';
import ProjectDetailsClient from '@/components/project-details-client';


// This function now attempts to use the client-side initialization.
// This is not ideal for server-side metadata generation but avoids the admin SDK error.
async function getProject(id: string): Promise<Project | null> {
    try {
        const { firestore } = initializeFirebase();
        const projectRef = doc(firestore, 'projects', id);
        const projectSnap = await getDoc(projectRef);
        if (projectSnap.exists()) {
            return { id: projectSnap.id, ...projectSnap.data() } as Project;
        }
    } catch (e) {
        console.error("Failed to fetch project for metadata:", e)
    }
    return null;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const project = await getProject(params.id);

  if (!project) {
    return {
      title: 'Project Details | Landmark New Homes Ltd.',
      description: "Explore the details of our real estate projects."
    };
  }

  const title = project.metaTitle || `${project.title} | Landmark New Homes Ltd.`;
  const description = project.metaDescription || project.shortDescription;
  const keywords = project.metaKeywords || '';
  const imageUrl = project.images && project.images.length > 0 ? project.images[0] : '';


  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
     twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}


export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  // This is now a Server Component. It passes the ID to the client component.
  return <ProjectDetailsClient id={params.id} />;
}

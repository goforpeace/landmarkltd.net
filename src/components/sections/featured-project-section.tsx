'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore } from '@/firebase';
import { useMemoFirebase } from '@/firebase/provider';
import { collection, query, where, limit } from 'firebase/firestore';
import type { Project } from '@/lib/types';
import { Loader2, ArrowRight } from 'lucide-react';

function ProjectCard({ project }: { project: Project }) {
  const imageUrl = Array.isArray(project.images) && project.images.length > 0
    ? project.images[0]
    : typeof project.images === 'string'
    ? project.images
    : null;

  return (
    <div className="flex flex-col overflow-hidden rounded-lg shadow-2xl border border-primary/10 h-full">
        {imageUrl ? (
            <div className="w-full aspect-[3/4] relative overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    data-ai-hint="modern architecture"
                />
            </div>
        ) : (
            <div className="w-full aspect-[3/4] bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">No image available</p>
            </div>
        )}
        <Card className="flex-grow flex flex-col rounded-t-none border-0">
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl text-primary">{project.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center flex-grow flex flex-col">
                <p className="mb-6 text-foreground/80 max-w-2xl mx-auto flex-grow">{project.shortDescription}</p>
                <Button asChild className="mt-auto">
                    <Link href={`/projects/${project.id}`}>
                        View Details <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
    </div>
  )
}

export default function FeaturedProjectSection() {
    const firestore = useFirestore();
    const featuredProjectQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        // Fetch the projects marked as featured, limit to 2
        return query(collection(firestore, 'projects'), where('isFeatured', '==', true), limit(2));
    }, [firestore]);

    const { data: projects, isLoading } = useCollection<Project>(featuredProjectQuery);
    
  if (isLoading) {
    return (
      <section className="w-full bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
           <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
           <p className="mt-4 text-muted-foreground">Loading Featured Projects...</p>
        </div>
      </section>
    );
  }

  if (!projects || projects.length === 0) {
    return (
        <section className="w-full bg-background py-16 md:py-24">
             <div className="container mx-auto px-4 text-center">
                <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary">Featured Projects</h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">No featured projects available yet. Set one in the admin panel!</p>
            </div>
        </section>
    );
  }

  return (
    <section className="w-full bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary">Featured Projects</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">A glimpse into our commitment to excellence and luxury living.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

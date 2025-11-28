'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Project } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { BedDouble, Bath, Square, MapPin, Loader2, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useMemoFirebase } from '@/firebase/provider';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import ProjectImageGallery from '@/components/project-image-gallery';

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  const id = params.id;
  
  const projectRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'projects', id);
  }, [firestore, id]);

  const { data: project, isLoading } = useDoc<Project>(projectRef);

  if (isLoading) {
    return (
        <div className="flex h-[80vh] items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    );
  }

  if (!project) {
    notFound();
  }
  
  const images = Array.isArray(project.images) ? project.images : [];

  return (
    <div className="bg-background py-8 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-1">
             <ProjectImageGallery images={images} title={project.title} />
          </div>

          {/* Right Column: Project Details */}
          <div className="lg:col-span-1">
            <div className="mb-6">
                <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">{project.title}</h1>
                <p className="mt-2 text-lg text-muted-foreground">{project.shortDescription}</p>
            </div>
            
            <div className="mb-8">
              <h2 className="mb-4 font-headline text-2xl font-semibold text-primary">Details</h2>
              <Card className="bg-card/50">
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-5 w-5 text-primary" /> Location</span>
                    <Button asChild variant="outline" size="sm">
                      <Link href={project.location} target="_blank" rel="noopener noreferrer">
                        View Location <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-muted-foreground"><BedDouble className="h-5 w-5 text-primary" /> Bedrooms</span>
                      <span className="font-semibold">{project.bedrooms}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-muted-foreground"><Bath className="h-5 w-5 text-primary" /> Bathrooms</span>
                      <span className="font-semibold">{project.bathrooms}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-muted-foreground"><Square className="h-5 w-5 text-primary" /> Area (sqft)</span>
                      <span className="font-semibold">{project.area.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-muted-foreground">Status</span>
                      <Badge variant={project.status === 'Completed' ? 'default' : project.status === 'Sold' ? 'destructive' : 'secondary'} className="bg-primary/80 text-primary-foreground">
                          {project.status}
                      </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
                <h2 className="mb-4 font-headline text-2xl font-semibold text-primary">Project Description</h2>
                <div className="prose max-w-none text-lg leading-relaxed text-foreground/80" dangerouslySetInnerHTML={{ __html: project.description.replace(/\n/g, '<br />') }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Project, FlatType } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { BedDouble, Bath, Square, MapPin, Loader2, ArrowRight, Home } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useMemoFirebase } from '@/firebase/provider';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProjectImageGallery from '@/components/project-image-gallery';

function FlatTypeDetails({ flatType }: { flatType: FlatType }) {
  return (
    <div className="space-y-3">
       <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-muted-foreground"><Square className="h-5 w-5 text-primary" /> Area</span>
            <span className="font-semibold">{flatType.area.toLocaleString()} sqft</span>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-muted-foreground"><BedDouble className="h-5 w-5 text-primary" /> Bedrooms</span>
            <span className="font-semibold">{flatType.bedrooms}</span>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-muted-foreground"><Bath className="h-5 w-5 text-primary" /> Bathrooms</span>
            <span className="font-semibold">{flatType.bathrooms}</span>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-muted-foreground"><Home className="h-5 w-5 text-primary" /> Verandas</span>
            <span className="font-semibold">{flatType.verandas}</span>
        </div>
    </div>
  );
}


export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const firestore = useFirestore();
  
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
  
  const images = Array.isArray(project.images) ? project.images.filter(img => img && typeof img === 'string') : [];

  return (
    <div className="bg-background py-8 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            
          <div className="lg:col-span-1">
             <ProjectImageGallery images={images} title={project.title} />
          </div>

          <div className="lg:col-span-1">
            <div className="mb-6">
                <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">{project.title}</h1>
                <p className="mt-2 text-lg text-muted-foreground">{project.shortDescription}</p>
            </div>

            <Card className="mb-8 bg-card/50">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl font-semibold text-primary">Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                        <span className="flex items-center gap-2 text-muted-foreground">Status</span>
                        <Badge variant={project.status === 'Completed' ? 'default' : project.status === 'Sold' ? 'destructive' : 'secondary'} className="bg-primary/80 text-primary-foreground">
                            {project.status}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {project.flatTypes && project.flatTypes.length > 0 && (
              <div className="mb-8 space-y-6">
                  <h2 className="font-headline text-2xl font-semibold text-primary">Available Units</h2>
                  {project.flatTypes.map((flatType, index) => (
                      <Card key={index} className="bg-card/50">
                          <CardHeader>
                              <CardTitle className="font-headline text-xl text-primary">{flatType.name}</CardTitle>
                          </CardHeader>
                          <CardContent>
                              <FlatTypeDetails flatType={flatType} />
                          </CardContent>
                      </Card>
                  ))}
              </div>
            )}
            
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

'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Project } from '@/lib/types';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BedDouble, Bath, Square, MapPin, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useMemoFirebase } from '@/firebase/provider';

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  const id = params.id;
  
  // Create a memoized reference to the Firestore document.
  // This is critical to prevent re-renders and ensure the hook works correctly.
  const projectRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'projects', id);
  }, [firestore, id]);

  const { data: project, isLoading, error } = useDoc<Project>(projectRef);

  // 1. Handle the loading state explicitly.
  // While isLoading is true, show a spinner and do nothing else.
  if (isLoading) {
    return (
        <div className="flex h-[80vh] items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    );
  }

  // 2. Handle the "Not Found" state AFTER loading is complete.
  // If loading is finished and there's still no project (or an error occurred),
  // then it's safe to show the 404 page.
  if (!project) {
    notFound();
  }
  
  // 3. If we've reached this point, loading is complete and the project exists.
  // Ensure images is always an array to prevent runtime errors.
  const images = Array.isArray(project.images) ? project.images : [project.images].filter(Boolean) as string[];

  return (
    <div className="bg-background py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="font-headline text-4xl font-bold text-primary md:text-6xl">{project.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{project.shortDescription}</p>
        </div>

        <Card className="mb-12 overflow-hidden shadow-2xl">
          <CardContent className="p-0">
            {images.length > 0 ? (
                <Carousel className="w-full">
                <CarouselContent>
                    {images.map((img, index) => (
                    <CarouselItem key={index}>
                        <div className="relative aspect-[16/9] w-full">
                        <Image
                            src={img}
                            alt={`${project.title} image ${index + 1}`}
                            fill
                            className="object-cover"
                            data-ai-hint="architecture detail"
                        />
                        </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4" />
                <CarouselNext className="absolute right-4" />
                </Carousel>
            ) : (
                <div className="flex aspect-[16/9] w-full items-center justify-center bg-muted">
                    <p className="text-muted-foreground">No image available</p>
                </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
          <div className="md:col-span-2">
            <h2 className="mb-4 font-headline text-3xl font-semibold text-primary">Project Description</h2>
            <div className="prose max-w-none text-lg leading-relaxed text-foreground/80" dangerouslySetInnerHTML={{ __html: project.description.replace(/\n/g, '<br />') }} />
          </div>
          <div>
            <h2 className="mb-4 font-headline text-3xl font-semibold text-primary">Details</h2>
            <Card className="bg-card/50">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-5 w-5 text-primary" /> Location</span>
                    <span className="font-semibold">{project.location}</span>
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
        </div>
      </div>
    </div>
  );
}

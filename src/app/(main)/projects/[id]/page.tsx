'use client';

import { useMemo } from 'react';
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
  
  const projectRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'projects', id);
  }, [firestore, id]);

  const { data: project, isLoading, error } = useDoc<Project>(projectRef);

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-[80vh]">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    );
  }

  // After loading, if there's an error or the project is null (doesn't exist), show 404.
  if (error || (!project && !isLoading)) {
    notFound();
  }
  
  // This check is for TypeScript to be sure `project` is not null past this point.
  if (!project) {
    return null;
  }

  // Ensure images is always an array to prevent runtime errors.
  const images = Array.isArray(project.images) ? project.images : [project.images].filter(Boolean) as string[];

  return (
    <div className="bg-background py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary">{project.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{project.shortDescription}</p>
        </div>

        <Card className="overflow-hidden shadow-2xl mb-12">
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
                <div className="aspect-[16/9] w-full bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">No image available</p>
                </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div className="md:col-span-2">
            <h2 className="font-headline text-3xl font-semibold text-primary mb-4">Project Description</h2>
            <p className="text-lg text-foreground/80 leading-relaxed">
              {project.description}
            </p>
          </div>
          <div>
            <h2 className="font-headline text-3xl font-semibold text-primary mb-4">Details</h2>
            <Card className="bg-card/50">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-5 h-5 text-primary" /> Location</span>
                    <span className="font-semibold">{project.location}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground"><BedDouble className="w-5 h-5 text-primary" /> Bedrooms</span>
                    <span className="font-semibold">{project.bedrooms}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground"><Bath className="w-5 h-5 text-primary" /> Bathrooms</span>
                    <span className="font-semibold">{project.bathrooms}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground"><Square className="w-5 h-5 text-primary" /> Area (sqft)</span>
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

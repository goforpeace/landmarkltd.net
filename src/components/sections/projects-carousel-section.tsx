'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore } from '@/firebase';
import { useMemoFirebase } from '@/firebase/provider';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Project } from '@/lib/types';
import Autoplay from 'embla-carousel-autoplay';
import { Loader2 } from 'lucide-react';

export default function ProjectsCarouselSection() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  const firestore = useFirestore();
  const projectsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'projects'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: projects, isLoading } = useCollection<Project>(projectsQuery);

  return (
    <section id="projects" className="w-full bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary">Our Projects</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">A portfolio of our finest creations, designed for modern living.</p>
        </div>
        
        {isLoading && (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && projects && projects.length > 0 && (
          <Carousel
            plugins={[plugin.current]}
            className="w-full max-w-6xl mx-auto"
            opts={{
              align: 'start',
              loop: true,
            }}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent className="-ml-4">
              {projects.map((project) => {
                 const imageUrl = Array.isArray(project.images) && project.images.length > 0
                    ? project.images[0]
                    : typeof project.images === 'string'
                    ? project.images
                    : null;
                
                return(
                <CarouselItem key={project.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="overflow-hidden group flex flex-col h-full shadow-md hover:shadow-xl transition-shadow duration-300">
                     {imageUrl && (
                      <div className="relative aspect-[3/4] w-full">
                        <Image
                          src={imageUrl}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          data-ai-hint="modern architecture"
                        />
                      </div>
                     )}
                      <CardContent className="p-4 flex flex-col flex-grow bg-card">
                        <h3 className="font-headline text-xl font-semibold text-primary">{project.title}</h3>
                        <p className="text-muted-foreground text-sm mt-1 flex-grow">{project.shortDescription.substring(0, 80)}...</p>
                        <Button asChild variant="secondary" size="sm" className="mt-4 w-full">
                          <Link href={`/projects/${project.id}`}>View Project</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              )})}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}

        {!isLoading && (!projects || projects.length === 0) && (
            <div className="text-center text-muted-foreground">
                <p>No projects have been added yet. Check back soon!</p>
            </div>
        )}
      </div>
    </section>
  );
}

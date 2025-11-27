'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { projects } from '@/lib/data';
import Autoplay from 'embla-carousel-autoplay';

export default function ProjectsCarouselSection() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <section id="projects" className="w-full bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary">Our Projects</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">A portfolio of our finest creations, designed for modern living.</p>
        </div>
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
            {projects.map((project) => (
              <CarouselItem key={project.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="overflow-hidden group">
                    <CardContent className="p-0">
                      <div className="relative aspect-w-4 aspect-h-3">
                        <Image
                          src={project.images[0]}
                          alt={project.title}
                          width={600}
                          height={400}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          data-ai-hint="modern architecture"
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0" />
                      </div>
                      <div className="absolute bottom-0 left-0 p-4 w-full">
                        <h3 className="font-headline text-xl font-semibold text-white">{project.title}</h3>
                        <Button asChild variant="secondary" size="sm" className="mt-2 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30">
                          <Link href={`/projects/${project.id}`}>View Project</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="ml-14" />
          <CarouselNext className="mr-14" />
        </Carousel>
      </div>
    </section>
  );
}

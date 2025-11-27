'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore } from '@/firebase';
import { useMemoFirebase } from '@/firebase/provider';
import { collection, query, where, limit } from 'firebase/firestore';
import type { Project } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function FeaturedProjectSection() {
    const firestore = useFirestore();
    const featuredProjectQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        // Fetch the project marked as featured
        return query(collection(firestore, 'projects'), where('isFeatured', '==', true), limit(1));
    }, [firestore]);

    const { data: projects, isLoading } = useCollection<Project>(featuredProjectQuery);
    const featuredProject = projects?.[0];

  if (isLoading) {
    return (
      <section className="w-full bg-background py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
           <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
           <p className="mt-4 text-muted-foreground">Loading Featured Project...</p>
        </div>
      </section>
    );
  }

  if (!featuredProject) {
    return (
        <section className="w-full bg-background py-16 md:py-24">
             <div className="container mx-auto px-4 text-center">
                <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary">Featured Project</h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">No featured project available yet. Set one in the admin panel!</p>
            </div>
        </section>
    );
  }

  const imageUrl = Array.isArray(featuredProject.images) && featuredProject.images.length > 0
    ? featuredProject.images[0]
    : typeof featuredProject.images === 'string'
    ? featuredProject.images
    : null;


  return (
    <section className="w-full bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary">Featured Project</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">A glimpse into our commitment to excellence and luxury living.</p>
        </div>
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="lg:mt-[-50px] z-10">
                <Card className="shadow-2xl border-2 border-primary/10">
                    <CardHeader>
                        <CardTitle className="font-headline text-3xl text-primary">{featuredProject.title}</CardTitle>
                        <CardDescription className="text-base">{featuredProject.shortDescription}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-2"><strong>Location:</strong> {featuredProject.location}</p>
                        <p className="mb-6 text-foreground/80">{featuredProject.description.substring(0, 150)}...</p>
                        <Button asChild className="bg-primary hover:bg-primary/90">
                            <Link href={`/projects/${featuredProject.id}`}>View Details</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:mb-[-50px]">
                <Card className="overflow-hidden shadow-2xl">
                     {imageUrl ? (
                        <div className="aspect-w-4 aspect-h-3">
                            <Image
                                src={imageUrl}
                                alt={featuredProject.title}
                                width={800}
                                height={600}
                                className="w-full h-full object-cover"
                                data-ai-hint="modern architecture"
                            />
                        </div>
                    ) : (
                        <div className="aspect-w-4 aspect-h-3 bg-muted flex items-center justify-center">
                            <p className="text-muted-foreground">No image available</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
      </div>
    </section>
  );
}

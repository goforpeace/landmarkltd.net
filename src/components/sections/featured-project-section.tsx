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
import { Loader2, ArrowRight } from 'lucide-react';

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
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-0">
             {imageUrl ? (
                <div className="w-full aspect-[3/4] md:aspect-video relative rounded-t-lg overflow-hidden shadow-2xl">
                    <Image
                        src={imageUrl}
                        alt={featuredProject.title}
                        fill
                        className="object-cover"
                        data-ai-hint="modern architecture"
                    />
                </div>
            ) : (
                <div className="w-full aspect-video bg-muted flex items-center justify-center rounded-t-lg">
                    <p className="text-muted-foreground">No image available</p>
                </div>
            )}
            <Card className="w-full overflow-hidden shadow-2xl border-2 border-primary/10 rounded-b-lg rounded-t-none">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-3xl text-primary">{featuredProject.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="mb-8 text-foreground/80 max-w-2xl mx-auto">{featuredProject.shortDescription}</p>
                    <Button asChild size="lg">
                        <Link href={`/projects/${featuredProject.id}`}>
                            View Details <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </section>
  );
}

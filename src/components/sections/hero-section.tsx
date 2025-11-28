'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, PhoneCall } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CallbackRequestForm from '@/components/callback-request-form';

export default function HeroSection() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-background');

  return (
    <section className="relative h-[80vh] min-h-[500px] w-full flex items-center justify-center text-center text-white">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          priority
          className="object-cover"
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 p-4 max-w-4xl mx-auto">
        <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
          Where every square foot tells a story....
        </h1>
        <p className="mt-4 md:mt-6 text-lg md:text-xl max-w-2xl mx-auto text-white/90">
          Discover exceptional properties crafted with passion, precision, and a vision for the future.
        </p>
        <div className="mt-8 md:mt-10 flex justify-center gap-4">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base px-8 py-6 rounded-full shadow-lg transition-transform hover:scale-105">
            <Link href="/#projects">
              Explore Projects <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
                <Button size="lg" variant="outline" className="bg-transparent border-accent text-accent hover:bg-accent hover:text-accent-foreground font-semibold text-base px-8 py-6 rounded-full shadow-lg transition-transform hover:scale-105">
                    <PhoneCall className="mr-2 h-5 w-5" /> Request a Call
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Request a Callback</DialogTitle>
                    <DialogDescription>
                        Enter your details below and we'll call you back as soon as possible.
                    </DialogDescription>
                </DialogHeader>
                <CallbackRequestForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}

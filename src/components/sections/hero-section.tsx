
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, PhoneCall, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CallbackRequestForm from '@/components/callback-request-form';
import SplitText from '../split-text';
import { useDoc, useFirestore } from '@/firebase';
import { useMemoFirebase } from '@/firebase/provider';
import { doc } from 'firebase/firestore';
import type { SiteSettings } from '@/lib/types';

export default function HeroSection() {
  const defaultHeroImage = PlaceHolderImages.find(img => img.id === 'hero-background');
  
  const firestore = useFirestore();
  const settingsRef = useMemoFirebase(() => {
      if (!firestore) return null;
      return doc(firestore, 'site_settings', 'homepage_settings');
  }, [firestore]);

  const { data: settings, isLoading } = useDoc<SiteSettings>(settingsRef);

  const heroImage = !isLoading && settings?.heroImageUrl 
    ? { imageUrl: settings.heroImageUrl, description: 'Hero background image', imageHint: 'landscape architecture' }
    : defaultHeroImage;

  return (
    <section className="relative h-[80vh] min-h-[500px] w-full flex items-center justify-center text-center text-white">
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin" />
        </div>
      )}
      {!isLoading && heroImage && (
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
        <SplitText
          text="Where every square foot tells a story...."
          tag="h1"
          className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
          splitType="chars,words"
          from={{ y: 20, opacity: 0 }}
          to={{ y: 0, opacity: 1 }}
          delay={30}
          duration={0.6}
        />
        <p className="mt-4 md:mt-6 text-lg md:text-xl max-w-2xl mx-auto text-white/90">
          Discover exceptional properties crafted with passion, precision, and a vision for the future.
        </p>
        <div className="mt-8 md:mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base px-8 py-6 rounded-full shadow-lg transition-transform hover:scale-105 w-full sm:w-auto">
            <Link href="/#projects">
              Explore Projects <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
                <Button size="lg" variant="outline" className="bg-transparent border-accent text-accent hover:bg-accent hover:text-accent-foreground font-semibold text-base px-8 py-6 rounded-full shadow-lg transition-transform hover:scale-105 w-full sm:w-auto">
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

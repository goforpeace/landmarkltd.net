import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CtaSection() {
  return (
    <section className="w-full bg-secondary">
      <div className="container mx-auto px-4 py-16 md:py-24 text-center">
        <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary">Let's Get Started</h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Ready to find your perfect home or start your next project? Our team is here to help you every step of the way.
        </p>
        <div className="mt-8">
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-base px-10 py-6 rounded-full shadow-lg transition-transform hover:scale-105">
            <Link href="/contact">
              Contact Us <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

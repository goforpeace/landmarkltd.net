import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function DreamHomeSection() {
  const dreamHomeImage = PlaceHolderImages.find(img => img.id === 'dream-home');

  return (
    <section className="w-full bg-background">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <Card className="bg-primary text-primary-foreground p-8 md:p-12 shadow-xl rounded-lg">
                <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">A Home That Reflects Your Success</h2>
                <p className="text-lg text-primary-foreground/80">
                    You've worked hard to get where you are. It's time for a home that celebrates your achievements. Our properties are designed for discerning individuals who appreciate fine living, impeccable design, and a location that puts them at the center of it all.
                </p>
            </Card>
          </div>
          <div className="order-1 md:order-2">
            {dreamHomeImage && (
              <div className="relative aspect-w-4 aspect-h-3 w-full overflow-hidden rounded-lg shadow-2xl">
                <Image
                  src={dreamHomeImage.imageUrl}
                  alt={dreamHomeImage.description}
                  fill
                  className="object-cover"
                  data-ai-hint={dreamHomeImage.imageHint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 md:p-8">
                  <h2 className="font-headline text-3xl md:text-4xl font-bold text-white">Your Dream Home Awaits</h2>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Dummy Card component to avoid import errors if not available
const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={className}>{children}</div>
);

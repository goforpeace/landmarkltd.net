import { getProjectById } from '@/lib/actions';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BedDouble, Bath, Square, MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default async function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const project = await getProjectById(params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="bg-background py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary">{project.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{project.shortDescription}</p>
        </div>

        <Card className="overflow-hidden shadow-2xl mb-12">
          <CardContent className="p-0">
            <Carousel className="w-full">
              <CarouselContent>
                {project.images.map((img, index) => (
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
                    <span className="font-semibold">{project.details.location}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground"><BedDouble className="w-5 h-5 text-primary" /> Bedrooms</span>
                    <span className="font-semibold">{project.details.bedrooms}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground"><Bath className="w-5 h-5 text-primary" /> Bathrooms</span>
                    <span className="font-semibold">{project.details.bathrooms}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground"><Square className="w-5 h-5 text-primary" /> Area (sqft)</span>
                    <span className="font-semibold">{project.details.area.toLocaleString()}</span>
                </div>
                <Separator />
                 <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground">Status</span>
                    <Badge variant={project.details.status === 'Completed' ? 'default' : project.details.status === 'Sold' ? 'destructive' : 'secondary'} className="bg-primary/80 text-primary-foreground">
                        {project.details.status}
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

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { type EmblaCarouselType } from 'embla-carousel';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

type PropType = {
  images: string[];
  title: string;
};

const ProjectImageGallery: React.FC<PropType> = (props) => {
  const { images, title } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mainApi, setMainApi] = useState<EmblaCarouselType>();
  const [thumbApi, setThumbApi] = useState<EmblaCarouselType>();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxApi, setLightboxApi] = useState<EmblaCarouselType>();

  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainApi || !thumbApi) return;
      mainApi.scrollTo(index);
    },
    [mainApi, thumbApi]
  );

  const onSelect = useCallback(() => {
    if (!mainApi || !thumbApi) return;
    setSelectedIndex(mainApi.selectedScrollSnap());
    thumbApi.scrollTo(mainApi.selectedScrollSnap());
  }, [mainApi, thumbApi]);

  useEffect(() => {
    if (!mainApi) return;
    onSelect();
    mainApi.on('select', onSelect);
    mainApi.on('reInit', onSelect);
  }, [mainApi, onSelect]);


  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setIsLightboxOpen(true);
  };
  
  useEffect(() => {
    if (isLightboxOpen && lightboxApi) {
        lightboxApi.scrollTo(selectedIndex, true);
    }
  }, [isLightboxOpen, lightboxApi, selectedIndex]);

  if (!images || images.length === 0) {
     return (
        <div className="flex aspect-[3/4] w-full items-center justify-center rounded-lg bg-muted shadow-inner">
            <p className="text-muted-foreground">No images available</p>
        </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <Carousel setApi={setMainApi} className="overflow-hidden rounded-lg">
          <CarouselContent>
            {images.map((img, index) => (
              <CarouselItem
                key={index}
                onClick={() => openLightbox(index)}
                className="cursor-pointer"
              >
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src={img}
                    alt={`${title} image ${index + 1}`}
                    fill
                    className="object-cover"
                    data-ai-hint="architecture detail"
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {images.length > 1 && (
            <>
              <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />
              <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />
            </>
          )}
        </Carousel>


        {images.length > 1 && (
            <div className="overflow-hidden">
                <div className="flex -ml-2">
                    {images.map((img, index) => (
                    <div
                        className={`relative min-w-0 flex-[0_0_25%] md:flex-[0_0_20%] pl-2 cursor-pointer rounded-md overflow-hidden ring-offset-background ring-offset-2 focus:outline-none focus:ring-2 focus:ring-primary`}
                        onClick={() => onThumbClick(index)}
                        key={index}
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && onThumbClick(index)}
                    >
                        <div
                        className={`absolute inset-0 rounded-md ring-2 ring-primary transition-opacity ${
                            index === selectedIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                        />
                        <div className="relative aspect-square w-full rounded-md overflow-hidden">
                        <Image
                            src={img}
                            alt={`${title} thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                            data-ai-hint="architecture detail"
                            sizes="100px"
                        />
                        <div
                            className={`absolute inset-0 bg-black/50 transition-opacity ${
                            index === selectedIndex ? 'opacity-0' : 'opacity-100 hover:opacity-50'
                            }`}
                        />
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        )}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-none w-screen h-screen p-0 bg-black/80 border-0 rounded-none shadow-none flex items-center justify-center">
          <DialogTitle className="sr-only">{`${title} - Image Preview`}</DialogTitle>
          <Carousel
            setApi={setLightboxApi}
            opts={{ startIndex: selectedIndex, loop: true }}
            className="w-full h-full"
          >
            <CarouselContent className="h-full">
              {images.map((img, index) => (
                <CarouselItem key={index} className="h-full flex items-center justify-center p-4">
                  <Image
                    src={img}
                    alt={`${title} image ${index + 1}`}
                    width={1920}
                    height={1080}
                    className="object-contain h-auto max-h-full w-auto max-w-full"
                    sizes="100vw"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {images.length > 1 && (
              <>
                <CarouselPrevious className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10" />
                <CarouselNext className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10" />
              </>
            )}
          </Carousel>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectImageGallery;

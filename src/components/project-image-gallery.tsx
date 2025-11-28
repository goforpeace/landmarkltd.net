'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { type EmblaCarouselType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
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

  const [mainRef, mainApiHook] = useEmblaCarousel({
    loop: true,
    containScroll: 'keepSnaps',
    align: 'start',
  });

  const [thumbRef, thumbApiHook] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
    align: 'start',
  });

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
    if (!mainApiHook) return;
    setMainApi(mainApiHook);
  }, [mainApiHook]);
  
  useEffect(() => {
    if (!thumbApiHook) return;
    setThumbApi(thumbApiHook);
  }, [thumbApiHook]);

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
  
  if (!images || images.length === 0) {
     return (
        <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-muted shadow-inner md:aspect-[4/3]">
            <p className="text-muted-foreground">No images available</p>
        </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {/* Main Carousel with Navigation */}
        <Carousel setApi={setMainApi} className="overflow-hidden rounded-lg">
          <CarouselContent>
            {images.map((img, index) => (
              <CarouselItem
                key={index}
                onClick={() => openLightbox(index)}
                className="cursor-pointer"
              >
                <div className="relative aspect-square w-full md:aspect-[4/3]">
                  <Image
                    src={img}
                    alt={`${title} image ${index + 1}`}
                    fill
                    className="object-cover"
                    data-ai-hint="architecture detail"
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
        </Carousel>


        {/* Thumbnails Carousel */}
        {images.length > 1 && (
            <div className="overflow-hidden" ref={thumbRef}>
            <div className="flex -ml-2">
                {images.map((img, index) => (
                <div
                    className={`relative min-w-0 flex-[0_0_25%] md:flex-[0_0_20%] pl-2 cursor-pointer rounded-md overflow-hidden ring-2 ring-transparent transition-all`}
                    onClick={() => onThumbClick(index)}
                    key={index}
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
                    />
                     <div
                        className={`absolute inset-0 bg-black/50 transition-opacity ${
                        index === selectedIndex ? 'opacity-0' : 'opacity-100'
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
        <DialogContent className="max-w-5xl w-full p-2 bg-transparent border-0 shadow-none">
          <Carousel
            opts={{ startIndex: selectedIndex, loop: true }}
            className="w-full"
          >
            <CarouselContent>
              {images.map((img, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-video w-full">
                    <Image
                      src={img}
                      alt={`${title} image ${index + 1}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {images.length > 1 && (
              <>
                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 md:left-[-50px]" />
                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 md:right-[-50px]" />
              </>
            )}
          </Carousel>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectImageGallery;

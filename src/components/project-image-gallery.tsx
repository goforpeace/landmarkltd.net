'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { EmblaCarouselType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

type PropType = {
  images: string[];
  title: string;
};

const ProjectImageGallery: React.FC<PropType> = (props) => {
  const { images, title } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mainApi, setMainApi] = useState<EmblaCarouselType | undefined>();
  const [thumbApi, setThumbApi] = useState<EmblaCarouselType | undefined>();
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
  }, [mainApi, thumbApi, setSelectedIndex]);

  useEffect(() => {
    if (!mainApi) return;
    onSelect();
    mainApi.on('select', onSelect);
    mainApi.on('reInit', onSelect);

    setMainApi(mainApiHook);
  }, [mainApi, onSelect, mainApiHook]);

  useEffect(() => {
    if (!thumbApiHook) return;
    setThumbApi(thumbApiHook);
  }, [thumbApiHook]);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setIsLightboxOpen(true);
  };
  
  if (images.length === 0) {
     return (
        <div className="flex aspect-[4/5] w-full items-center justify-center rounded-lg bg-muted shadow-inner">
            <p className="text-muted-foreground">No images available</p>
        </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Main Carousel */}
        <div className="overflow-hidden rounded-lg" ref={mainRef}>
          <div className="flex">
            {images.map((img, index) => (
              <div
                className="relative min-w-0 flex-[0_0_100%] cursor-pointer"
                key={index}
                onClick={() => openLightbox(index)}
              >
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src={img}
                    alt={`${title} image ${index + 1}`}
                    fill
                    className="object-cover"
                    data-ai-hint="architecture detail"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Thumbnails Carousel */}
        <div className="overflow-hidden" ref={thumbRef}>
          <div className="flex gap-3">
            {images.map((img, index) => (
              <div
                className={`relative min-w-0 flex-[0_0_28%] md:flex-[0_0_22%] cursor-pointer rounded-md overflow-hidden ring-2 ring-transparent transition-all ${
                  index === selectedIndex ? '!ring-primary' : ''
                }`}
                onClick={() => onThumbClick(index)}
                key={index}
              >
                <div className="relative aspect-square w-full">
                  <Image
                    src={img}
                    alt={`${title} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    data-ai-hint="architecture detail"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-5xl w-full p-2 bg-transparent border-0 shadow-none">
          <div className="relative aspect-video w-full">
             <Image
              src={images[selectedIndex]}
              alt={`${title} image ${selectedIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectImageGallery;

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Eye } from 'lucide-react';
import { GalleryImage } from '@/types/clinic';
import LightboxModal from './LightboxModal';

interface GallerySectionProps {
  images: GalleryImage[];
}

export default function GallerySection({ images }: GallerySectionProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const openLightbox = (index: number) => {
    setActivePhotoIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section id="gallery" className="w-full bg-white py-10 sm:py-12 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#153E70]">
            Our Clinic Gallery
          </h2>
          <button
            onClick={() => openLightbox(0)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0878F9] hover:text-[#0667d6] transition-colors group cursor-pointer"
          >
            <span>View All Photos</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Gallery Thumbnails Grid (7 images matching reference screenshot) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
          {images.slice(0, 7).map((image, idx) => (
            <div
              key={image.id || idx}
              onClick={() => openLightbox(idx)}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-xs hover:shadow-md cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
            >
              <Image
                src={image.image_url}
                alt={image.title || `Clinic photo ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-108"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                <span className="text-[11px] font-medium text-white line-clamp-1 flex items-center gap-1">
                  <Eye className="w-3 h-3 shrink-0" />
                  {image.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        images={images}
        currentIndex={activePhotoIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIdx) => setActivePhotoIndex(newIdx)}
      />
    </section>
  );
}

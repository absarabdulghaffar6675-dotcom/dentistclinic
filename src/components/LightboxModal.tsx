'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryImage } from '@/types/clinic';

interface LightboxModalProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export default function LightboxModal({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: LightboxModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        onNavigate((currentIndex - 1 + images.length) % images.length);
      }
      if (e.key === 'ArrowRight') {
        onNavigate((currentIndex + 1) % images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6 transition-all">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none"
        aria-label="Close Lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev button */}
      <button
        onClick={() => onNavigate((currentIndex - 1 + images.length) % images.length)}
        className="absolute left-3 sm:left-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all hover:scale-110 focus:outline-none"
        aria-label="Previous Photo"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Next button */}
      <button
        onClick={() => onNavigate((currentIndex + 1) % images.length)}
        className="absolute right-3 sm:right-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all hover:scale-110 focus:outline-none"
        aria-label="Next Photo"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Main Image Container */}
      <div className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center">
        <div className="relative w-full h-[60vh] sm:h-[70vh] rounded-xl overflow-hidden shadow-2xl">
          <Image
            src={currentImage.image_url}
            alt={currentImage.title || 'Dynasty Dental Solutions'}
            fill
            className="object-contain"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </div>

        {/* Caption */}
        <div className="mt-4 text-center max-w-2xl px-4">
          <h3 className="text-white text-base sm:text-lg font-semibold tracking-wide">
            {currentImage.title}
          </h3>
          {currentImage.description && (
            <p className="text-white/70 text-xs sm:text-sm mt-1">
              {currentImage.description}
            </p>
          )}
          <span className="text-white/40 text-xs mt-2 block">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      </div>
    </div>
  );
}

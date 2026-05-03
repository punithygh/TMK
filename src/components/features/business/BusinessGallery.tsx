"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Clock, Store, Grid, Camera, Upload, ChevronRight, X
} from "lucide-react";

interface BusinessGalleryProps {
  galleryImages: string[];
  title: string;
  business: any;
  calculatedRating: number;
  calculatedReviewCount: number;
  t: (kn: string, en: string) => string;
}

export default function BusinessGallery({
  galleryImages, title, business, calculatedRating, calculatedReviewCount, t
}: BusinessGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [activeGalleryDot, setActiveGalleryDot] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);

  const handleGalleryScroll = () => {
    if (galleryRef.current) {
      const scrollPosition = galleryRef.current.scrollLeft;
      const itemWidth = galleryRef.current.clientWidth;
      setActiveGalleryDot(Math.round(scrollPosition / itemWidth));
    }
  };

  const openPhotoUpload = (e: React.MouseEvent) => {
    e.stopPropagation();
    document.getElementById('photo-upload')?.click();
  };

  return (
    <>
      {/* ✅ PERFECT DESKTOP 3-IMAGE GRID (Fixed with Grid Layout) */}
      <div className="hidden md:grid grid-cols-3 gap-3 w-full h-[350px] lg:h-[400px] mb-8 group/hero-gallery">
        
        {/* Main Large Image - Left (Takes 2 columns) */}
        <div className="col-span-2 relative w-full h-full bg-gray-100 dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800/80 cursor-pointer group/main" onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}>
          {galleryImages[0] ? (
            <Image 
              src={galleryImages[0]} 
              alt={title} 
              fill 
              priority={true} 
              sizes="(max-width: 1200px) 66vw, 800px" 
              className="object-cover transition-transform duration-700 group-hover/hero-gallery:scale-[1.01]" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Store className="w-20 h-20 text-slate-300 dark:text-slate-700" />
            </div>
          )}

          {/* Desktop: Open/Closed timing badge */}
          {business.is_open !== null && business.is_open !== undefined && (
            <div className={`absolute bottom-4 left-4 z-10 px-2.5 py-1.5 rounded-lg text-xs font-extrabold tracking-widest uppercase shadow-md backdrop-blur-md flex items-center gap-1.5 ${business.is_open ? 'bg-emerald-500/90 text-white border border-emerald-400/50' : 'bg-rose-500/90 text-white border border-rose-400/50'}`}>
              <Clock size={13} /> {business.is_open ? t("ಈಗ ತೆರೆದಿದೆ", "Open Now") : t("ಮುಚ್ಚಲಾಗಿದೆ", "Closed")}
            </div>
          )}
        </div>

        {/* Side Small Images - Right Stack (Takes 1 column) */}
        <div className="col-span-1 w-full h-full flex flex-col gap-3">
          {/* Top Small Image */}
          {galleryImages.length > 1 ? (
            <div className="flex-1 w-full relative bg-gray-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 cursor-pointer overflow-hidden group/small-1" onClick={() => { setLightboxIndex(1); setLightboxOpen(true); }}>
              <Image 
                src={galleryImages[1]} 
                alt={`${title} Photo 2`} 
                fill 
                sizes="(max-width: 1200px) 33vw, 400px" 
                className="object-cover hover:scale-[1.05] transition-transform duration-500" 
              />
            </div>
          ) : (
            <div className="flex-1 w-full bg-gray-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-800/80">
              <Store className="w-10 h-10 text-slate-200 dark:text-slate-800" />
            </div>
          )}

          {/* Bottom Small Image */}
          {galleryImages.length > 2 ? (
            <div className="flex-1 w-full relative bg-gray-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 cursor-pointer overflow-hidden group/jd-more" onClick={() => { setLightboxIndex(2); setLightboxOpen(true); }}>
              <Image 
                src={galleryImages[2]} 
                alt={`${title} Photo 3`} 
                fill 
                sizes="(max-width: 1200px) 33vw, 400px" 
                className="object-cover group-hover/jd-more:scale-[1.05] transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-3 right-3 bg-white/20 backdrop-blur-md text-white px-3 py-2 rounded-xl border border-white/30 flex items-center gap-2 hover:bg-white/30 transition-all z-10 shadow-xl">
                <Grid size={16} className="text-white drop-shadow-md" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest drop-shadow-md">{galleryImages.length > 3 ? `+${galleryImages.length - 2} View All` : 'View Gallery'}</span>
              </div>
              
              {/* Add Photo Button */}
              <button onClick={openPhotoUpload} className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white p-2 rounded-full border border-white/20 hover:bg-red-600 dark:hover:bg-sky-500 transition-all z-10 shadow-lg group/add">
                <Camera size={16} className="group-hover/add:animate-pulse" />
              </button>
            </div>
          ) : (
            <div className="flex-1 w-full bg-gray-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center border border-gray-200 dark:border-slate-800/80">
              <Store className="w-10 h-10 text-slate-200 dark:text-slate-800" />
            </div>
          )}
        </div>
      </div>

      {/* ✅ PERFECT MOBILE CAROUSEL (Fixed missing h-full) */}
      <div className="md:hidden relative w-full mb-4">
        {/* Carousel Container */}
        <div ref={galleryRef} onScroll={handleGalleryScroll} className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide w-full h-[250px] rounded-xl shadow-sm border border-gray-100 dark:border-slate-800" style={{ WebkitOverflowScrolling: 'touch' }}>
          {galleryImages.length > 0 ? galleryImages.map((img, i) => (
            /* Fixed: Added h-full and w-full here to ensure Image component gets right bounds */
            <div key={i} className="min-w-full w-full h-full flex-none shrink-0 snap-center relative" onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}>
              <Image 
                src={img} 
                alt={`${title} ${i + 1}`} 
                fill 
                priority={i === 0} 
                sizes="100vw" 
                className="object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none"></div>
            </div>
          )) : (
            <div className="min-w-full w-full h-full flex-none shrink-0 flex items-center justify-center bg-gray-100 dark:bg-slate-900">
              <Store className="w-16 h-16 text-slate-300 dark:text-slate-700" />
            </div>
          )}
        </div>

        {/* Mobile Carousel Dots/Counter */}
        {galleryImages.length > 1 && (
          <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-lg border border-white/20 pointer-events-none">
            {activeGalleryDot + 1}/{galleryImages.length}
          </span>
        )}
      </div>

      {/* ✅ LIGHTBOX MODAL (No changes needed, was already fine) */}
      {lightboxOpen && galleryImages.length > 0 && (
        <div className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
          
          {/* Lightbox Header */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
            <span className="text-white font-bold">{lightboxIndex + 1} / {galleryImages.length}</span>
            <div className="flex items-center gap-4">
              <button onClick={openPhotoUpload} className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-lg">
                <Upload size={16} /> {t("ಫೋಟೋ ಸೇರಿಸಿ", "Add Photo")}
              </button>
              <button className="text-white bg-white/10 rounded-full p-2 hover:bg-white/20 transition-colors" onClick={() => setLightboxOpen(false)}>
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Navigation & Image */}
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/10 rounded-full p-2 hover:bg-white/20 disabled:opacity-30" disabled={lightboxIndex === 0} onClick={e => { e.stopPropagation(); setLightboxIndex(i => i - 1); }}>
            <ChevronRight size={24} className="rotate-180" />
          </button>
          
          {/* Lightbox Image using standard <img> tag for precise aspect ratio scaling */}
          <img src={galleryImages[lightboxIndex]} alt={`Photo ${lightboxIndex + 1}`} className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl" onClick={e => e.stopPropagation()} />
          
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/10 rounded-full p-2 hover:bg-white/20 disabled:opacity-30" disabled={lightboxIndex === galleryImages.length - 1} onClick={e => { e.stopPropagation(); setLightboxIndex(i => i + 1); }}>
            <ChevronRight size={24} />
          </button>

          {/* Lightbox Thumbnails indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {galleryImages.map((_, i) => (
              <button key={i} onClick={e => { e.stopPropagation(); setLightboxIndex(i); }} className={`w-2 h-2 rounded-full transition-all shadow-md ${i === lightboxIndex ? 'bg-white w-5' : 'bg-white/40 hover:bg-white/60'}`} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
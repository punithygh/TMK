"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Star, BadgeCheck, ShieldCheck, Sparkles, TrendingUp, PhoneCall, Clock, Store,
  Grid, Camera, Upload, ChevronRight, X
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

  // ✅ Fix: Uses document.getElementById to trigger file upload from parent
  const openPhotoUpload = (e: React.MouseEvent) => {
    e.stopPropagation();
    document.getElementById('photo-upload')?.click();
  };

  return (
    <>
      {/* ✅ PERFECT DESKTOP 3-IMAGE GRID (Original Design Restored) */}
      <div className="hidden md:flex gap-3 w-full h-[350px] lg:h-[400px] mb-8 group/hero-gallery">
        
        {/* Main Large Image - Left (Spans 66.6%) */}
        <div className="w-[66.6%] relative h-full bg-gray-100 dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800/80 cursor-pointer group/main" onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}>
          {galleryImages[0] ? <Image src={galleryImages[0]} alt={title} fill priority={true} sizes="(max-width: 1200px) 66vw, 800px" className="object-cover transition-transform duration-700 group-hover/hero-gallery:scale-[1.01]" /> : <div className="w-full h-full flex items-center justify-center"><Store className="w-20 h-20 text-slate-300 dark:text-slate-700" /></div>}

          {/* Desktop Bottom-Left Overlay */}
          <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-2 items-start pointer-events-none">
            {/* Rating Box */}
            <div className="bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/20 shadow-lg flex items-center gap-2 cursor-pointer hover:bg-black/80 transition-colors pointer-events-auto" onClick={(e) => { e.stopPropagation(); document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' }); }}>
              {calculatedRating > 0 || calculatedReviewCount > 0 ? (
                <>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} className={s <= Math.round(calculatedRating) ? "fill-amber-500 text-amber-500" : "fill-white/30 text-white/30"} />
                    ))}
                  </div>
                  <span className="text-white font-extrabold text-sm leading-none">{calculatedRating.toFixed(1)}</span>
                  <span className="text-white/80 text-xs leading-none">({calculatedReviewCount})</span>
                </>
              ) : (
                <div className="flex items-center gap-1.5 text-white/90 text-xs font-semibold">
                  <Star size={14} className="text-white/60" /> {t("ಹೊಸತು - ವಿಮರ್ಶೆಗಳಿಲ್ಲ", "New - No reviews")}
                </div>
              )}
            </div>

            {/* Badges Row */}
            <div className="flex flex-wrap gap-1.5 pointer-events-none">
              {(business.is_verified || business.is_claimed) && <div className="bg-sky-500 text-white px-2 py-0.5 rounded text-[11px] font-extrabold flex items-center gap-1 shadow-md backdrop-blur-md border border-sky-400"><BadgeCheck size={12} fill="white" className="text-sky-500" /> {t("ಪರಿಶೀಲಿಸಲಾಗಿದೆ", "Claimed")}</div>}
              {business.is_trusted && <div className="bg-emerald-500 text-white px-2 py-0.5 rounded text-[11px] font-extrabold flex items-center gap-1 shadow-md backdrop-blur-md border border-emerald-400"><ShieldCheck size={12} /> {t("ವಿಶ್ವಾಸಾರ್ಹ", "Trusted")}</div>}
              {business.is_featured && <div className="bg-amber-500 text-white px-2 py-0.5 rounded text-[11px] font-extrabold flex items-center gap-1 shadow-md backdrop-blur-md border border-amber-400"><Sparkles size={12} /> {t("ವೈಶಿಷ್ಟ್ಯಪೂರ್ಣ", "Featured")}</div>}
              {business.is_top_search && <div className="bg-rose-500 text-white px-2 py-0.5 rounded text-[11px] font-extrabold flex items-center gap-1 shadow-md backdrop-blur-md border border-rose-400"><TrendingUp size={12} /> {t("ಟಾಪ್ ಸರ್ಚ್", "Top Search")}</div>}
              {business.high_call_rate && <div className="bg-indigo-500 text-white px-2 py-0.5 rounded text-[11px] font-extrabold flex items-center gap-1 shadow-md backdrop-blur-md border border-indigo-400"><PhoneCall size={12} /> {t("ಹೆಚ್ಚಿನ ಕರೆ", "High Response")}</div>}
            </div>

            {/* Timing Badge */}
            {business.is_open !== null && business.is_open !== undefined && (
              <div className={`px-2 py-1 rounded text-xs font-extrabold tracking-widest uppercase shadow-md backdrop-blur-md flex items-center gap-1.5 ${business.is_open ? 'bg-emerald-500/90 text-white border border-emerald-400/50' : 'bg-rose-500/90 text-white border border-rose-400/50'}`}>
                <Clock size={12} /> {business.is_open ? t("ಈಗ ತೆರೆದಿದೆ", "Open Now") : t("ಮುಚ್ಚಲಾಗಿದೆ", "Closed")}
              </div>
            )}
          </div>
        </div>

        {/* Side Small Images - Right Stack (Spans 34%) */}
        <div className="w-[34%] h-full flex flex-col gap-3">
          {galleryImages.length > 1 ? (
            <div className="flex-1 relative bg-gray-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 cursor-pointer overflow-hidden group/small-1" onClick={() => { setLightboxIndex(1); setLightboxOpen(true); }}>
              <Image src={galleryImages[1]} alt={`${title} Photo 2`} fill sizes="(max-width: 1200px) 33vw, 400px" className="object-cover hover:scale-[1.05] transition-transform duration-500" />
            </div>
          ) : <div className="flex-1 bg-gray-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-800/80"><Store className="w-10 h-10 text-slate-200 dark:text-slate-800" /></div>}

          {galleryImages.length > 2 ? (
            <div className="flex-1 relative bg-gray-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 cursor-pointer overflow-hidden group/jd-more" onClick={() => { setLightboxIndex(2); setLightboxOpen(true); }}>
              <Image src={galleryImages[2]} alt={`${title} Photo 3`} fill sizes="(max-width: 1200px) 33vw, 400px" className="object-cover group-hover/jd-more:scale-[1.05] transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-3 right-3 bg-white/20 backdrop-blur-md text-white px-3 py-2 rounded-xl border border-white/30 flex items-center gap-2 hover:bg-white/30 transition-all z-10 shadow-xl">
                <Grid size={16} className="text-white drop-shadow-md" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest drop-shadow-md">{galleryImages.length > 3 ? `+${galleryImages.length - 2} View All` : 'View Gallery'}</span>
              </div>
              
              {/* Add Photo Button (Desktop) */}
              <button onClick={openPhotoUpload} className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white p-2 rounded-full border border-white/20 hover:bg-red-600 dark:hover:bg-sky-500 transition-all z-10 shadow-lg group/add">
                <Camera size={16} className="group-hover/add:animate-pulse" />
              </button>
            </div>
          ) : <div className="flex-1 bg-gray-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center border border-gray-200 dark:border-slate-800/80"><Store className="w-10 h-10 text-slate-200 dark:text-slate-800" /></div>}
        </div>
      </div>

      {/* ✅ PERFECT MOBILE CAROUSEL (Fixed Layout & Border) */}
      <div className="md:hidden relative w-full mb-4">
        {/* Carousel Container */}
        <div ref={galleryRef} onScroll={handleGalleryScroll} className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide w-full h-[250px] rounded-xl shadow-sm border border-gray-100 dark:border-slate-800" style={{ WebkitOverflowScrolling: 'touch' }}>
          {galleryImages.length > 0 ? galleryImages.map((img, i) => (
            <div key={i} className="min-w-full w-full flex-none shrink-0 snap-center relative" onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}>
              <Image src={img} alt={`${title} ${i + 1}`} fill priority={i === 0} sizes="100vw" className="object-cover w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none"></div>
            </div>
          )) : <div className="min-w-full w-full flex-none shrink-0 flex items-center justify-center bg-gray-100 dark:bg-slate-900"><Store className="w-16 h-16 text-slate-300 dark:text-slate-700" /></div>}
        </div>

        {/* Mobile Bottom-Left Overlay */}
        <div className="absolute bottom-3 left-3 z-10 flex flex-col gap-1.5 items-start pointer-events-none">
          {/* Rating Box */}
          <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/20 shadow-lg flex items-center cursor-pointer hover:bg-black/80 transition-colors pointer-events-auto" onClick={(e) => { e.stopPropagation(); document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' }); }}>
            {calculatedRating > 0 || calculatedReviewCount > 0 ? (
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={12} className={s <= Math.round(calculatedRating) ? "fill-amber-500 text-amber-500" : "fill-white/30 text-white/30"} />
                  ))}
                </div>
                <span className="text-white font-extrabold text-xs leading-none">{calculatedRating.toFixed(1)}</span>
                <span className="text-white/80 text-[10px] leading-none">({calculatedReviewCount})</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-white/80 text-[10px] font-medium">
                <Star size={12} className="text-white/50" /> {t("ಹೊಸತು - ವಿಮರ್ಶೆಗಳಿಲ್ಲ", "New - No reviews")}
              </div>
            )}
          </div>

          {/* Mobile Badges */}
          <div className="flex flex-wrap gap-1 pointer-events-none">
            {(business.is_verified || business.is_claimed) && <div className="bg-sky-600 text-white px-1.5 py-0.5 rounded text-[9px] font-extrabold flex items-center gap-1 shadow-md border border-sky-500"><BadgeCheck size={9} fill="white" className="text-sky-500" /> {t("ಪರಿಶೀಲಿಸಲಾಗಿದೆ", "Claimed")}</div>}
            {business.is_trusted && <div className="bg-emerald-700 text-white px-1.5 py-0.5 rounded text-[9px] font-extrabold flex items-center gap-1 shadow-md border border-emerald-600"><ShieldCheck size={9} /> {t("ವಿಶ್ವಾಸಾರ್ಹ", "Trusted")}</div>}
          </div>

          {/* Mobile Timing */}
          {business.is_open !== null && business.is_open !== undefined && (
            <div className={`px-2 py-0.5 rounded text-[9px] font-extrabold tracking-widest uppercase shadow-md flex items-center gap-1 ${business.is_open ? 'bg-emerald-700 text-white border border-emerald-600' : 'bg-rose-700 text-white border border-rose-600'}`}>
              <Clock size={10} /> {business.is_open ? t("ಈಗ ತೆರೆದಿದೆ", "Open Now") : t("ಮುಚ್ಚಲಾಗಿದೆ", "Closed")}
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

      {/* ✅ LIGHTBOX MODAL (Fullscreen Image Viewer) */}
      {lightboxOpen && galleryImages.length > 0 && (
        <div className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
          
          {/* Lightbox Header with Title & Add Photo */}
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
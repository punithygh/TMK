"use client"; // 🚨 ಕ್ಲೈಂಟ್ ಸೈಡ್ ಇಮೇಜ್ ಎರರ್ ಹ್ಯಾಂಡ್ಲಿಂಗ್‌ಗಾಗಿ

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, ArrowRight, Store, BadgeCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext"; // 🚨 ಗ್ಲೋಬಲ್ ಭಾಷೆ ಹುಕ್

// 🚨 100% ACCURATE DJANGO DRF MAPPING
export interface BusinessListDTO {
  id: number;
  name: string;
  name_kn?: string | null;
  slug: string;
  slug_kn?: string | null;
  business_area_slug: string;
  category_name: string;
  category_name_kn?: string | null;
  area: string;
  area_kn?: string | null;
  main_image_upload?: string | null; 
  rating: number;
  is_verified: boolean;
  pure_veg?: boolean;
  emergency_24x7?: boolean;
  image_url?: string | null;
}

interface ProductCardProps {
  product: BusinessListDTO;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [imgError, setImgError] = useState(false);
  const { lang, t } = useLanguage(); // 🚨 ಭಾಷೆ ಮತ್ತು ಅನುವಾದ ಹೆಲ್ಪರ್

  if (!product) return null;

  // 🚀 Premium Feature: Exact Data Mapping + Global Language Sync
  // t(ಕನ್ನಡ ಟೆಕ್ಸ್ಟ್, ಇಂಗ್ಲಿಷ್ ಟೆಕ್ಸ್ಟ್) 
  const title = t(product.name_kn, product.name) || t("ಹೆಸರು ಲಭ್ಯವಿಲ್ಲ", "Name Not Available");
  const location = t(product.area_kn, product.area) || t("ತುಮಕೂರು", "Tumkur");
  const category = t(product.category_name_kn, product.category_name) || t("ಸಾಮಾನ್ಯ", "General");
  
  // ಭಾಷೆಗೆ ತಕ್ಕಂತೆ ಸ್ಲಗ್ ಕಳುಹಿಸುವುದು (ಕನ್ನಡ ಸೆಲೆಕ್ಟ್ ಆಗಿದ್ದರೆ slug_kn, ಇಲ್ಲದಿದ್ದರೆ slug)
  const productSlug = lang === 'kn' && product.slug_kn ? product.slug_kn : product.slug;
  const finalRouteSlug = product.business_area_slug || productSlug || `${product.id}`;
  
  const rating = product.rating || 0.0;
  const isVerified = product.is_verified || false;

  // 🚨 Perfect Image URL Normalizer
  let finalImgSrc = product.main_image_upload || product.image_url;
  
  if (finalImgSrc) {
    finalImgSrc = finalImgSrc.trim(); 
    if (!finalImgSrc.startsWith('http')) {
      let backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      if (typeof window !== 'undefined') {
        const host = window.location.hostname === 'localhost' ? '127.0.0.1' : window.location.hostname;
        backendUrl = `http://${host}:8000`;
      }
      finalImgSrc = `${backendUrl}${finalImgSrc.startsWith('/') ? '' : '/'}${finalImgSrc}`;
    }
  }

  // ಚಿತ್ರ ಇದೆಯೇ ಎಂದು ಚೆಕ್ ಮಾಡುವ ಲಾಜಿಕ್
  const hasValidImage = finalImgSrc && finalImgSrc.trim() !== "" && !imgError;

  return (
    <div className="group bg-white dark:bg-[#0a1120] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800/80 hover:border-sky-500/30 hover:shadow-[0_10px_30px_rgba(14,165,233,0.15)] hover:-translate-y-2 transition-all duration-400 flex flex-col h-full relative">
      
      {/* 1. Image Section with Next.js Error Handling */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center border-b border-slate-200 dark:border-slate-800/80 shrink-0">
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0a1120] via-transparent to-transparent opacity-80 z-10" />
        {hasValidImage ? (
          <Image
            src={finalImgSrc as string}
            alt={title as string}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgError(true)} // 🚨 ಇಮೇಜ್ ಲೋಡ್ ಆಗದಿದ್ದರೆ ಫಾಲ್‌ಬ್ಯಾಕ್ ಟ್ರಿಗರ್ ಮಾಡುತ್ತದೆ
            unoptimized={finalImgSrc?.includes('googleusercontent.com') ? true : false} // ಗೂಗಲ್ ಇಮೇಜ್‌ಗಳಿಗಾಗಿ ಫಿಕ್ಸ್
          />
        ) : (
          <>
            <Store size={48} className="text-slate-300 dark:text-slate-700 mb-2 drop-shadow-sm" strokeWidth={1.5} />
            <span className="text-[10px] font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
              {t("ಚಿತ್ರವಿಲ್ಲ", "No Image")}
            </span>
          </>
        )}
        
        {/* Category Tag */}
        <div className="absolute top-3 left-3 z-20">
          <span className="bg-white/90 dark:bg-black/60 backdrop-blur-md text-sky-600 dark:text-sky-400 text-[10px] font-bold px-3 py-1 rounded-md shadow-sm uppercase tracking-wider border border-sky-200 dark:border-sky-500/20">
            {category}
          </span>
        </div>
      </div>

      {/* 2. Content Section */}
      <div className="p-5 flex flex-col flex-grow relative z-20">
        <div className="flex items-center justify-between mb-3 border-b border-slate-200 dark:border-slate-800/80 pb-3">
          <div className="flex items-center text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-500/20">
            <Star size={14} fill="currentColor" />
            <span className="ml-1.5 text-xs font-bold">{rating}</span>
          </div>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded-md uppercase border border-slate-200 dark:border-slate-700">
            ID: {product.id}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1 flex items-center gap-1.5 drop-shadow-sm dark:drop-shadow-md" title={title as string}>
          {title}
          {isVerified && <BadgeCheck size={18} className="text-sky-500 dark:text-sky-400 shrink-0 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" />}
        </h3>

        {/* Special Badges - Pure Veg & Emergency 24x7 */}
        {(product.pure_veg || product.emergency_24x7) && (
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {product.pure_veg && (
              <span className="inline-flex items-center gap-1 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold px-2.5 py-0.5 rounded-md border border-green-200 dark:border-green-500/20">
                🌱 {t("ಸಾಕಾಹಾರ", "Veg")}
              </span>
            )}
            {product.emergency_24x7 && (
              <span className="inline-flex items-center gap-1 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-bold px-2.5 py-0.5 rounded-md border border-red-200 dark:border-red-500/20">
                🚨 {t("24/7", "24/7")}
              </span>
            )}
          </div>
        )}

        {/* Location */}
        <div className="flex items-start space-x-2 text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2 min-h-[40px]">
          <MapPin size={16} className="shrink-0 mt-0.5 text-sky-500 dark:text-sky-400" />
          <span>{location}</span>
        </div>

        {/* 3. Action Button */}
        <div className="mt-auto">
          {/* ಭವಿಷ್ಯದಲ್ಲಿ ಬ್ಯುಸಿನೆಸ್ ಡೀಟೇಲ್ಸ್ ಪೇಜ್‌ಗೆ ಲಿಂಕ್ ಹೋಗುತ್ತದೆ */}
          <Link 
            href={`/business/${finalRouteSlug}`}
            className="inline-flex items-center justify-center w-full px-6 py-2.5 border border-slate-300 dark:border-slate-700 text-sm font-bold rounded-xl text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 dark:hover:text-white hover:border-sky-500 dark:hover:border-sky-400 hover:shadow-[0_0_15px_rgba(14,165,233,0.3)] transition-all duration-300 gap-2 group/btn"
          >
            {t("ವಿವರಗಳನ್ನು ನೋಡಿ", "View Details")}
            <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
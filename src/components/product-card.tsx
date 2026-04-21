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
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      finalImgSrc = `${backendUrl}${finalImgSrc.startsWith('/') ? '' : '/'}${finalImgSrc}`;
    }
  }

  // ಚಿತ್ರ ಇದೆಯೇ ಎಂದು ಚೆಕ್ ಮಾಡುವ ಲಾಜಿಕ್
  const hasValidImage = finalImgSrc && finalImgSrc.trim() !== "" && !imgError;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-sky-500/50 hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300 flex flex-col h-full relative">
      
      {/* 1. Image Section with Next.js Error Handling */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center border-b border-slate-100">
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
            <Store size={48} className="text-slate-300 mb-2 drop-shadow-sm" strokeWidth={1.5} />
            <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
              {t("ಚಿತ್ರವಿಲ್ಲ", "No Image")}
            </span>
          </>
        )}
        
        {/* Category Tag */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-white/95 backdrop-blur-md text-sky-600 text-[10px] font-black px-3 py-1 rounded-md shadow-sm uppercase tracking-wide border border-sky-50">
            {category}
          </span>
        </div>
      </div>

      {/* 2. Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
            <Star size={14} fill="currentColor" />
            <span className="ml-1 text-xs font-bold text-amber-700">{rating}</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md uppercase border border-slate-100">
            ID: {product.id}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors line-clamp-1 flex items-center gap-1.5" title={title as string}>
          {title}
          {isVerified && <BadgeCheck size={18} className="text-sky-500 shrink-0" />}
        </h3>

        {/* Special Badges - Pure Veg & Emergency 24x7 */}
        {(product.pure_veg || product.emergency_24x7) && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {product.pure_veg && (
              <span className="inline-flex items-center gap-0.5 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded border border-green-200">
                🌱 {t("ಸಾಕಾಹಾರ", "Veg")}
              </span>
            )}
            {product.emergency_24x7 && (
              <span className="inline-flex items-center gap-0.5 bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded border border-red-200">
                🚨 {t("24/7", "24/7")}
              </span>
            )}
          </div>
        )}

        {/* Location */}
        <div className="flex items-start space-x-2 text-slate-500 text-sm mb-6 line-clamp-2 min-h-[40px]">
          <MapPin size={16} className="shrink-0 mt-0.5 text-sky-400" />
          <span>{location}</span>
        </div>

        {/* 3. Action Button */}
        <div className="mt-auto">
          {/* ಭವಿಷ್ಯದಲ್ಲಿ ಬ್ಯುಸಿನೆಸ್ ಡೀಟೇಲ್ಸ್ ಪೇಜ್‌ಗೆ ಲಿಂಕ್ ಹೋಗುತ್ತದೆ */}
          <Link 
            href={`/business/${finalRouteSlug}`}
            className="inline-flex items-center justify-center w-full px-6 py-2.5 border-2 border-slate-100 text-sm font-semibold rounded-xl text-slate-700 bg-white hover:bg-sky-600 hover:text-white hover:border-sky-600 transition-all gap-2 group/btn"
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
"use client"; // 🚨 ಕ್ಲೈಂಟ್ ಸೈಡ್ ಇಮೇಜ್ ಎರರ್ ಹ್ಯಾಂಡ್ಲಿಂಗ್‌ಗಾಗಿ

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, ArrowRight, Store, BadgeCheck } from "lucide-react";

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
  main_image_upload?: string | null; // Django ನಿಂದ ಬರುವ ಇಮೇಜ್ ಲಿಂಕ್
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

  if (!product) return null;

  // 🚀 Premium Feature: Exact Data Mapping from Django Serializer
  const title = product.name_kn || product.name || "ಹೆಸರು ಲಭ್ಯವಿಲ್ಲ";
  const location = product.area_kn || product.area || "ತುಮಕೂರು";
  const category = product.category_name_kn || product.category_name || "ಸಾಮಾನ್ಯ";
  const slug = product.business_area_slug || product.slug || `${product.id}`;
  const rating = product.rating || 0.0;
  const isVerified = product.is_verified || false;

// 🚨 Perfect Image URL Normalizer (src/components/product-card.tsx ನಲ್ಲಿ)
 let finalImgSrc = product.main_image_upload || product.image_url;
  
  if (finalImgSrc) {
    finalImgSrc = finalImgSrc.trim(); // ಸ್ಪೇಸ್‌ಗಳನ್ನು ತೆಗೆಯುವುದು
    if (!finalImgSrc.startsWith('http')) {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      finalImgSrc = `${backendUrl}${finalImgSrc.startsWith('/') ? '' : '/'}${finalImgSrc}`;
    }
  }

  // ಚಿತ್ರ ಇದೆಯೇ ಎಂದು ಚೆಕ್ ಮಾಡುವ ಲಾಜಿಕ್
  const hasValidImage = finalImgSrc && finalImgSrc.trim() !== "" && !imgError;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col h-full relative">
      
      {/* 1. Image Section with Next.js Error Handling */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center border-b border-slate-100">
        {hasValidImage ? (
          <Image
            src={finalImgSrc as string}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgError(true)} // 🚨 ಇಮೇಜ್ ಲೋಡ್ ಆಗದಿದ್ದರೆ ಫಾಲ್‌ಬ್ಯಾಕ್ ಟ್ರಿಗರ್ ಮಾಡುತ್ತದೆ
          />
        ) : (
          <>
            <Store size={48} className="text-slate-300 mb-2 drop-shadow-sm" strokeWidth={1.5} />
            <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">ಚಿತ್ರವಿಲ್ಲ</span>
          </>
        )}
        
        {/* Category Tag */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-white/95 backdrop-blur-md text-blue-600 text-[10px] font-black px-3 py-1 rounded-md shadow-sm uppercase tracking-wide border border-blue-50">
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
        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1 flex items-center gap-1.5" title={title}>
          {title}
          {isVerified && <BadgeCheck size={18} className="text-blue-500 shrink-0" />}
        </h3>

        {/* Location */}
        <div className="flex items-start space-x-2 text-slate-500 text-sm mb-6 line-clamp-2 min-h-[40px]">
          <MapPin size={16} className="shrink-0 mt-0.5 text-blue-400" />
          <span>{location}</span>
        </div>

        {/* 3. Action Button */}
        <div className="mt-auto">
          <Link 
            href={`/listings/${slug}`}
            className="inline-flex items-center justify-center w-full px-6 py-2.5 border-2 border-slate-100 text-sm font-semibold rounded-xl text-slate-700 bg-white hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all gap-2 group/btn"
          >
            ವಿವರಗಳನ್ನು ನೋಡಿ
            <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
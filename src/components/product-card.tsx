"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, StarHalf, MapPin, Phone, MessageCircle, Navigation, Heart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getSupabaseImageUrl } from "@/utils/imageUtils";

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
  review_count?: number;
  is_verified: boolean;
  pure_veg?: boolean;
  emergency_24x7?: boolean;
  image_url?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  address?: string | null;
  // Backend dynamic features
  is_top_search?: boolean;
  is_featured?: boolean;
  is_trusted?: boolean;
  is_currently_open?: boolean;
  dynamic_badges?: string[];
}

interface ProductCardProps {
  product: BusinessListDTO;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [imgError, setImgError] = useState(false);
  const { lang, t } = useLanguage();

  if (!product) return null;

  const title = t(product.name_kn, product.name) || t("ಹೆಸರು ಲಭ್ಯವಿಲ್ಲ", "Name Not Available");
  const location = t(product.area_kn, product.area) || t("ತುಮಕೂರು", "Tumkur");
  const category = t(product.category_name_kn, product.category_name) || t("ಸಾಮಾನ್ಯ", "General");
  const address = product.address || `${location}, Tumkur`;
  
  const productSlug = lang === 'kn' && product.slug_kn ? product.slug_kn : product.slug;
  const finalRouteSlug = productSlug || product.business_area_slug || `${product.id}`;
  
  // ✅ Fixed: No fake 5.0 default — only show real rating from DB
  const parsedRating = Number(product.rating);
  const displayRating = (!isNaN(parsedRating) && parsedRating > 0) ? parsedRating : null;
  const reviewCount = product.review_count || 0; 
  
  const isVerified = product.is_verified || false;
  // Backend driven "open" status. Defaulting to true visually if undefined.
  const isOpen = product.is_currently_open !== false; 

  const imageUrl = product.main_image_upload || product.image_url;
  // 🚀 context:'card' = 400px WebP — saves ~70% bandwidth vs full 1600px hero images
  const finalImgSrc = useMemo(() => getSupabaseImageUrl(imageUrl, { context: 'card', fallbackCategory: product.category_name }), [imageUrl, product.category_name]);

  const hasValidImage = finalImgSrc && finalImgSrc.trim() !== "" && !imgError;
  const displayPhone = product.phone || ""; 

  // Collect dynamic badges
  const badges = [];
  if (product.is_top_search) badges.push({ text: "Top Rated", color: "bg-amber-500 text-white border-amber-400" });
  if (product.is_featured) badges.push({ text: "Featured", color: "bg-rose-500 text-white border-rose-400" });
  if (isVerified) badges.push({ text: "Verified", color: "bg-emerald-500 text-white border-emerald-400" });
  if (product.is_trusted) badges.push({ text: "Trusted", color: "bg-red-600 dark:bg-sky-500 text-white border-red-500 dark:border-sky-400" });
  if (product.dynamic_badges) {
    product.dynamic_badges.forEach(b => badges.push({ text: b, color: "bg-purple-500 text-white border-purple-400" }));
  }

  return (
    <div className="group bg-white dark:bg-[#0a1120] rounded-xl sm:rounded-2xl md:rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800/80 hover:border-gray-300 dark:hover:border-slate-700 hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row relative mb-3 sm:mb-6">
      
      {/* 1. Image Section - Mobile: Top, Desktop: Left */}
      <div className="relative h-44 sm:h-auto sm:w-[280px] md:w-[320px] overflow-hidden bg-gray-100 dark:bg-slate-900 shrink-0 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-slate-800/80">
        {hasValidImage ? (
          <Image
            src={finalImgSrc as string}
            alt={title as string}
            fill
            sizes="(max-width: 640px) 100vw, 320px"
            className="object-cover transition-transform duration-700 group-hover:scale-110 premium-img"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800/50">
            <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mb-2">
              <span className="text-2xl font-bold text-slate-400 dark:text-slate-600">{title?.toString().charAt(0)}</span>
            </div>
          </div>
        )}
        {/* Clickable Image Overlay */}
        <Link href={`/business/${finalRouteSlug}`} className="absolute inset-0 z-10"></Link>
        
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none"></div>

        {/* Top Badges (Top Search, Hot Deal, etc.) */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-20 pr-12">
          {badges.map((badge, idx) => (
            <span key={idx} className={`${badge.color} text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide border shadow-sm backdrop-blur-md`}>
              {badge.text}
            </span>
          ))}
        </div>

        {/* Favorite Button (Heart) */}
        <button className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-rose-500 hover:border-rose-500 transition-colors shadow-lg">
          <Heart size={16} />
        </button>

        {/* Bottom Left Status (Open/Closed) over Image */}
        <div className="absolute bottom-3 left-3 z-20">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg border backdrop-blur-md ${
            isOpen 
            ? 'bg-emerald-500/90 text-white border-emerald-400/50' 
            : 'bg-red-500/90 text-white border-red-400/50'
          }`}>
            {isOpen ? t("ಈಗ ತೆರೆದಿದೆ", "Open Now") : t("ಮುಚ್ಚಲಾಗಿದೆ", "Closed")}
          </span>
        </div>
      </div>

      {/* 2. Content Section */}
      <div className="p-3 sm:p-5 flex flex-col relative z-20 bg-white dark:bg-[#0a1120] w-full">
        
        <div>

          {/* Business Name */}
          <Link href={`/business/${finalRouteSlug}`} className="block group/title mb-2">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight group-hover/title:text-red-600 dark:group-hover/title:text-sky-500 transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>
          
          {/* Yelp-style Star Rating */}
          <div className="flex items-center gap-2 mb-3">
            {displayRating !== null ? (
              <>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFull = star <= displayRating;
                    const isHalf = !isFull && star - 0.5 <= displayRating;
                    
                    if (isHalf) {
                      return (
                        <div key={star} className="relative w-4 h-4 text-amber-500">
                          <Star size={16} className="fill-slate-200 text-slate-200 dark:fill-slate-800 dark:text-slate-800 absolute top-0 left-0" />
                          <StarHalf size={16} className="fill-amber-500 absolute top-0 left-0" />
                        </div>
                      );
                    }
                    
                    return (
                      <Star 
                        key={star} 
                        size={16} 
                        className={isFull 
                          ? "fill-amber-500 text-amber-500" 
                          : "fill-slate-200 text-slate-200 dark:fill-slate-800 dark:text-slate-800"
                        } 
                      />
                    );
                  })}
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {displayRating.toFixed(1)}
                </span>
                {reviewCount > 0 && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                    ({reviewCount} {t("ವಿಮರ್ಶೆಗಳು", "reviews")})
                  </span>
                )}
              </>
            ) : (
              // ✅ No fake rating — show honest "No Rating Yet"
              <>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} className="fill-slate-200 text-slate-200 dark:fill-slate-800 dark:text-slate-800" />
                  ))}
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500 italic">
                  {t("ಇನ್ನೂ ರೇಟಿಂಗ್ ಇಲ್ಲ", "No rating yet")}
                </span>
              </>
            )}
          </div>

          {/* Landmark / Address Info */}
          <div className="flex items-start gap-1.5 text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
            <span>{address}</span>
          </div>
        </div>

        {/* 3. Action Buttons - 3 in one line */}
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-slate-800/80 flex gap-2 sm:gap-3 w-full">
          
          <a 
            href={displayPhone ? `tel:${displayPhone}` : '#'}
            onClick={(e) => { if (!displayPhone) { e.preventDefault(); alert(t("ಫೋನ್ ಸಂಖ್ಯೆ ಲಭ್ಯವಿಲ್ಲ", "Phone number not available")); } }}
            className={`flex-1 inline-flex flex-row items-center justify-center py-2 sm:py-3 rounded-lg font-bold transition-colors shadow-sm border bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200 dark:bg-slate-800 dark:text-white dark:border-slate-700 gap-1.5 sm:gap-2 group/btn`}
          >
            <Phone className={`w-5 h-5 sm:w-4 sm:h-4 ${displayPhone ? "group-hover/btn:animate-pulse" : ""}`} /> 
            <span className="hidden sm:inline text-sm font-bold">{t("ಕರೆ", "Call")}</span>
          </a>

          <a 
            href={displayPhone ? `https://wa.me/91${displayPhone.replace(/\D/g,'')}?text=${encodeURIComponent(lang === 'kn' ? `ನಮಸ್ಕಾರ, ನಾನು ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಅನ್ನು Tumkurconnect ನಲ್ಲಿ ನೋಡಿದೆ.` : `Hello, I found your profile on Tumkurconnect.`)}` : '#'}
            target={displayPhone ? "_blank" : "_self"}
            rel="noopener noreferrer"
            onClick={(e) => { if (!displayPhone) { e.preventDefault(); alert(t("ವಾಟ್ಸಾಪ್ ಸಂಖ್ಯೆ ಲಭ್ಯವಿಲ್ಲ", "WhatsApp number not available")); } }}
            className={`flex-1 inline-flex flex-row items-center justify-center py-2 sm:py-3 rounded-lg font-bold transition-colors shadow-sm border bg-green-50 text-green-700 hover:bg-green-100 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 gap-1.5 sm:gap-2 group/btn`}
          >
            <MessageCircle className={`w-5 h-5 sm:w-4 sm:h-4 ${displayPhone ? "group-hover/btn:scale-110 transition-transform" : ""}`} /> 
            <span className="hidden sm:inline text-sm font-bold">WhatsApp</span>
          </a>

          <Link 
            href={`/business/${finalRouteSlug}`}
            className="flex-1 sm:flex-[1.2] inline-flex flex-row items-center justify-center py-2 sm:py-3 bg-red-600 hover:bg-red-700 dark:bg-sky-600 dark:hover:bg-sky-700 text-white rounded-lg transition-colors shadow-sm border border-transparent gap-1.5 sm:gap-2 group/btn"
          >
            <Navigation className="w-5 h-5 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform" /> 
            <span className="hidden sm:inline text-sm font-bold">{t("ವಿವರಗಳು", "Details")}</span>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default ProductCard;

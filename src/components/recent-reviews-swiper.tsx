"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, MessageSquareQuote, Store } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { RecentReview } from "@/services/courses";

interface RecentReviewsSwiperProps {
  initialReviews: RecentReview[];
}

export default function RecentReviewsSwiper({ initialReviews = [] }: RecentReviewsSwiperProps) {
  const { lang, t } = useLanguage();
  if (!initialReviews || initialReviews.length === 0) {
    return null; // Don't render section if there are no reviews
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6 px-1">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MessageSquareQuote className="text-red-600 dark:text-sky-400" size={24} />
          {t("ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆಗಳು", "Recent Activity")}
        </h2>
      </div>

      {/* 🚨 Strict Styling Requirement: Swiper Container */}
      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory px-1 -mx-1">
        
        {/* Actual Reviews Data (Rendered Instantly via SSR) */}
        {initialReviews.map((review) => {
            const bizName = lang === 'kn' && review.business_name_kn ? review.business_name_kn : review.business_name;
            const bizSlug = review.category_slug_en || review.category_slug; // Fallback to handle URL structures

            return (
              <div 
                key={review.id} 
                className="min-w-[280px] md:min-w-[320px] max-w-[320px] flex-shrink-0 bg-white dark:bg-[#0c1220] border border-red-200 dark:border-slate-800 rounded-2xl p-5 snap-center md:snap-start shadow-lg hover:border-red-300 dark:hover:border-sky-500/30 transition-all duration-300 flex flex-col h-full"
              >
                {/* User Info & Rating */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-sky-500/10 text-red-600 dark:text-sky-500 flex items-center justify-center font-bold text-lg border border-red-200 dark:border-sky-500/20">
                      {review.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-slate-900 dark:text-white font-semibold text-sm truncate max-w-[120px]">
                        {review.user_name}
                      </h3>
                      <p className="text-slate-500 text-xs">
                        {new Date(review.created_at).toLocaleDateString(lang === 'kn' ? 'kn-IN' : 'en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-md border border-amber-200 dark:border-amber-500/20">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span className="text-amber-600 dark:text-amber-500 font-bold text-xs">{review.rating}</span>
                  </div>
                </div>

                {/* Review Comment */}
                <p className="text-slate-700 dark:text-slate-300 text-sm line-clamp-3 mb-4 flex-1">
                  "{review.comment}"
                </p>

                {/* Business Link */}
                <Link 
                  href={`/business/${review.business_area_slug}`} 
                  className="mt-auto flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-red-400 dark:hover:border-sky-500 hover:bg-slate-100 dark:hover:bg-slate-800 p-2.5 rounded-xl transition-all group no-underline"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-sky-500/10 flex items-center justify-center shrink-0">
                    <Store className="w-4 h-4 text-red-600 dark:text-sky-500" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
                      {t("ರಿವ್ಯೂ ಮಾಡಿದ ಸ್ಥಳ", "Reviewed At")}
                    </span>
                    <span className="text-slate-900 dark:text-white font-bold text-xs truncate group-hover:text-red-600 dark:group-hover:text-sky-400 transition-colors">
                      {bizName}
                    </span>
                  </div>
                </Link>
              </div>
            );
          })
        }

      </div>
    </div>
  );
}

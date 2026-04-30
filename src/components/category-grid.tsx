"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext"; // 🚨 ಭಾಷೆ ಬದಲಾಯಿಸಲು ಮರಳಿ ಸೇರಿಸಲಾಗಿದೆ
import {
  Building2,
  Stethoscope,
  BedSingle,
  Utensils,
  ShoppingBag,
  Map,
  Briefcase,
  GraduationCap,
  LayoutGrid,
  MoreHorizontal
} from "lucide-react";
import Image from "next/image";
import { getSupabaseImageUrl } from "@/utils/imageUtils";

interface SubCategory {
  id: number;
  name: string;
  name_kn: string;
  slug: string;
}

interface Category {
  id: number;
  name: string;
  name_kn: string;
  slug: string;
  icon_url?: string;
  subcategories?: SubCategory[];
}

interface CategoryGridProps {
  initialCategories: Category[];
}

// 🚨 YELP STYLE: Clean dark icons, thin stroke, no colorful backgrounds
const getCategoryIcon = (slug: string) => {
  const iconProps = {
    className: "w-7 h-7 md:w-8 md:h-8 text-slate-800 dark:text-slate-200 transition-colors duration-300 group-hover:text-red-600 dark:group-hover:text-sky-500 group-active:text-red-600 dark:group-active:text-sky-500",
    strokeWidth: 1.5
  };

  const iconMap: Record<string, { icon: React.ReactNode }> = {
    'hotel': { icon: <Building2 {...iconProps} /> },
    'hospital': { icon: <Stethoscope {...iconProps} /> },
    'doctor': { icon: <Stethoscope {...iconProps} /> },
    'pg': { icon: <BedSingle {...iconProps} /> },
    'hostel': { icon: <BedSingle {...iconProps} /> },
    'restaurant': { icon: <Utensils {...iconProps} /> },
    'food': { icon: <Utensils {...iconProps} /> },
    'shop': { icon: <ShoppingBag {...iconProps} /> },
    'store': { icon: <ShoppingBag {...iconProps} /> },
    'real-estate': { icon: <Map {...iconProps} /> },
    'jobs': { icon: <Briefcase {...iconProps} /> },
    'education': { icon: <GraduationCap {...iconProps} /> },
    'school': { icon: <GraduationCap {...iconProps} /> },
  };

  const matchedKey = Object.keys(iconMap).find(key => slug.toLowerCase().includes(key));
  return matchedKey ? iconMap[matchedKey] : { icon: <LayoutGrid {...iconProps} /> };
};

export default function CategoryGrid({ initialCategories = [] }: CategoryGridProps) {
  const { t } = useLanguage(); // 🚨 ಭಾಷೆ ಬದಲಾಯಿಸಲು ಟಾಗಲ್
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const categories = initialCategories;

  const handleCategoryClick = (e: React.MouseEvent, category: Category) => {
    if (category.subcategories && category.subcategories.length > 0) {
      e.preventDefault();
      setSelectedCategory(category);
    }
  };

  return (
    <div className="w-full relative z-10 pt-1 bg-white dark:bg-[#050b14]">
      {/* 🚨 YELP GRID: 4 columns on mobile, clean spacing, no outer borders */}
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-y-6 gap-x-2 pb-6 px-4 max-w-[1200px] mx-auto">
        {categories.map((category, index) => {
          const { icon } = getCategoryIcon(category.slug.toLowerCase());

          // Limit to 7 items on mobile if not expanded, 8th slot is for 'More'
          const showOnMobile = isExpanded || index < 7;

          return (
            <React.Fragment key={category.id}>
              {/* 📱 MOBILE VERSION: Yelp Style - Direct Icon + Dynamic Text */}
              {showOnMobile && (
                <Link
                  href={`/listings?category=${category.slug}`}
                  onClick={(e) => handleCategoryClick(e, category)}
                  className="flex md:hidden group flex-col items-center justify-start no-underline w-full gap-2"
                >
                  <div className="relative flex items-center justify-center h-10 w-10">
                    {getSupabaseImageUrl(category.icon_url) ? (
                      <Image src={getSupabaseImageUrl(category.icon_url) || ""} alt={category.name} width={28} height={28} className="object-contain" />
                    ) : (
                      icon
                    )}
                  </div>
                  {/* 🚨 ಹೆಡರ್‌ನಲ್ಲಿ ಆರಿಸಿದ ಭಾಷೆಗೆ ತಕ್ಕಂತೆ ಬದಲಾಗುತ್ತದೆ */}
                  <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 text-center leading-tight group-active:text-red-600 dark:group-active:text-sky-400 transition-colors duration-300">
                    {t(category.name_kn, category.name)}
                  </span>
                </Link>
              )}

              {/* 💻 DESKTOP VERSION: Bento Glow Layout + Dynamic Text */}
              <Link
                href={`/listings?category=${category.slug}`}
                onClick={(e) => handleCategoryClick(e, category)}
                className="hidden md:flex group flex-col items-center justify-start no-underline w-full gap-3 hover:-translate-y-1.5 transition-transform duration-300"
              >
                <div className="relative flex items-center justify-center h-16 w-16 rounded-2xl bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 group-hover:border-red-200 dark:group-hover:border-sky-500/50 group-hover:bg-red-50/50 dark:group-hover:bg-sky-500/10 transition-all duration-300 group-hover:shadow-[0_10px_25px_rgba(220,38,38,0.15)] dark:group-hover:shadow-[0_10px_25px_rgba(14,165,233,0.15)]">
                  {getSupabaseImageUrl(category.icon_url) ? (
                    <Image src={getSupabaseImageUrl(category.icon_url) || ""} alt={category.name} width={34} height={34} className="object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-sm" />
                  ) : (
                    <div className="transition-transform duration-300 group-hover:scale-110 drop-shadow-sm">{icon}</div>
                  )}
                </div>
                {/* 🚨 ಹೆಡರ್‌ನಲ್ಲಿ ಆರಿಸಿದ ಭಾಷೆಗೆ ತಕ್ಕಂತೆ ಬದಲಾಗುತ್ತದೆ */}
                <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300 text-center leading-tight group-hover:text-red-600 dark:group-hover:text-sky-400">
                  {t(category.name_kn, category.name)}
                </span>
              </Link>
            </React.Fragment>
          );
        })}

        {/* 📱 MOBILE 'VIEW MORE' BUTTON: Yelp Style 3 dots icon */}
        {!isExpanded && categories.length > 7 && (
          <button
            onClick={() => setIsExpanded(true)}
            className="flex md:hidden group flex-col items-center justify-start w-full bg-transparent border-none outline-none gap-2"
          >
            <div className="relative flex items-center justify-center h-10 w-10">
              <MoreHorizontal className="w-8 h-8 text-slate-800 dark:text-slate-200 stroke-[1.5px] transition-colors duration-300 group-hover:text-red-600 dark:group-hover:text-sky-500 group-active:text-red-600 dark:group-active:text-sky-500" />
            </div>
            <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 text-center leading-tight group-active:text-red-600 dark:group-active:text-sky-400 transition-colors duration-300">
              {t("ಇನ್ನಷ್ಟು", "More")}
            </span>
          </button>
        )}
      </div>

      {/* 🚨 SUBCATEGORY MODAL POPUP */}
      {selectedCategory && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4 transition-opacity" onClick={() => setSelectedCategory(null)}>
          <div
            className="bg-white dark:bg-slate-900 rounded-t-2xl md:rounded-2xl w-full max-w-md max-h-[85vh] overflow-hidden shadow-2xl flex flex-col transform transition-transform"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                  {getCategoryIcon(selectedCategory.slug).icon}
                </div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-white m-0">
                  {t(selectedCategory.name_kn, selectedCategory.name)}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCategory(null)}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-slate-800 text-gray-500 hover:text-red-500 rounded-full transition-colors border-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 80px)' }}>
              <Link
                href={`/listings?category=${selectedCategory.slug}`}
                onClick={() => setSelectedCategory(null)}
                className="block w-full p-4 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 font-semibold rounded-xl text-center mb-4 border border-sky-100 dark:border-sky-800/30 no-underline transition-colors hover:bg-sky-100 dark:hover:bg-sky-900/40"
              >
                {t("ಎಲ್ಲಾ ತೋರಿಸು - " + selectedCategory.name_kn, "View All - " + selectedCategory.name)}
              </Link>

              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">{t('ಸಬ್-ಕ್ಯಾಟಗರಿಗಳು', 'Sub Categories')}</h4>
              <div className="grid grid-cols-2 gap-3">
                {selectedCategory.subcategories?.map(sub => (
                  <Link
                    key={sub.id}
                    href={`/listings?category=${selectedCategory.slug}&sub_category=${sub.slug}`}
                    onClick={() => setSelectedCategory(null)}
                    className="p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-center text-[13px] font-medium text-slate-700 dark:text-slate-300 hover:border-sky-300 dark:hover:border-sky-600 hover:shadow-sm no-underline transition-all hover:-translate-y-0.5"
                  >
                    {t(sub.name_kn, sub.name)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

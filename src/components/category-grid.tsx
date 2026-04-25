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

interface Category {
  id: number;
  name: string;        
  name_kn: string;     
  slug: string;
  icon_url?: string;   
}

interface CategoryGridProps {
  initialCategories: Category[];
}

// 🚨 YELP STYLE: Clean dark icons, thin stroke, no colorful backgrounds
const getCategoryIcon = (slug: string) => {
  const iconProps = { 
    className: "w-7 h-7 md:w-8 md:h-8 text-slate-800 dark:text-slate-200 transition-colors duration-300 group-hover:text-sky-500", 
    strokeWidth: 1.5 
  };
  
  const iconMap: Record<string, { icon: React.ReactNode }> = {
    'hotel': { icon: <Building2 {...iconProps} /> },
    'hospital': { icon: <Stethoscope {...iconProps} /> },
    'pg': { icon: <BedSingle {...iconProps} /> },
    'restaurant': { icon: <Utensils {...iconProps} /> },
    'shop': { icon: <ShoppingBag {...iconProps} /> },
    'real-estate': { icon: <Map {...iconProps} /> },
    'jobs': { icon: <Briefcase {...iconProps} /> },
    'education': { icon: <GraduationCap {...iconProps} /> },
  };

  return iconMap[slug] || { icon: <LayoutGrid {...iconProps} /> };
};

export default function CategoryGrid({ initialCategories = [] }: CategoryGridProps) {
  const { t } = useLanguage(); // 🚨 ಭಾಷೆ ಬದಲಾಯಿಸಲು ಟಾಗಲ್
  const [isExpanded, setIsExpanded] = useState(false);

  const categories = initialCategories;

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
                    className="flex md:hidden group flex-col items-center justify-start no-underline w-full gap-2"
                  >
                    <div className="relative flex items-center justify-center h-10 w-10">
                      {category.icon_url ? (
                        <Image src={category.icon_url} alt={category.name} width={28} height={28} className="object-contain" />
                      ) : (
                        icon
                      )}
                    </div>
                    {/* 🚨 ಹೆಡರ್‌ನಲ್ಲಿ ಆರಿಸಿದ ಭಾಷೆಗೆ ತಕ್ಕಂತೆ ಬದಲಾಗುತ್ತದೆ */}
                    <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 text-center leading-tight">
                      {t(category.name_kn, category.name)}
                    </span>
                  </Link>
                )}

                {/* 💻 DESKTOP VERSION: Similar minimal layout + Dynamic Text */}
                <Link
                  href={`/listings?category=${category.slug}`}
                  className="hidden md:flex group flex-col items-center justify-start no-underline w-full gap-3 hover:-translate-y-1 transition-transform duration-300"
                >
                  <div className="relative flex items-center justify-center h-14 w-14 rounded-2xl bg-slate-50 dark:bg-slate-800/50 group-hover:shadow-md transition-all duration-300 border border-transparent group-hover:border-sky-100 dark:group-hover:border-sky-900/50">
                    {category.icon_url ? (
                      <Image src={category.icon_url} alt={category.name} width={32} height={32} className="object-contain transition-transform duration-300 group-hover:scale-110" />
                    ) : (
                      <div className="transition-transform duration-300 group-hover:scale-110">{icon}</div>
                    )}
                  </div>
                  {/* 🚨 ಹೆಡರ್‌ನಲ್ಲಿ ಆರಿಸಿದ ಭಾಷೆಗೆ ತಕ್ಕಂತೆ ಬದಲಾಗುತ್ತದೆ */}
                  <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300 text-center leading-tight group-hover:text-sky-600 dark:group-hover:text-sky-400">
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
                <MoreHorizontal className="w-8 h-8 text-slate-800 dark:text-slate-200 stroke-[1.5px] transition-colors duration-300 group-hover:text-sky-500" />
              </div>
              <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 text-center leading-tight">
                {t("ಇನ್ನಷ್ಟು", "More")}
              </span>
            </button>
          )}
        </div>
    </div>
  );
}
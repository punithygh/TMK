"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import api from "@/services/api";
import { 
  Building2, 
  Stethoscope, 
  BedSingle, 
  Utensils, 
  ShoppingBag, 
  Map, 
  Briefcase, 
  GraduationCap,
  LayoutGrid
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

const getCategoryIcon = (slug: string) => {
  const iconProps = { className: "w-6 h-6 md:w-7 md:h-7" };
  const iconMap: Record<string, { icon: React.ReactNode, colorClass: string }> = {
    'hotel': { icon: <Building2 {...iconProps} />, colorClass: "text-orange-500 bg-orange-500/10" },
    'hospital': { icon: <Stethoscope {...iconProps} />, colorClass: "text-red-500 bg-red-500/10" },
    'pg': { icon: <BedSingle {...iconProps} />, colorClass: "text-blue-500 bg-blue-500/10" },
    'restaurant': { icon: <Utensils {...iconProps} />, colorClass: "text-green-500 bg-green-500/10" },
    'shop': { icon: <ShoppingBag {...iconProps} />, colorClass: "text-pink-500 bg-pink-500/10" },
    'real-estate': { icon: <Map {...iconProps} />, colorClass: "text-purple-500 bg-purple-500/10" },
    'jobs': { icon: <Briefcase {...iconProps} />, colorClass: "text-amber-500 bg-amber-500/10" },
    'education': { icon: <GraduationCap {...iconProps} />, colorClass: "text-indigo-500 bg-indigo-500/10" },
  };

  return iconMap[slug] || { icon: <LayoutGrid {...iconProps} />, colorClass: "text-slate-500 bg-slate-200 dark:text-slate-400 dark:bg-slate-800" };
};

export default function CategoryGrid({ initialCategories = [] }: CategoryGridProps) {
  const { t } = useLanguage(); 
  const [isExpanded, setIsExpanded] = useState(false);

  const categories = initialCategories;

  return (
    <div className="w-full relative z-10">
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4 pb-4 px-1">
          {categories.map((category, index) => {
            const { icon, colorClass } = getCategoryIcon(category.slug.toLowerCase());
            
            // Bulletproof logic: Always limit to 7 items on mobile if not expanded, 
            // so the 8th slot is perfectly reserved for the 'View More' button.
            const showOnMobile = isExpanded || index < 7;

            return (
              <React.Fragment key={category.id}>
                {/* 📱 MOBILE VERSION: Physically removed from DOM if not expanded. Guaranteed to show with 'flex md:hidden' */}
                {showOnMobile && (
                  <Link
                    href={`/listings?category=${category.slug}`}
                    className="flex md:hidden group flex-col items-center justify-center p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-slate-200 dark:border-slate-700/50 hover:shadow-[0_8px_30px_rgba(14,165,233,0.15)] hover:border-sky-500/50 hover:-translate-y-1 transition-all duration-300 no-underline h-[95px] w-full max-w-[90px] mx-auto"
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-2 shadow-inner ${colorClass}`}>
                      {category.icon_url ? (
                        <Image src={category.icon_url} alt={category.name} width={24} height={24} className="object-contain drop-shadow-md" />
                      ) : (
                        icon
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 text-center whitespace-nowrap overflow-hidden text-ellipsis w-full antialiased group-hover:text-sky-600 dark:group-hover:text-sky-400">
                      {t(category.name_kn, category.name)}
                    </span>
                  </Link>
                )}

                {/* 💻 DESKTOP VERSION: Always rendered, but strictly hidden on mobile with 'hidden md:flex' */}
                <Link
                  href={`/listings?category=${category.slug}`}
                  className="hidden md:flex group flex-col items-center justify-center p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-slate-200 dark:border-slate-700/50 hover:shadow-[0_8px_30px_rgba(14,165,233,0.15)] hover:border-sky-500/50 hover:-translate-y-1 hover:scale-[1.03] transition-all duration-300 no-underline h-[110px] w-full"
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-110 shadow-inner ${colorClass}`}>
                    {category.icon_url ? (
                      <Image src={category.icon_url} alt={category.name} width={32} height={32} className="object-contain drop-shadow-md" />
                    ) : (
                      icon
                    )}
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 text-center whitespace-nowrap overflow-hidden text-ellipsis w-full antialiased group-hover:text-sky-600 dark:group-hover:text-sky-400">
                    {t(category.name_kn, category.name)}
                  </span>
                </Link>
              </React.Fragment>
            );
          })}

          {/* 📱 MOBILE 'VIEW MORE' BUTTON: Guaranteed to show with 'flex md:hidden' */}
          {!isExpanded && categories.length > 7 && (
            <button
              onClick={() => setIsExpanded(true)}
              className="flex md:hidden group flex-col items-center justify-center p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-slate-200 dark:border-slate-700/50 hover:shadow-[0_8px_30px_rgba(14,165,233,0.15)] hover:border-sky-500/50 hover:-translate-y-1 transition-all duration-300 h-[95px] w-full max-w-[90px] mx-auto"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-2 shadow-inner text-sky-400 bg-sky-500/10">
                <LayoutGrid className="w-6 h-6 drop-shadow-md" />
              </div>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 text-center whitespace-nowrap overflow-hidden text-ellipsis w-full antialiased group-hover:text-sky-600 dark:group-hover:text-sky-400">
                {t("ಇನ್ನಷ್ಟು", "View More")}
              </span>
            </button>
          )}
        </div>
    </div>
  );
}
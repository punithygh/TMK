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

interface Category {
  id: number;
  name: string;        
  name_kn: string;     
  slug: string;
  icon_url?: string;   
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

  return iconMap[slug] || { icon: <LayoutGrid {...iconProps} />, colorClass: "text-slate-400 bg-slate-800" };
};

export default function CategoryGrid() {
  const { t } = useLanguage(); 
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories/');
        const data = response.data?.results || response.data || [];
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="w-full relative z-10">
      {isLoading ? (
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4 pb-4 px-1">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-3 bg-slate-900 rounded-2xl shadow-sm border border-slate-800 animate-pulse h-[95px] md:h-[110px]">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-800 rounded-xl mb-2"></div>
              <div className="w-12 h-3 bg-slate-800 rounded-full"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4 pb-4 px-1">
          {categories.map((category, index) => {
            const { icon, colorClass } = getCategoryIcon(category.slug.toLowerCase());
            
            // Bulletproof logic: Should this item be rendered in the Mobile DOM?
            const showOnMobile = isExpanded || index < 7 || categories.length <= 8;

            return (
              <React.Fragment key={category.id}>
                {/* 📱 MOBILE VERSION: Physically removed from DOM if not expanded. Guaranteed to show with 'flex md:hidden' */}
                {showOnMobile && (
                  <Link
                    href={`/listings?category=${category.slug}`}
                    className="flex md:hidden group flex-col items-center justify-center p-3 bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-slate-700/50 hover:shadow-[0_8px_30px_rgba(14,165,233,0.15)] hover:border-sky-500/50 hover:-translate-y-1 transition-all duration-300 no-underline h-[95px] w-full max-w-[90px] mx-auto"
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-2 shadow-inner ${colorClass}`}>
                      {category.icon_url ? (
                        <img src={category.icon_url} alt={category.name} className="w-6 h-6 object-contain drop-shadow-md" />
                      ) : (
                        icon
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 text-center whitespace-nowrap overflow-hidden text-ellipsis w-full antialiased group-hover:text-sky-400">
                      {t(category.name_kn, category.name)}
                    </span>
                  </Link>
                )}

                {/* 💻 DESKTOP VERSION: Always rendered, but strictly hidden on mobile with 'hidden md:flex' */}
                <Link
                  href={`/listings?category=${category.slug}`}
                  className="hidden md:flex group flex-col items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-slate-700/50 hover:shadow-[0_8px_30px_rgba(14,165,233,0.15)] hover:border-sky-500/50 hover:-translate-y-1 hover:scale-[1.03] transition-all duration-300 no-underline h-[110px] w-full"
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-110 shadow-inner ${colorClass}`}>
                    {category.icon_url ? (
                      <img src={category.icon_url} alt={category.name} className="w-8 h-8 object-contain drop-shadow-md" />
                    ) : (
                      icon
                    )}
                  </div>
                  <span className="text-xs font-bold text-slate-300 text-center whitespace-nowrap overflow-hidden text-ellipsis w-full antialiased group-hover:text-sky-400">
                    {t(category.name_kn, category.name)}
                  </span>
                </Link>
              </React.Fragment>
            );
          })}

          {/* 📱 MOBILE 'VIEW MORE' BUTTON: Guaranteed to show with 'flex md:hidden' */}
          {!isExpanded && categories.length > 8 && (
            <button
              onClick={() => setIsExpanded(true)}
              className="flex md:hidden group flex-col items-center justify-center p-3 bg-white/5 backdrop-blur-xl rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-white/10 hover:shadow-[0_8px_30px_rgba(14,165,233,0.2)] hover:border-sky-500/50 hover:-translate-y-1 transition-all duration-300 h-[95px] w-full max-w-[90px] mx-auto"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-2 shadow-inner text-sky-400 bg-sky-500/10">
                <LayoutGrid className="w-6 h-6 drop-shadow-md" />
              </div>
              <span className="text-[10px] font-bold text-slate-200 text-center whitespace-nowrap overflow-hidden text-ellipsis w-full antialiased group-hover:text-sky-400">
                {t("ಇನ್ನಷ್ಟು", "View More")}
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
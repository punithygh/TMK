"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, SlidersHorizontal, Loader2, User, Smartphone, CheckCircle, Search, Map, X, ChevronDown, Star, Share2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import ProductCard from "@/components/product-card";
import { getSupabaseBusinesses } from "@/services/legacyStubs";
import MiniMap from "@/components/MiniMap";

type ListingsClientProps = {
  initialQ: string;
  initialCategory: string;
  initialSortBy: string;
  initialStarRating: string;
  initialBudget: string;
  initialArea: string;
};

export default function ListingsClient({
  initialQ,
  initialCategory,
  initialSortBy,
  initialStarRating,
  initialBudget,
  initialArea
}: ListingsClientProps) {
  const router = useRouter();
  const { lang, t } = useLanguage();

  const [businesses, setBusinesses] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  
  // States for filter dropdowns
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    sort_by: initialSortBy,
    star_rating: initialStarRating,
    budget: initialBudget,
    area: initialArea,
    dynamic_1: "",
    dynamic_2: "",
    is_verified: "",
    is_top_search: "",
    is_trusted: "",
    is_featured: ""
  });

  const [leadStatus, setLeadStatus] = useState<"idle" | "loading" | "success">("idle");

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    }, { rootMargin: '400px' });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  const fetchBusinesses = async (pageNum: number, currentFilters: any, isNewFilter: boolean = false) => {
    if (isNewFilter) setIsFiltering(true);
    else setIsLoading(true);

    try {
      const limit = 10;
      const offset = (pageNum - 1) * limit;

      const data = await getSupabaseBusinesses({
        search: initialQ,
        category: initialCategory,
        star_rating: currentFilters.star_rating,
        is_verified: currentFilters.is_verified,
        is_featured: currentFilters.is_featured,
        is_top_search: currentFilters.is_top_search,
        is_trusted: currentFilters.is_trusted,
        sort_by: currentFilters.sort_by,
        limit,
        offset
      });

      if (isNewFilter) {
        setBusinesses(data);
      } else {
        setBusinesses(prev => [...prev, ...data]);
      }

      setTotalCount(prev => isNewFilter ? data.length : prev + data.length);
      setHasMore(data.length === limit);
    } catch (error) {
      console.error("Error fetching businesses:", error);
    } finally {
      setIsLoading(false);
      setIsFiltering(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchBusinesses(1, filters, true);
    
    const newParams = new URLSearchParams();
    if (initialQ) newParams.set("q", initialQ);
    if (initialCategory) newParams.set("category", initialCategory);
    Object.entries(filters).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
    });
    router.replace(`/listings?${newParams.toString()}`, { scroll: false });
  }, [filters, initialQ, initialCategory]);

  useEffect(() => {
    if (page > 1) {
      fetchBusinesses(page, filters, false);
    }
  }, [page]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
    setActiveDropdown(null); // Close dropdown on select
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLeadStatus("loading");
    setTimeout(() => {
      setLeadStatus("success");
      setTimeout(() => setLeadStatus("idle"), 3000);
    }, 1500);
  };

  const renderLeadForm = () => (
    <div className="bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-[#0a1120] border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-md dark:shadow-2xl relative overflow-hidden w-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 dark:bg-sky-500/10 blur-3xl rounded-full pointer-events-none"></div>
      <p className="text-xs text-red-600 dark:text-sky-400 font-bold uppercase tracking-wider mb-2">Fast Response</p>
      <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
        Get free quotes from top <span className="text-red-600 dark:text-sky-500">{displayTitle || "experts"}</span>
      </h3>
      <form onSubmit={handleLeadSubmit} className="flex flex-col gap-4 relative z-10">
        <div className="flex items-center bg-gray-50 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-700/80 rounded-xl overflow-hidden focus-within:border-red-500 dark:focus-within:border-sky-500 transition-all h-12 shadow-inner">
          <span className="px-4 text-gray-400 dark:text-slate-500 flex items-center h-full"><User size={16} /></span>
          <input type="text" className="w-full bg-transparent text-gray-900 dark:text-white px-2 text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-slate-600" placeholder="Your Name" required />
        </div>
        <div className="flex items-center bg-gray-50 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-700/80 rounded-xl overflow-hidden focus-within:border-red-500 dark:focus-within:border-sky-500 transition-all h-12 shadow-inner">
          <span className="px-4 text-gray-400 dark:text-slate-500 flex items-center h-full"><Smartphone size={16} /></span>
          <input type="tel" className="w-full bg-transparent text-gray-900 dark:text-white px-2 text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-slate-600" placeholder="Mobile Number" required pattern="[0-9]{10}" />
        </div>
        <button 
          type="submit" 
          disabled={leadStatus !== "idle"}
          className={`w-full font-bold py-3.5 rounded-xl text-sm transition-all flex justify-center items-center gap-2 shadow-lg ${
            leadStatus === "success" ? "bg-emerald-500 text-white shadow-emerald-500/20" : 
            leadStatus === "loading" ? "bg-red-600 dark:bg-sky-600 text-white opacity-80" : 
            "bg-red-600 hover:bg-red-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white shadow-red-600/25 dark:shadow-sky-500/25"
          }`}
        >
          {leadStatus === "loading" && <Loader2 size={16} className="animate-spin" />}
          {leadStatus === "success" && <CheckCircle size={16} />}
          {leadStatus === "idle" && t("ಉತ್ತಮ ಡೀಲ್ ಪಡೆಯಿರಿ", "Get Best Deal")}
          {leadStatus === "loading" && t("ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...", "Processing...")}
          {leadStatus === "success" && t("ಯಶಸ್ವಿಯಾಗಿದೆ!", "Request Sent!")}
        </button>
      </form>
    </div>
  );

  const getDynamicFilters = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('hospital') || cat.includes('doctor')) {
      return [
        { name: 'dynamic_1', label: t('ವಿಶೇಷತೆ', 'Specialty'), options: ['Cardiologist', 'Dentist', 'Pediatrician', 'Orthopedic'] },
        { name: 'dynamic_2', label: t('ಸಮಾಲೋಚನೆ ಶುಲ್ಕ', 'Consultation Fee'), options: ['< ₹500', '₹500 - ₹1000', '> ₹1000'] }
      ];
    }
    if (cat.includes('restaurant') || cat.includes('food')) {
      return [
        { name: 'dynamic_1', label: t('ಖಾದ್ಯ', 'Cuisine'), options: ['South Indian', 'North Indian', 'Chinese', 'Italian'] },
        { name: 'dynamic_2', label: t('ಪ್ರಕಾರ', 'Type'), options: ['Pure Veg', 'Non Veg', 'Cafe', 'Fast Food'] }
      ];
    }
    return [];
  };

  const dynamicFiltersList = getDynamicFilters(initialCategory);

  const displayTitle = initialCategory || initialQ || t("ಎಲ್ಲಾ ಬ್ಯುಸಿನೆಸ್‌ಗಳು", "All Businesses");

  // Filter Dropdown Component
  const FilterDropdown = ({ name, label, options, currentValue }: { name: string, label: string, options: {value: string, label: string}[], currentValue: string }) => {
    const isOpen = activeDropdown === name;
    
    return (
      <div className="relative inline-block text-left">
        <button 
          onClick={() => setActiveDropdown(isOpen ? null : name)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-colors shadow-sm ${
            currentValue 
            ? 'bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/50 text-sky-600 dark:text-sky-400' 
            : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
          }`}
        >
          {currentValue ? options.find(o => o.value === currentValue)?.label || label : label}
          <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-[99990] bg-black/50 sm:bg-transparent" onClick={() => setActiveDropdown(null)}></div>
            <div className="fixed bottom-0 left-0 right-0 w-[100vw] sm:absolute sm:top-full sm:bottom-auto sm:left-0 sm:transform-none z-[99999] sm:mt-2 sm:w-48 rounded-t-3xl sm:rounded-xl bg-white dark:bg-slate-900 border-t sm:border border-gray-200 dark:border-slate-700 shadow-xl pb-safe pb-8 pt-4 sm:py-1 focus:outline-none max-h-[80vh] sm:max-h-60 overflow-y-auto animate-in slide-in-from-bottom-full sm:slide-in-from-top-2 box-border">
              <div className="px-6 pb-4 mb-2 border-b border-gray-100 dark:border-slate-800 sm:hidden flex justify-between items-center">
                <span className="font-bold text-gray-900 dark:text-white text-lg">{label}</span>
                <button onClick={() => setActiveDropdown(null)} className="p-2 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"><X size={16}/></button>
              </div>
              <button 
                onClick={() => { handleFilterChange(name, ""); setActiveDropdown(null); }}
                className={`block w-full text-left px-6 sm:px-4 py-4 sm:py-2.5 text-base sm:text-sm ${currentValue === "" ? 'font-bold text-red-600 dark:text-sky-400 bg-red-50 dark:bg-slate-800 sm:bg-transparent' : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
              >
                Any {label}
              </button>
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { handleFilterChange(name, opt.value); setActiveDropdown(null); }}
                  className={`block w-full text-left px-6 sm:px-4 py-4 sm:py-2.5 text-base sm:text-sm ${currentValue === opt.value ? 'font-bold text-red-600 dark:text-sky-400 bg-red-50 dark:bg-slate-800 sm:bg-transparent' : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1450px] mx-auto px-4 md:px-[3%] mt-4 mb-20 md:mb-10 pb-20 md:pb-0 min-h-screen">
      
      {/* ====== BREADCRUMBS ====== */}
      <div className="flex items-center gap-2 text-[11px] md:text-xs text-red-600 dark:text-slate-400 mb-4 whitespace-nowrap overflow-x-auto scrollbar-hide font-medium">
        <Link href="/" className="hover:text-red-700 dark:hover:text-sky-400 transition-colors">{t("ತುಮಕೂರು", "Tumkur")}</Link>
        <ChevronRight size={12} className="text-red-400 dark:text-slate-500" />
        <span className="text-red-600 dark:text-slate-300 font-semibold">
          {t(`ತುಮಕೂರಿನಲ್ಲಿರುವ ${displayTitle}`, `${displayTitle} in Tumkur`)}
        </span>
        <ChevronRight size={12} className="text-red-400 dark:text-slate-500" />
        <span className="font-bold text-red-700 dark:text-sky-400">{totalCount} {t("ಲಿಸ್ಟಿಂಗ್‌ಗಳು", "Listings")}</span>
      </div>

      {/* ====== PAGE TITLE ====== */}
      <div className="mb-4 flex flex-row items-center justify-between gap-2">
        <h1 className="text-xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight line-clamp-1">
          {t(`Best ${displayTitle} in Tumkur`, `Best ${displayTitle} in Tumkur`)}
        </h1>
        <div className="flex items-center gap-2">
          <Link 
            href="/radius-search"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-red-600 hover:bg-red-700 dark:bg-sky-600 dark:hover:bg-sky-700 text-white rounded-full text-xs md:text-sm font-semibold transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <Map size={14} className="animate-pulse" /> <span>{t("ಮ್ಯಾಪ್", "Nearby Map")}</span>
          </Link>
          <button 
            onClick={() => {
              if (navigator.share) navigator.share({ title: document.title, url: window.location.href }).catch(() => {});
              else navigator.clipboard.writeText(window.location.href).then(() => alert("Link copied to clipboard!"));
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-white hover:bg-gray-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-800 dark:text-white rounded-full text-xs md:text-sm font-semibold transition-colors border border-gray-200 dark:border-slate-700 w-fit shrink-0 shadow-sm"
          >
            <Share2 size={14} className="text-red-600 dark:text-sky-400" /> <span className="hidden sm:inline">{t("ಶೇರ್ ಮಾಡಿ", "Share List")}</span><span className="sm:hidden">Share</span>
          </button>
        </div>
      </div>

      {/* ====== YELP STYLE HORIZONTAL FILTERS ====== */}
      <div className="flex flex-nowrap overflow-x-auto md:overflow-visible md:flex-wrap scrollbar-hide items-center gap-2 md:gap-3 mb-6 pb-2 border-b border-gray-200 dark:border-slate-800 w-full snap-x relative z-50">
        
        {/* Filter Symbol Button */}
        <div className="shrink-0 snap-start">
          <button 
            onClick={() => setIsMoreFiltersOpen(true)}
            className="flex items-center justify-center p-2.5 rounded-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>

        {/* Sort Filter */}
        <div className="shrink-0 snap-start">
          <FilterDropdown 
            name="sort_by" 
            label={t("ವಿಂಗಡಿಸಿ", "Sort by")} 
            currentValue={filters.sort_by}
            options={[
              {value: "rating", label: "Rating"},
              {value: "relevance", label: "Relevance"},
              {value: "popular", label: "Popular"},
              {value: "distance", label: "Distance"}
            ]}
          />
        </div>
        
        {/* Nearby Filter (Mobile Priority) */}
        <div className="shrink-0 snap-start">
          <Link 
            href="/radius-search"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Map size={14} className="text-red-600 dark:text-sky-500" />
            {t("ಸಮೀಪದ", "Nearby")}
          </Link>
        </div>

        {/* Quick Tag Pills */}
        <div className="shrink-0 snap-start">
          <button 
            onClick={() => handleFilterChange("is_top_search", filters.is_top_search === "true" ? "" : "true")}
            className={`px-4 py-2.5 rounded-full text-sm font-semibold border transition-colors shadow-sm flex items-center gap-1.5 ${filters.is_top_search === "true" ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/50 text-orange-600 dark:text-orange-400' : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
          >
            <Star size={14} /> Top Rated
          </button>
        </div>
        <div className="shrink-0 snap-start">
          <button 
            onClick={() => handleFilterChange("is_featured", filters.is_featured === "true" ? "" : "true")}
            className={`px-4 py-2.5 rounded-full text-sm font-semibold border transition-colors shadow-sm flex items-center gap-1.5 ${filters.is_featured === "true" ? 'bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/50 text-purple-600 dark:text-purple-400' : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
          >
            <Smartphone size={14} /> Quick Response
          </button>
        </div>
        <div className="shrink-0 snap-start">
          <button 
            onClick={() => handleFilterChange("is_verified", filters.is_verified === "true" ? "" : "true")}
            className={`px-4 py-2.5 rounded-full text-sm font-semibold border transition-colors shadow-sm flex items-center gap-1.5 ${filters.is_verified === "true" ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/50 text-emerald-600 dark:text-emerald-400' : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
          >
            <CheckCircle size={14} /> Verified
          </button>
        </div>
        <div className="shrink-0 snap-start">
          <button 
            onClick={() => handleFilterChange("is_trusted", filters.is_trusted === "true" ? "" : "true")}
            className={`px-4 py-2.5 rounded-full text-sm font-semibold border transition-colors shadow-sm flex items-center gap-1.5 ${filters.is_trusted === "true" ? 'bg-red-50 dark:bg-sky-500/10 border-red-200 dark:border-sky-500/50 text-red-600 dark:text-sky-400' : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
          >
            Trusted
          </button>
        </div>

        {/* Dynamic Filters */}
        {dynamicFiltersList.map((filter, idx) => (
          <div key={idx} className="shrink-0 snap-start">
            <FilterDropdown 
              name={filter.name} 
              label={filter.label} 
              currentValue={(filters as any)[filter.name]}
              options={filter.options.map(opt => ({value: opt, label: opt}))}
            />
          </div>
        ))}

        {/* Rating Filter */}
        <div className="shrink-0 snap-start">
          <FilterDropdown 
            name="star_rating" 
            label={t("ರೇಟಿಂಗ್", "Rating")} 
            currentValue={filters.star_rating}
            options={[
              {value: "4.5", label: "4.5+ Excellent"},
              {value: "4.0", label: "4.0+ Very Good"},
              {value: "3.0", label: "3.0+ Good"}
            ]}
          />
        </div>

      </div>




      {/* ====== MAIN LAYOUT GRID ====== */}
      <div className="flex flex-col xl:flex-row w-full gap-8 relative items-start">
        
        {/* Main List */}
        <div className={`flex-1 min-w-0 transition-opacity duration-300 w-full ${isFiltering ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          
          {/* 📱 Mobile Mini Map Removed as requested */}

          {isLoading && page === 1 ? (
            <div className="flex flex-col gap-4 md:gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-3 flex flex-col sm:flex-row gap-4 animate-pulse shadow-sm">
                  <div className="w-full sm:w-[240px] h-[200px] bg-slate-200 dark:bg-slate-800/80 rounded-2xl shrink-0"></div>
                  <div className="flex-1 py-2 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="w-3/4 h-7 bg-slate-200 dark:bg-slate-800/80 rounded-lg"></div>
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800/80"></div>
                      </div>
                      <div className="w-1/3 h-4 bg-slate-200 dark:bg-slate-800/80 rounded mb-4"></div>
                      <div className="w-full h-3 bg-slate-200 dark:bg-slate-800/80 rounded mb-2"></div>
                      <div className="w-5/6 h-3 bg-slate-200 dark:bg-slate-800/80 rounded mb-4"></div>
                    </div>
                    <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex-1 h-11 bg-slate-200 dark:bg-slate-800/80 rounded-xl"></div>
                      <div className="flex-1 h-11 bg-slate-200 dark:bg-slate-800/80 rounded-xl"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : businesses.length > 0 ? (
            <>
              <div className="flex flex-col gap-0">
                {businesses.map((biz, index) => {
                  const isLast = index === businesses.length - 1;
                  return (
                    <React.Fragment key={`biz-${biz.id}-${index}`}>
                      <div ref={isLast ? lastElementRef : null}>
                        <ProductCard product={biz} />
                      </div>
                      
                      {/* Inject Lead Form after 3rd card on mobile only */}
                      {index === 2 && businesses.length > 3 && (
                        <div className="xl:hidden w-full mb-4 sm:mb-6">
                           {renderLeadForm()}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Loader for Infinite Scroll */}
              {isLoading && page > 1 && (
                <div className="w-full flex justify-center py-10">
                  <Loader2 className="animate-spin text-red-600 dark:text-sky-500 w-8 h-8" />
                </div>
              )}
            </>
          ) : (
            !isLoading && (
              <div className="bg-gray-50 dark:bg-slate-900/30 p-12 md:p-20 rounded-3xl text-center border border-dashed border-gray-300 dark:border-slate-700/50">
                <Search className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-6" />
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-3">{t("ಯಾವುದೇ ಫಲಿತಾಂಶಗಳಿಲ್ಲ", "No results found")}</h3>
                <p className="text-gray-500 dark:text-slate-400 text-sm md:text-base mb-8 max-w-md mx-auto">{t("ನಿಮ್ಮ ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಬದಲಾಯಿಸಿ ಪ್ರಯತ್ನಿಸಿ. ನಮಗೆ ಈ ವಿಭಾಗದಲ್ಲಿ ಸದ್ಯಕ್ಕೆ ಯಾವುದೇ ಮಾಹಿತಿ ಸಿಕ್ಕಿಲ್ಲ.", "We couldn't find any businesses matching your current filters. Try adjusting them for more results.")}</p>
                <button onClick={() => setFilters({ sort_by: "", star_rating: "", budget: "", area: "", dynamic_1: "", dynamic_2: "", is_verified: "", is_top_search: "", is_trusted: "", is_featured: "" })} className="px-8 py-3 bg-red-50 dark:bg-sky-500/10 border border-red-200 dark:border-sky-500/50 text-red-600 dark:text-sky-400 rounded-xl hover:bg-red-600 dark:hover:bg-sky-500 hover:text-white transition-colors font-bold text-sm shadow-sm">
                  {t("ಫಿಲ್ಟರ್ ತೆರವುಗೊಳಿಸಿ", "Clear All Filters")}
                </button>
              </div>
            )
          )}
        </div>

        {/* Right Sidebar: Lead Gen (Desktop Only) */}
        <div className="hidden xl:flex w-[360px] shrink-0 sticky top-[100px] max-h-[calc(100vh-120px)] overflow-y-auto self-start flex-col gap-6 pr-2 custom-scrollbar">
          <MiniMap businesses={businesses} />
          {renderLeadForm()}
        </div>

      </div>

      {/* ====== MORE FILTERS MODAL (Yelp Style) ====== */}
      {isMoreFiltersOpen && (
        <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0f172a] w-full max-w-[100vw] sm:max-w-lg max-h-[90vh] sm:rounded-2xl rounded-t-3xl shadow-2xl flex flex-col border border-gray-200 dark:border-slate-700 overflow-hidden box-border">
            
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">{t("ಇನ್ನಷ್ಟು ಫಿಲ್ಟರ್‌ಗಳು", "More Filters")}</h2>
              <button onClick={() => setIsMoreFiltersOpen(false)} className="p-2 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
              
              <div className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">{t("ಸ್ಥಳ", "Area / Location")}</label>
                <div className="flex flex-wrap gap-2">
                  {["S.S. Puram", "Siddaganga Extension", "Batawadi"].map(area => (
                    <button 
                      key={area}
                      onClick={() => handleFilterChange("area", filters.area === area ? "" : area)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                        filters.area === area 
                        ? 'bg-red-50 dark:bg-sky-500/20 border-red-200 dark:border-sky-500 text-red-600 dark:text-sky-400' 
                        : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:border-gray-400 dark:hover:border-slate-500'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">{t("ಬಜೆಟ್", "Budget")}</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    {value: "low", label: "₹1000 ಕ್ಕಿಂತ ಕಡಿಮೆ (Under ₹1000)"},
                    {value: "mid", label: "₹1000 - ₹3000"},
                    {value: "high", label: "₹3000 ಕ್ಕಿಂತ ಹೆಚ್ಚು (Above ₹3000)"}
                  ].map(budget => (
                    <button 
                      key={budget.value}
                      onClick={() => handleFilterChange("budget", filters.budget === budget.value ? "" : budget.value)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                        filters.budget === budget.value 
                        ? 'bg-red-50 dark:bg-sky-500/20 border-red-200 dark:border-sky-500 text-red-600 dark:text-sky-400' 
                        : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:border-gray-400 dark:hover:border-slate-500'
                      }`}
                    >
                      {budget.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add more arbitrary filters here if needed */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">Features</label>
                <div className="flex flex-wrap gap-2">
                   <button className="px-4 py-2 rounded-full text-sm font-medium border bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:border-gray-400 dark:hover:border-slate-500 transition-colors">Offers Delivery</button>
                   <button className="px-4 py-2 rounded-full text-sm font-medium border bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:border-gray-400 dark:hover:border-slate-500 transition-colors">Free WiFi</button>
                   <button className="px-4 py-2 rounded-full text-sm font-medium border bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:border-gray-400 dark:hover:border-slate-500 transition-colors">Parking Available</button>
                </div>
              </div>
              
            </div>
            
            <div className="p-4 pb-12 sm:pb-4 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-[0_-10px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_20px_rgba(0,0,0,0.2)] flex gap-4 shrink-0">
              <button 
                onClick={() => setFilters({ sort_by: "", star_rating: "", budget: "", area: "", dynamic_1: "", dynamic_2: "", is_verified: "", is_top_search: "", is_trusted: "", is_featured: "" })}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-800 dark:text-white rounded-xl font-bold text-sm transition-colors"
              >
                Clear All
              </button>
              <button 
                onClick={() => setIsMoreFiltersOpen(false)} 
                className="flex-[2] py-3 bg-red-600 hover:bg-red-700 dark:bg-sky-600 dark:hover:bg-sky-700 text-white rounded-xl font-bold text-sm shadow-sm transition-colors"
              >
                {t("ಅನ್ವಯಿಸಿ", "Apply Filters")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====== FLOATING MAP VIEW BUTTON (MOBILE YELP STYLE) ====== */}
      <div className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] md:bottom-[calc(2rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-[999] xl:hidden pointer-events-auto w-auto flex justify-center">
        <Link 
          href="/radius-search" 
          className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-sky-600 text-white px-7 py-3.5 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.4)] dark:shadow-[0_8px_30px_rgba(14,165,233,0.3)] font-extrabold text-[15px] tracking-wide border border-white/10 dark:border-sky-500/50 backdrop-blur-xl hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap"
        >
          <Map size={18} className="animate-pulse drop-shadow-md" /> {t("ಮ್ಯಾಪ್ ವ್ಯೂ", "Map View")}
        </Link>
      </div>

    </div>
  );
}

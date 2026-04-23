"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, SlidersHorizontal, Loader2, User, Smartphone, CheckCircle, Search, Map, X, ChevronDown, Star, Share2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import ProductCard from "@/components/product-card";
import api from "@/services/api";

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
      const queryParams = new URLSearchParams({
        page: pageNum.toString(),
        ...(initialQ && { search: initialQ }),
        ...(initialCategory && { category__slug: initialCategory }),
        ...(currentFilters.star_rating && { star_rating: currentFilters.star_rating }),
        ...(currentFilters.budget && { budget: currentFilters.budget }),
        ...(currentFilters.area && { area: currentFilters.area }),
        ...(currentFilters.is_verified && { is_verified: currentFilters.is_verified }),
        ...(currentFilters.is_top_search && { is_top_search: currentFilters.is_top_search }),
        ...(currentFilters.is_trusted && { is_trusted: currentFilters.is_trusted }),
        ...(currentFilters.is_featured && { is_featured: currentFilters.is_featured }),
      });

      if (currentFilters.sort_by) {
        if (currentFilters.sort_by === 'rating') queryParams.append('ordering', '-rating');
        if (currentFilters.sort_by === 'popular') queryParams.append('ordering', '-page_views');
        if (currentFilters.sort_by === 'distance') queryParams.append('ordering', 'distance');
      }

      const response = await api.get(`/businesses/?${queryParams.toString()}`);
      const data = response.data;

      if (isNewFilter) {
        setBusinesses(data.results || data);
      } else {
        setBusinesses(prev => [...prev, ...(data.results || data)]);
      }

      setTotalCount(data.count || (data.results ? data.results.length : data.length));
      setHasMore(data.next !== null && data.next !== undefined);
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
    <div className="bg-gradient-to-br from-slate-900 to-[#0a1120] border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden w-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 blur-3xl rounded-full pointer-events-none"></div>
      <p className="text-xs text-sky-400 font-bold uppercase tracking-wider mb-2">Fast Response</p>
      <h3 className="text-xl font-extrabold text-white mb-6 leading-tight">
        Get free quotes from top <span className="text-sky-500">{displayTitle || "experts"}</span>
      </h3>
      <form onSubmit={handleLeadSubmit} className="flex flex-col gap-4 relative z-10">
        <div className="flex items-center bg-slate-950/80 border border-slate-700/80 rounded-xl overflow-hidden focus-within:border-sky-500 transition-all h-12 shadow-inner">
          <span className="px-4 text-slate-500 flex items-center h-full"><User size={16} /></span>
          <input type="text" className="w-full bg-transparent text-white px-2 text-sm outline-none placeholder:text-slate-600" placeholder="Your Name" required />
        </div>
        <div className="flex items-center bg-slate-950/80 border border-slate-700/80 rounded-xl overflow-hidden focus-within:border-sky-500 transition-all h-12 shadow-inner">
          <span className="px-4 text-slate-500 flex items-center h-full"><Smartphone size={16} /></span>
          <input type="tel" className="w-full bg-transparent text-white px-2 text-sm outline-none placeholder:text-slate-600" placeholder="Mobile Number" required pattern="[0-9]{10}" />
        </div>
        <button 
          type="submit" 
          disabled={leadStatus !== "idle"}
          className={`w-full font-bold py-3.5 rounded-xl text-sm transition-all flex justify-center items-center gap-2 shadow-lg ${
            leadStatus === "success" ? "bg-emerald-500 text-white shadow-emerald-500/20" : 
            leadStatus === "loading" ? "bg-sky-600 text-white opacity-80" : 
            "bg-sky-500 hover:bg-sky-400 text-white shadow-sky-500/25"
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
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
            currentValue 
            ? 'bg-sky-500/10 border-sky-500/50 text-sky-400' 
            : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
        >
          {currentValue ? options.find(o => o.value === currentValue)?.label || label : label}
          <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-[99990] bg-black/50 sm:bg-transparent" onClick={() => setActiveDropdown(null)}></div>
            <div className="fixed bottom-0 left-0 right-0 w-[100vw] sm:absolute sm:top-full sm:bottom-auto sm:left-0 sm:transform-none z-[99999] sm:mt-2 sm:w-48 rounded-t-3xl sm:rounded-xl bg-slate-900 border-t sm:border border-slate-700 shadow-2xl pb-safe pb-8 pt-4 sm:py-1 focus:outline-none max-h-[80vh] sm:max-h-60 overflow-y-auto animate-in slide-in-from-bottom-full sm:slide-in-from-top-2 box-border">
              <div className="px-6 pb-4 mb-2 border-b border-slate-800 sm:hidden flex justify-between items-center">
                <span className="font-bold text-white text-lg">{label}</span>
                <button onClick={() => setActiveDropdown(null)} className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"><X size={16}/></button>
              </div>
              <button 
                onClick={() => { handleFilterChange(name, ""); setActiveDropdown(null); }}
                className={`block w-full text-left px-6 sm:px-4 py-4 sm:py-2.5 text-base sm:text-sm ${currentValue === "" ? 'font-bold text-sky-400 bg-slate-800 sm:bg-transparent' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                Any {label}
              </button>
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { handleFilterChange(name, opt.value); setActiveDropdown(null); }}
                  className={`block w-full text-left px-6 sm:px-4 py-4 sm:py-2.5 text-base sm:text-sm ${currentValue === opt.value ? 'font-bold text-sky-400 bg-slate-800 sm:bg-transparent' : 'text-slate-300 hover:bg-slate-800'}`}
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
      <div className="flex items-center gap-2 text-[11px] md:text-xs text-slate-400 mb-4 whitespace-nowrap overflow-x-auto scrollbar-hide">
        <Link href="/" className="hover:text-sky-400 transition-colors">{t("ತುಮಕೂರು", "Tumkur")}</Link>
        <ChevronRight size={12} />
        <span className="text-slate-300">
          {t(`ತುಮಕೂರಿನಲ್ಲಿರುವ ${displayTitle}`, `${displayTitle} in Tumkur`)}
        </span>
        <ChevronRight size={12} />
        <span className="font-semibold text-sky-400">{totalCount} {t("ಲಿಸ್ಟಿಂಗ್‌ಗಳು", "Listings")}</span>
      </div>

      {/* ====== PAGE TITLE ====== */}
      <div className="mb-4 flex flex-row items-center justify-between gap-2">
        <h1 className="text-xl md:text-3xl font-extrabold text-white tracking-tight leading-tight line-clamp-1">
          {t(`Best ${displayTitle} in Tumkur`, `Best ${displayTitle} in Tumkur`)}
        </h1>
        <button 
          onClick={() => {
            if (navigator.share) navigator.share({ title: document.title, url: window.location.href }).catch(() => {});
            else navigator.clipboard.writeText(window.location.href).then(() => alert("Link copied to clipboard!"));
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full text-xs md:text-sm font-semibold transition-colors border border-slate-700 w-fit shrink-0"
        >
          <Share2 size={14} className="text-sky-400" /> <span className="hidden sm:inline">{t("ಶೇರ್ ಮಾಡಿ", "Share List")}</span><span className="sm:hidden">Share</span>
        </button>
      </div>

      {/* ====== YELP STYLE HORIZONTAL FILTERS ====== */}
      <div className="flex flex-nowrap overflow-x-auto md:overflow-visible md:flex-wrap scrollbar-hide items-center gap-2 md:gap-3 mb-6 pb-2 border-b border-slate-800 w-full snap-x relative z-50">
        
        {/* Filter Symbol Button */}
        <div className="shrink-0 snap-start">
          <button 
            onClick={() => setIsMoreFiltersOpen(true)}
            className="flex items-center justify-center p-2.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all"
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

        {/* Quick Tag Pills */}
        <div className="shrink-0 snap-start">
          <button 
            onClick={() => handleFilterChange("is_top_search", filters.is_top_search === "true" ? "" : "true")}
            className={`px-4 py-2.5 rounded-full text-sm font-semibold border transition-all flex items-center gap-1.5 ${filters.is_top_search === "true" ? 'bg-orange-500/10 border-orange-500/50 text-orange-400' : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'}`}
          >
            <Star size={14} /> Top Rated
          </button>
        </div>
        <div className="shrink-0 snap-start">
          <button 
            onClick={() => handleFilterChange("is_featured", filters.is_featured === "true" ? "" : "true")}
            className={`px-4 py-2.5 rounded-full text-sm font-semibold border transition-all flex items-center gap-1.5 ${filters.is_featured === "true" ? 'bg-purple-500/10 border-purple-500/50 text-purple-400' : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'}`}
          >
            <Smartphone size={14} /> Quick Response
          </button>
        </div>
        <div className="shrink-0 snap-start">
          <button 
            onClick={() => handleFilterChange("is_verified", filters.is_verified === "true" ? "" : "true")}
            className={`px-4 py-2.5 rounded-full text-sm font-semibold border transition-all flex items-center gap-1.5 ${filters.is_verified === "true" ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'}`}
          >
            <CheckCircle size={14} /> Verified
          </button>
        </div>
        <div className="shrink-0 snap-start">
          <button 
            onClick={() => handleFilterChange("is_trusted", filters.is_trusted === "true" ? "" : "true")}
            className={`px-4 py-2.5 rounded-full text-sm font-semibold border transition-all flex items-center gap-1.5 ${filters.is_trusted === "true" ? 'bg-sky-500/10 border-sky-500/50 text-sky-400' : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'}`}
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
          {businesses.length > 0 ? (
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
                  <Loader2 className="animate-spin text-sky-500 w-8 h-8" />
                </div>
              )}
            </>
          ) : (
            !isLoading && (
              <div className="bg-slate-900/30 p-12 md:p-20 rounded-3xl text-center border border-dashed border-slate-700/50">
                <Search className="w-16 h-16 text-slate-600 mx-auto mb-6" />
                <h3 className="text-xl font-extrabold text-white mb-3">{t("ಯಾವುದೇ ಫಲಿತಾಂಶಗಳಿಲ್ಲ", "No results found")}</h3>
                <p className="text-slate-400 text-sm md:text-base mb-8 max-w-md mx-auto">{t("ನಿಮ್ಮ ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಬದಲಾಯಿಸಿ ಪ್ರಯತ್ನಿಸಿ. ನಮಗೆ ಈ ವಿಭಾಗದಲ್ಲಿ ಸದ್ಯಕ್ಕೆ ಯಾವುದೇ ಮಾಹಿತಿ ಸಿಕ್ಕಿಲ್ಲ.", "We couldn't find any businesses matching your current filters. Try adjusting them for more results.")}</p>
                <button onClick={() => setFilters({ sort_by: "", star_rating: "", budget: "", area: "", dynamic_1: "", dynamic_2: "", is_verified: "", is_top_search: "", is_trusted: "", is_featured: "" })} className="px-8 py-3 bg-sky-500/10 border border-sky-500/50 text-sky-400 rounded-xl hover:bg-sky-500 hover:text-white transition-all font-bold text-sm">
                  {t("ಫಿಲ್ಟರ್ ತೆರವುಗೊಳಿಸಿ", "Clear All Filters")}
                </button>
              </div>
            )
          )}
        </div>

        {/* Right Sidebar: Lead Gen (Desktop Only) */}
        <div className="hidden xl:block w-[360px] shrink-0 sticky top-[100px] h-fit self-start">
          {renderLeadForm()}
        </div>

      </div>

      {/* ====== MORE FILTERS MODAL (Yelp Style) ====== */}
      {isMoreFiltersOpen && (
        <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0f172a] w-full max-w-[100vw] sm:max-w-lg max-h-[90vh] sm:rounded-2xl rounded-t-3xl shadow-2xl flex flex-col border border-slate-700 overflow-hidden box-border">
            
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-extrabold text-white">{t("ಇನ್ನಷ್ಟು ಫಿಲ್ಟರ್‌ಗಳು", "More Filters")}</h2>
              <button onClick={() => setIsMoreFiltersOpen(false)} className="p-2 bg-slate-800 text-slate-300 hover:text-white rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
              
              <div className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-slate-300">{t("ಸ್ಥಳ", "Area / Location")}</label>
                <div className="flex flex-wrap gap-2">
                  {["S.S. Puram", "Siddaganga Extension", "Batawadi"].map(area => (
                    <button 
                      key={area}
                      onClick={() => handleFilterChange("area", filters.area === area ? "" : area)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                        filters.area === area 
                        ? 'bg-sky-500/20 border-sky-500 text-sky-400' 
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-slate-300">{t("ಬಜೆಟ್", "Budget")}</label>
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
                        ? 'bg-sky-500/20 border-sky-500 text-sky-400' 
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {budget.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add more arbitrary filters here if needed */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-slate-300">Features</label>
                <div className="flex flex-wrap gap-2">
                   <button className="px-4 py-2 rounded-full text-sm font-medium border bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500 transition-colors">Offers Delivery</button>
                   <button className="px-4 py-2 rounded-full text-sm font-medium border bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500 transition-colors">Free WiFi</button>
                   <button className="px-4 py-2 rounded-full text-sm font-medium border bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500 transition-colors">Parking Available</button>
                </div>
              </div>
              
            </div>
            
            <div className="p-4 pb-12 sm:pb-4 border-t border-slate-800 bg-[#0f172a] shadow-[0_-10px_20px_rgba(0,0,0,0.2)] flex gap-4 shrink-0">
              <button 
                onClick={() => setFilters({ sort_by: "", star_rating: "", budget: "", area: "", dynamic_1: "", dynamic_2: "", is_verified: "", is_top_search: "", is_trusted: "", is_featured: "" })}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm transition-colors"
              >
                Clear All
              </button>
              <button 
                onClick={() => setIsMoreFiltersOpen(false)} 
                className="flex-[2] py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-bold text-sm shadow-lg shadow-sky-500/20 transition-colors"
              >
                {t("ಅನ್ವಯಿಸಿ", "Apply Filters")}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, SlidersHorizontal, Loader2, User, Smartphone, CheckCircle, Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import ProductCard from "@/components/product-card";
import api from "@/services/api";

// 🚨 1. ಪ್ರತ್ಯೇಕವಾದ ಕಾಂಪೊನೆಂಟ್ (Suspense ಗಾಗಿ)
function ListingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang, t } = useLanguage();

  // URL Parameters
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";

  const [businesses, setBusinesses] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);

  const [filters, setFilters] = useState({
    sort_by: searchParams.get("sort_by") || "",
    star_rating: searchParams.get("star_rating") || "",
    budget: searchParams.get("budget") || "",
    area: searchParams.get("area") || "",
  });

  const [leadStatus, setLeadStatus] = useState<"idle" | "loading" | "success">("idle");

  // 🚨 2. ಇನ್‌ಫೈನೈಟ್ ಸ್ಕ್ರೋಲ್ ಅಬ್ಸರ್ವರ್
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  // 🚨 3. ಡೇಟಾ ಫೆಚ್ ಫಂಕ್ಷನ್
  const fetchBusinesses = async (pageNum: number, currentFilters: any, isNewFilter: boolean = false) => {
    if (isNewFilter) setIsFiltering(true);
    else setIsLoading(true);

    try {
      const queryParams = new URLSearchParams({
        page: pageNum.toString(),
        ...(q && { q }),
        // 🚨 CRITICAL FIX: Django DRF filterset_fields expects 'category__slug', not 'category'
        ...(category && { category__slug: category }),
        ...(currentFilters.sort_by && { sort_by: currentFilters.sort_by }),
        ...(currentFilters.star_rating && { star_rating: currentFilters.star_rating }),
        ...(currentFilters.budget && { budget: currentFilters.budget }),
        ...(currentFilters.area && { area: currentFilters.area }),
      });

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
    
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(filters).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
      else newParams.delete(key);
    });
    router.replace(`/listings?${newParams.toString()}`, { scroll: false });
  }, [filters, q, category]);

  useEffect(() => {
    if (page > 1) {
      fetchBusinesses(page, filters, false);
    }
  }, [page]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLeadStatus("loading");
    setTimeout(() => {
      setLeadStatus("success");
      setTimeout(() => setLeadStatus("idle"), 3000);
    }, 1500);
  };

  const displayTitle = category || q || t("ಎಲ್ಲಾ ಬ್ಯುಸಿನೆಸ್‌ಗಳು", "All Businesses");

  return (
    <div className="w-full max-w-[1450px] mx-auto px-4 md:px-[3%] mt-4 mb-10 pb-20 md:pb-0">
      
      {/* ====== BREADCRUMBS ====== */}
      <div className="flex items-center gap-2 text-[11px] md:text-xs text-slate-400 mb-3 whitespace-nowrap overflow-x-auto scrollbar-hide">
        <Link href="/" className="hover:text-sky-400 transition-colors">{t("ತುಮಕೂರು", "Tumkur")}</Link>
        <ChevronRight size={12} />
        <span className="text-slate-300">
          {t(`ತುಮಕೂರಿನಲ್ಲಿರುವ ${displayTitle}`, `${displayTitle} in Tumkur`)}
        </span>
        <ChevronRight size={12} />
        <span className="font-semibold text-sky-400">{totalCount} {t("ಲಿಸ್ಟಿಂಗ್‌ಗಳು", "Listings")}</span>
      </div>

      {/* ====== PAGE TITLE ====== */}
      <h1 className="text-lg md:text-2xl font-bold text-white mb-4 tracking-wide">
        {t(`ಉತ್ತಮ ಡೀಲ್‌ಗಳು - ಟಾಪ್ ${displayTitle}`, `Best Deals - Top ${displayTitle}`)}
      </h1>

      {/* ====== FILTERS ====== */}
      <div className="flex gap-2 md:gap-3 overflow-x-auto pb-3 mb-5 border-b border-slate-800 scrollbar-hide items-center">
        <select name="sort_by" value={filters.sort_by} onChange={handleFilterChange} className={`bg-slate-800/50 border ${filters.sort_by ? 'border-sky-500 text-sky-400 bg-sky-500/10' : 'border-slate-700 text-slate-300'} px-3 py-2 rounded-xl text-xs md:text-[13px] font-medium outline-none cursor-pointer transition-all hover:border-sky-500 hover:-translate-y-[1px] shrink-0 appearance-none`}>
          <option value="" className="bg-slate-900 text-white">{t("ಪ್ರಸ್ತುತತೆಯ ಆಧಾರದ ಮೇಲೆ", "Sort by Relevance")}</option>
          <option value="rating_high" className="bg-slate-900 text-white">{t("ಟಾಪ್ ರೇಟೆಡ್", "Top Rated First")}</option>
          <option value="rating_low" className="bg-slate-900 text-white">{t("ಕಡಿಮೆ ರೇಟಿಂಗ್", "Lowest Rated")}</option>
          <option value="name_a_z" className="bg-slate-900 text-white">{t("ಹೆಸರು (A-Z)", "Name (A-Z)")}</option>
        </select>

        <select name="star_rating" value={filters.star_rating} onChange={handleFilterChange} className={`bg-slate-800/50 border ${filters.star_rating ? 'border-sky-500 text-sky-400 bg-sky-500/10' : 'border-slate-700 text-slate-300'} px-3 py-2 rounded-xl text-xs md:text-[13px] font-medium outline-none cursor-pointer transition-all hover:border-sky-500 shrink-0 appearance-none`}>
          <option value="" className="bg-slate-900 text-white">{t("ಯಾವುದೇ ರೇಟಿಂಗ್", "Any Star Rating")}</option>
          <option value="4.5" className="bg-slate-900 text-white">4.5+ Excellent</option>
          <option value="4.0" className="bg-slate-900 text-white">4.0+ Very Good</option>
          <option value="3.0" className="bg-slate-900 text-white">3.0+ Good</option>
        </select>

        <select name="budget" value={filters.budget} onChange={handleFilterChange} className={`bg-slate-800/50 border ${filters.budget ? 'border-sky-500 text-sky-400 bg-sky-500/10' : 'border-slate-700 text-slate-300'} px-3 py-2 rounded-xl text-xs md:text-[13px] font-medium outline-none cursor-pointer transition-all hover:border-sky-500 shrink-0 appearance-none`}>
          <option value="" className="bg-slate-900 text-white">{t("ಬಜೆಟ್ (Budget)", "Budget")}</option>
          <option value="low" className="bg-slate-900 text-white">{t("₹1000 ಕ್ಕಿಂತ ಕಡಿಮೆ", "Under ₹1000")}</option>
          <option value="mid" className="bg-slate-900 text-white">₹1000 - ₹3000</option>
          <option value="high" className="bg-slate-900 text-white">{t("₹3000 ಕ್ಕಿಂತ ಹೆಚ್ಚು", "Above ₹3000")}</option>
        </select>

        <select name="area" value={filters.area} onChange={handleFilterChange} className={`bg-slate-800/50 border ${filters.area ? 'border-sky-500 text-sky-400 bg-sky-500/10' : 'border-slate-700 text-slate-300'} px-3 py-2 rounded-xl text-xs md:text-[13px] font-medium outline-none cursor-pointer transition-all hover:border-sky-500 shrink-0 appearance-none`}>
          <option value="" className="bg-slate-900 text-white">{t("ಎಲ್ಲಾ ಏರಿಯಾಗಳು", "All Areas")}</option>
          <option value="S.S. Puram" className="bg-slate-900 text-white">S.S. Puram</option>
          <option value="Siddaganga Extension" className="bg-slate-900 text-white">Siddaganga</option>
          <option value="Batawadi" className="bg-slate-900 text-white">Batawadi</option>
        </select>

        <div className="ml-auto hidden md:flex items-center text-xs text-slate-400 whitespace-nowrap shrink-0 pl-4">
          <SlidersHorizontal size={14} className="mr-1.5" /> 
          {t("ಫಲಿತಾಂಶಗಳು:", "Showing")} {totalCount} {lang === "en" && "results"}
        </div>
      </div>

      {/* ====== MAIN LAYOUT GRID ====== */}
      <div className="flex flex-col lg:flex-row w-full gap-6 lg:gap-8 relative items-start">
        
        {/* Left: Business List */}
        <div className={`flex flex-col w-full lg:w-[72%] transition-opacity duration-300 ${isFiltering ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          {businesses.length > 0 ? (
            <>
              <div className="flex flex-col gap-4">
                {businesses.map((biz, index) => {
                  const isLast = index === businesses.length - 1;
                  return (
                    <div key={`biz-${biz.id}-${index}`} ref={isLast ? lastElementRef : null}>
                      <ProductCard product={biz} />
                    </div>
                  );
                })}
              </div>

              {/* Loader for Infinite Scroll */}
              {isLoading && page > 1 && (
                <div className="w-full flex justify-center py-6">
                  <Loader2 className="animate-spin text-sky-500 w-8 h-8" />
                </div>
              )}
            </>
          ) : (
            !isLoading && (
              <div className="bg-slate-900/50 p-10 md:p-16 rounded-2xl text-center border border-dashed border-slate-700">
                <Search className="w-12 h-12 text-slate-500 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-bold text-white mb-2">{t("ಯಾವುದೇ ಫಲಿತಾಂಶಗಳಿಲ್ಲ", "No results found")}</h3>
                <p className="text-slate-400 text-sm mb-6">{t("ನಿಮ್ಮ ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಬದಲಾಯಿಸಿ ಪ್ರಯತ್ನಿಸಿ.", "Try adjusting your filters.")}</p>
                <button onClick={() => setFilters({ sort_by: "", star_rating: "", budget: "", area: "" })} className="px-6 py-2 border border-sky-500 text-sky-400 rounded-lg hover:bg-sky-500 hover:text-white transition-colors font-semibold text-sm">
                  {t("ಫಿಲ್ಟರ್ ತೆರವುಗೊಳಿಸಿ", "Clear Filters")}
                </button>
              </div>
            )
          )}
        </div>

        {/* Right: Sticky Sidebar Lead Gen Form */}
        <div className="w-full lg:w-[28%] lg:sticky lg:top-[100px]">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl shadow-black/50">
            <p className="text-[11px] md:text-xs text-slate-400 mb-3">We'll send you contact details in seconds for free.</p>
            <h3 className="text-[15px] md:text-base font-bold text-white mb-4 leading-tight">
              What type of <span className="text-sky-500">{category ? (lang === 'kn' ? category : category) : "Service"}</span> are you looking for?
            </h3>

            <div className="flex items-center gap-4 mb-5 text-sm text-slate-300">
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
                <input type="radio" name="type" value="Budget" defaultChecked className="accent-sky-500 w-3.5 h-3.5" /> Budget
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
                <input type="radio" name="type" value="Luxury" className="accent-sky-500 w-3.5 h-3.5" /> Luxury
              </label>
            </div>

            <form onSubmit={handleLeadSubmit} className="flex flex-col gap-3">
              <div className="flex items-center bg-slate-800/80 border border-slate-700 rounded-lg overflow-hidden focus-within:border-sky-500 transition-colors h-11">
                <span className="px-3 text-slate-400 border-r border-slate-700 bg-slate-800/50 flex items-center h-full"><User size={14} /></span>
                <input type="text" className="w-full bg-transparent text-white px-3 text-sm outline-none placeholder:text-slate-500" placeholder="Name" required />
              </div>

              <div className="flex items-center bg-slate-800/80 border border-slate-700 rounded-lg overflow-hidden focus-within:border-sky-500 transition-colors h-11">
                <span className="px-3 text-slate-400 border-r border-slate-700 bg-slate-800/50 flex items-center h-full"><Smartphone size={14} /></span>
                <input type="tel" className="w-full bg-transparent text-white px-3 text-sm outline-none placeholder:text-slate-500" placeholder="Mobile Number" required pattern="[0-9]{10}" />
              </div>

              <div className="flex items-start gap-2 mt-1 mb-2 text-[11px] md:text-xs text-slate-400">
                <input type="checkbox" required defaultChecked className="accent-sky-500 cursor-pointer mt-0.5 shrink-0" />
                <span className="leading-tight">I Agree to <Link href="/privacy" className="text-sky-500 hover:underline">T&C's Privacy Policy</Link></span>
              </div>

              <button 
                type="submit" 
                disabled={leadStatus !== "idle"}
                className={`w-full font-bold py-3 rounded-lg text-sm transition-all flex justify-center items-center gap-2 shadow-md ${
                  leadStatus === "success" ? "bg-green-500 text-white" : 
                  leadStatus === "loading" ? "bg-sky-600 text-white opacity-80" : 
                  "bg-sky-500 hover:bg-sky-400 text-white"
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
        </div>

      </div>
    </div>
  );
}

// 🚨 4. Default Export with Strict Suspense Boundary
export default function ListingsPage() {
  return (
    // useSearchParams ಬಳಸುವಾಗ Suspense ಕಡ್ಡಾಯ. ಇಲ್ಲದಿದ್ದರೆ ರೌಟಿಂಗ್ ಕ್ರಾಶ್ ಆಗುತ್ತದೆ.
    <Suspense fallback={
      <div className="w-full min-h-[50vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-sky-500 animate-spin mb-4" />
        <p className="text-slate-400">Loading listings...</p>
      </div>
    }>
      <ListingsContent />
    </Suspense>
  );
}
"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { 
  Phone, MessageCircle, MapPin, Share2, Edit3, Heart, 
  Star, ChevronRight, CheckCircle, Car, Wifi, 
  Snowflake, Shield, Zap, X, User, Smartphone, Loader2, Store,
  BadgeCheck, Clock
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { BusinessListing } from "@/services/courses";
import { submitEnquiry, toggleBookmark } from "@/services/user";

const iconMap: Record<string, React.ReactNode> = {
  "parking": <Car size={24} className="text-sky-400" />,
  "ಪಾರ್ಕಿಂಗ್": <Car size={24} className="text-sky-400" />,
  "wifi": <Wifi size={24} className="text-green-400" />,
  "ವೈಫೈ": <Wifi size={24} className="text-green-400" />,
  "ac": <Snowflake size={24} className="text-blue-300" />,
  "ಎಸಿ": <Snowflake size={24} className="text-blue-300" />,
  "security": <Shield size={24} className="text-amber-500" />,
  "ಭದ್ರತೆ": <Shield size={24} className="text-amber-500" />,
  "power": <Zap size={24} className="text-yellow-400" />,
  "ವಿದ್ಯುತ್": <Zap size={24} className="text-yellow-400" />,
  "default": <CheckCircle size={24} className="text-emerald-500" />
};

export default function BusinessDetailClient({ business }: { business: BusinessListing }) {
  const { lang, t } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [activeGalleryDot, setActiveGalleryDot] = useState(0);

  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success">("idle");
  const [enquiryData, setEnquiryData] = useState({ name: user?.first_name || "", phone: user?.mobile || "" });

  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["overview", "services", "photos", "reviews"];
      let current = "overview";
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 180) {
          current = section;
        }
      }
      setActiveTab(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGalleryScroll = () => {
    if (galleryRef.current) {
      const scrollPosition = galleryRef.current.scrollLeft;
      const itemWidth = galleryRef.current.clientWidth;
      setActiveGalleryDot(Math.round(scrollPosition / itemWidth));
    }
  };

  const getHighlights = () => {
    if (!business) return [];
    const highlights = [];
    if (business.emergency_24x7) highlights.push(t("24/7 ತುರ್ತು", "24/7 Emergency"));
    if (business.pure_veg) highlights.push(t("ಶುದ್ಧ ಸಾಕಾಹಾರ", "Pure Vegetarian"));
    if (business.is_verified) highlights.push(t("ಪರಿಶೋಧಿತ", "Verified"));
    
    if (highlights.length < 4) {
      const genericHighlights = [t("ಪಾರ್ಕಿಂಗ್", "Parking"), t("ಉಚಿತ ವೈಫೈ", "Free WiFi"), t("ಭದ್ರತೆ", "Security"), t("ಎಸಿ ಕೋಠರಿಗಳು", "AC Rooms")];
      highlights.push(...genericHighlights.slice(0, 4 - highlights.length));
    }
    return highlights.slice(0, 4);
  };

  const highlights = getHighlights();

  const categorizedServices = useMemo(() => {
    if (!business) return {};
    const rawServices = [];
    if (business.pure_veg) rawServices.push(t("ಶುದ್ಧ ಸಾಕಾಹಾರ", "Pure Vegetarian"));
    if (business.emergency_24x7) rawServices.push(t("24/7 ಸೇವೆ", "24/7 Service"));
    if (business.is_verified) rawServices.push(t("ಪರಿಶೋಧಿತ ಬಿಜನೆಸ್", "Verified Business"));
    
    if (rawServices.length < 6) {
      const additionalServices = [t("ಕಾರ್ಡ್ ಪೇಮೆಂಟ್", "Card Payment"), t("CCTV", "CCTV"), t("ಲಿಫ್ಟ್", "Lift"), t("ವಿದ್ಯುತ್ ಬ್ಯಾಕ್ಅಪ್", "Power Backup"), t("ರೂಮ್ ಸೇವೆ", "Room Service"), t("ಲಾಂಡ್ರಿ", "Laundry")];
      rawServices.push(...additionalServices.slice(0, 6 - rawServices.length));
    }
    
    const categories: Record<string, string[]> = {};
    const keywords = lang === 'kn' ? {
      "ಭದ್ರತೆ": ["security", "ಭದ್ರತೆ", "cctv", "24/7"],
      "ಸೌಲಭ್ಯಗಳು": ["parking", "ಪಾರ್ಕಿಂಗ್", "wifi", "ವೈಫೈ", "power", "ವಿದ್ಯುತ್", "lift", "ಲಿಫ್ಟ್"]
    } : {
      "Safety & Security": ["security", "cctv", "guard", "24/7"],
      "Facilities": ["parking", "wifi", "power", "lift", "laundry"]
    };

    rawServices.forEach(item => {
      let found = false;
      const lowerItem = item.toLowerCase();
      for (const [cat, keys] of Object.entries(keywords)) {
        if (keys.some(k => lowerItem.includes(k))) {
          if (!categories[cat]) categories[cat] = [];
          categories[cat].push(item);
          found = true;
          break;
        }
      }
      if (!found) {
        const genCat = t("ಸಾಮಾನ್ಯ ಸೇವೆ", "General Services");
        if (!categories[genCat]) categories[genCat] = [];
        categories[genCat].push(item);
      }
    });
    return categories;
  }, [business, lang, t]);

  const handleShare = async () => {
    if (!business) return;
    const shareData = {
      title: t(business.name_kn, business.name),
      text: `Check out ${t(business.name_kn, business.name)} on Tumakuru Connect`,
      url: window.location.href
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share failed:", err);
      }
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(shareData.url);
        alert(t("ಲಿಂಕ್ ಕಾಪಿ ಮಾಡಲಾಗಿದೆ!", "Link copied to clipboard!"));
      } catch (err) {
        console.error("Clipboard write failed:", err);
      }
    } else {
      alert("Copy to clipboard is not supported in this browser.");
    }
  };

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    
    // Optimistic UI update
    setIsBookmarked(!isBookmarked);
    try {
      await toggleBookmark(business.id);
    } catch (error) {
      setIsBookmarked(isBookmarked); // Revert on failure
      alert(t("ಸಂಪರ್ಕ ದೋಷ, ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ", "Network error, please try again."));
    }
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("loading");
    try {
      await submitEnquiry(business.id, { 
        customer_name: enquiryData.name, 
        phone_number: enquiryData.phone 
      });
      setFormStatus("success");
      setTimeout(() => {
        setFormStatus("idle");
        setIsEnquiryOpen(false);
      }, 2000);
    } catch (error) {
      setFormStatus("idle");
      alert(t("ವಿಫಲವಾಗಿದೆ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.", "Failed to submit enquiry. Please try again."));
    }
  };

  const title = t(business.name_kn, business.name);
  const location = t(business.area_kn, business.area);
  const category = t(business.category_name_kn, business.category_name);
  let backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  if (typeof window !== 'undefined') {
    const host = window.location.hostname === 'localhost' ? '127.0.0.1' : window.location.hostname;
    backendUrl = `http://${host}:8000`;
  }
  let mainImage = business.main_image_upload || business.image_url;
  
  if (mainImage && !mainImage.startsWith('http')) {
    mainImage = `${backendUrl}${mainImage.startsWith('/') ? '' : '/'}${mainImage}`;
  }

  return (
    <div className="w-full bg-slate-50 dark:bg-[#0a1120] min-h-screen pb-24 md:pb-10 font-poppins">
      <div className="max-w-[1200px] mx-auto px-4 md:px-[3%] pt-6 md:pt-8">
        
        {/* 1. Breadcrumbs */}
        <div className="flex items-center gap-2 text-[11px] md:text-[13px] text-slate-500 dark:text-slate-400 mb-3 md:mb-5 font-semibold whitespace-nowrap overflow-x-auto scrollbar-hide">
          <Link href="/" className="hover:text-sky-500 transition-colors">{t("ತುಮಕೂರು", "Tumkur")}</Link>
          <ChevronRight size={14} className="text-slate-400 dark:text-slate-600" />
          <Link href={`/listings?category=${business.category_name}`} className="hover:text-sky-500 transition-colors">{category}</Link>
          <ChevronRight size={14} className="text-slate-400 dark:text-slate-600" />
          <span className="font-bold text-slate-800 dark:text-white truncate">{title}</span>
        </div>

        {/* 2. Title, Rating & Actions - Flex container */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-5 mb-6 md:mb-8">
          
          {/* Left side: Title, Badges, Rating */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                {title}
              </h1>
              {business.is_verified && (
                <span className="inline-flex items-center gap-1 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 px-2.5 py-1 rounded-md text-xs font-bold border border-sky-200 dark:border-sky-500/20 shadow-sm mt-1">
                  <BadgeCheck size={16} /> VERIFIED
                </span>
              )}
            </div>
            
            {/* Rating Stars Yelp Style */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={22} 
                    className={star <= Math.round(Number(business.rating) || 5) 
                      ? "fill-amber-500 text-amber-500 drop-shadow-sm" 
                      : "fill-slate-200 text-slate-200 dark:fill-slate-800 dark:text-slate-800"
                    } 
                  />
                ))}
              </div>
              <span className="text-lg font-extrabold text-slate-800 dark:text-slate-200">
                {business.rating ? Number(business.rating).toFixed(1) : "5.0"}
              </span>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                ({business.review_count || 0} {t("ವಿಮರ್ಶೆಗಳು", "reviews")})
              </span>
            </div>

            {/* Tags / Status / Address */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-4 text-sm">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-500/20">
                 {t("ಈಗ ತೆರೆದಿದೆ", "Open Now")}
              </span>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
              <span className="text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px] md:text-xs">
                {category}
              </span>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
              <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5 font-medium">
                <MapPin size={16} className="text-sky-500" /> {business.address || `${location}, Tumkur`}
              </span>
            </div>
          </div>

          {/* Right side: Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
             <button onClick={handleBookmarkToggle} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all border shadow-sm ${isBookmarked ? 'bg-rose-50 text-rose-500 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/30 hover:bg-rose-100 dark:hover:bg-rose-500/20' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-rose-500'}`}>
               <Heart size={18} fill={isBookmarked ? "currentColor" : "none"} className={isBookmarked ? "text-rose-500" : ""} /> 
               <span className="hidden md:inline">{isBookmarked ? t("ಉಳಿಸಲಾಗಿದೆ", "Saved") : t("ಉಳಿಸಿ", "Save")}</span>
             </button>
             <button onClick={handleShare} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm group">
               <Share2 size={18} className="text-sky-500 group-hover:scale-110 transition-transform" /> <span className="hidden md:inline">{t("ಹಂಚಿ", "Share")}</span>
             </button>
          </div>
        </div>

        {/* 3. Yelp Style Premium Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 md:gap-3 h-[280px] md:h-[420px] rounded-2xl md:rounded-3xl overflow-hidden mb-10 group/gallery cursor-pointer relative shadow-lg">
          
          {/* Main Large Image */}
          <div className="md:col-span-3 md:row-span-2 relative w-full h-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80">
             {mainImage ? (
                <img src={mainImage} alt={title as string} className="w-full h-full object-cover transition-transform duration-700 group-hover/gallery:scale-[1.02]" />
             ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900/50">
                   <Store className="w-20 h-20 text-slate-300 dark:text-slate-700" />
                </div>
             )}
          </div>
          
          {/* Top Small Image (Desktop only) */}
          <div className="hidden md:block relative w-full h-full bg-slate-200 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-800/80">
             {mainImage ? (
                <img src={mainImage} alt="Gallery 2" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110 opacity-95 hover:opacity-100" />
             ) : (
                <div className="w-full h-full flex items-center justify-center"><Store className="w-10 h-10 text-slate-400 dark:text-slate-600" /></div>
             )}
          </div>

          {/* Bottom Small Image with Overlay (Desktop only) */}
          <div className="hidden md:block relative w-full h-full bg-slate-300 dark:bg-slate-800 overflow-hidden group border border-slate-200 dark:border-slate-800/80">
             {mainImage ? (
                <img src={mainImage} alt="Gallery 3" className="w-full h-full object-cover blur-[2px] transition-transform duration-700 group-hover:scale-110 group-hover:blur-[1px]" />
             ) : (
                <div className="w-full h-full flex items-center justify-center"><Store className="w-10 h-10 text-slate-400 dark:text-slate-600" /></div>
             )}
             {/* "View all photos" overlay */}
             <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white transition-colors group-hover:bg-black/60 backdrop-blur-[1px]">
                 <span className="text-2xl font-bold">+</span>
                 <span className="text-sm font-extrabold tracking-wide uppercase mt-1">{t("ಫೋಟೋಗಳು", "View Photos")}</span>
             </div>
          </div>
          
          {/* Mobile "View Photos" floating button */}
          <div className="md:hidden absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-white/20 shadow-lg">
             <span className="text-lg leading-none">+</span> {t("ಫೋಟೋಗಳು", "Photos")}
          </div>
        </div>

        <div className="flex flex-wrap md:flex-nowrap gap-3 mb-10 w-full border-b border-slate-200 dark:border-slate-800 pb-8">
          {business.phone ? (
            <a 
              href={`tel:${business.phone}`} 
              className="flex-1 md:flex-none bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 group"
            >
              <Phone size={18} className="group-hover:animate-pulse" /> 
              <span>{t("ಈಗ ಕರೆ ಮಾಡಿ", "Call Now")} - {business.phone}</span>
            </a>
          ) : (
            <button disabled className="flex-1 md:flex-none bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm cursor-not-allowed border border-slate-200 dark:border-slate-700">
              <Phone size={18} /> <span>{t("ಸಂಪರ್ಕ ಲಭ್ಯವಿಲ್ಲ", "No Contact")}</span>
            </button>
          )}
          
          {business.phone && (
            <a 
              href={`https://wa.me/91${business.phone.replace(/\D/g,'')}?text=Hi, I found your business on Tumakuru Connect.`}
              target="_blank" rel="noopener noreferrer"
              className="flex-1 md:flex-none bg-[#25D366] hover:bg-[#1DA851] text-white flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#25D366]/20 group"
            >
              <MessageCircle size={18} className="group-hover:scale-110 transition-transform" /> 
              <span>WhatsApp</span>
            </a>
          )}

          <button onClick={() => setIsEnquiryOpen(true)} className="w-full md:w-auto md:ml-auto bg-sky-50 dark:bg-sky-500/10 hover:bg-sky-500 text-sky-600 hover:text-white dark:text-sky-400 border border-sky-200 dark:border-sky-500/30 flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm">
            <Store size={18} /> {t("ಅತ್ಯುತ್ತಮ ಡೀಲ್ ಪಡೆಯಿರಿ", "Get Best Deal")}
          </button>
        </div>

        <div className="sticky top-[60px] md:top-[75px] bg-slate-50/95 dark:bg-[#0a1120]/95 backdrop-blur-md z-40 flex gap-6 md:gap-10 border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-hide pt-2 mb-8">
          {["overview", "location-hours", "services", "photos", "reviews"].map((tab) => (
            <button 
              key={tab}
              onClick={() => {
                const el = document.getElementById(tab);
                if (el) window.scrollTo({ top: el.offsetTop - 120, behavior: "smooth" });
              }}
              className={`pb-3 text-[14px] md:text-base font-bold capitalize whitespace-nowrap border-b-[3px] transition-colors px-1 ${activeTab === tab ? 'text-sky-500 border-sky-500' : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              {t(tab === "overview" ? "ಸ್ಥೂಲನೋಟ" : tab === "location-hours" ? "ಸಂಪರ್ಕ & ಸಮಯ" : tab === "services" ? "ಸೇವೆಗಳು" : tab === "photos" ? "ಫೋಟೋಗಳು" : "ವಿಮರ್ಶೆಗಳು", tab === "location-hours" ? "Location & Hours" : tab)}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 min-w-0">
            <section id="overview" className="mb-10 pb-8 border-b border-slate-800 scroll-mt-[150px]">
              <h2 className="text-lg font-bold text-white mb-6">{t("ಹೈಲೈಟ್ಸ್", "Highlights from the business")}</h2>
              <div className="flex flex-wrap gap-4 md:gap-8">
                {highlights.map((item, i) => {
                  const lower = item.toLowerCase();
                  const iconKey = Object.keys(iconMap).find(k => lower.includes(k)) || "default";
                  return (
                    <div key={i} className="flex flex-col items-center gap-3 w-[70px] text-center">
                      <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner">
                        {iconMap[iconKey]}
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium leading-tight">{item}</span>
                    </div>
                  );
                })}
              </div>
              
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-400 mt-8 mb-3 uppercase tracking-wider">{t("ವಿವರಣೆ", "Business summary")}</h3>
              <p className="text-[13px] md:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {t(business.description_kn, business.description) || t("ವಿವರಗಳು ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿವೆ.", "Detailed information will be updated soon.")}
              </p>
            </section>

            {/* LOCATION & HOURS SECTION */}
            <section id="location-hours" className="mb-10 pb-8 border-b border-slate-200 dark:border-slate-800 scroll-mt-[150px]">
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mb-6">{t("ವಿಳಾಸ ಮತ್ತು ಸಮಯ", "Location & Hours")}</h2>
              
              <div className="flex flex-col md:flex-row gap-8 md:gap-10">
                {/* Map & Address */}
                <div className="flex-[1.5]">
                  <div className="w-full h-56 bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden mb-5 border border-slate-200 dark:border-slate-700 shadow-md">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      frameBorder="0" 
                      scrolling="no" 
                      marginHeight={0} 
                      marginWidth={0} 
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(business.address || `${location}, Tumkur`)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    ></iframe>
                  </div>
                  
                  <div className="flex items-start gap-4 mb-6">
                    <MapPin className="text-sky-500 shrink-0 mt-1" size={22} />
                    <div>
                      <p className="text-slate-900 dark:text-white font-extrabold text-lg mb-1">{t(business.name_kn, business.name)}</p>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-2 font-medium">{business.address || `${location}, Tumkur, Karnataka, India`}</p>
                      <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(business.address || `${location}, Tumkur`)}`} target="_blank" rel="noopener noreferrer" className="text-sky-500 font-bold text-sm hover:underline flex items-center gap-1">
                        {t("ದಾರಿ ಹುಡುಕಿ", "Get Directions")} <ChevronRight size={14} />
                      </a>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    {business.phone && (
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                          <Phone size={18} className="text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">{t("ಫೋನ್", "Phone Number")}</p>
                          <a href={`tel:${business.phone}`} className="text-slate-900 dark:text-white font-bold hover:text-emerald-500 transition-colors">{business.phone}</a>
                        </div>
                      </div>
                    )}
                    {business.phone && (
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center">
                          <MessageCircle size={18} className="text-[#25D366]" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">WhatsApp</p>
                          <a href={`https://wa.me/91${business.phone.replace(/\D/g,'')}`} target="_blank" className="text-slate-900 dark:text-white font-bold hover:text-[#25D366] transition-colors">{t("ಸಂದೇಶ ಕಳುಹಿಸಿ", "Send Message")}</a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex-1 shrink-0">
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md">
                    <h3 className="font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <Clock size={18} className="text-sky-500" /> {t("ಕೆಲಸದ ಸಮಯ", "Working Hours")}
                    </h3>
                    <table className="w-full text-[13px] md:text-sm font-medium">
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {[
                          { day: t("ಸೋಮವಾರ", "Mon"), time: "9:00 AM - 9:00 PM" },
                          { day: t("ಮಂಗಳವಾರ", "Tue"), time: "9:00 AM - 9:00 PM" },
                          { day: t("ಬುಧವಾರ", "Wed"), time: "9:00 AM - 9:00 PM" },
                          { day: t("ಗುರುವಾರ", "Thu"), time: "9:00 AM - 9:00 PM" },
                          { day: t("ಶುಕ್ರವಾರ", "Fri"), time: "9:00 AM - 9:00 PM" },
                          { day: t("ಶನಿವಾರ", "Sat"), time: "9:00 AM - 9:00 PM" },
                          { day: t("ಭಾನುವಾರ", "Sun"), time: t("ರಜೆ", "Closed"), isClosed: true },
                        ].map((d, i) => {
                          const isToday = i === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
                          return (
                            <tr key={i} className={`group ${isToday ? "font-extrabold text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}>
                              <td className="py-3 flex items-center gap-2">
                                {d.day}
                                {isToday && <span className="text-[10px] bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400 px-1.5 py-0.5 rounded uppercase tracking-wider">Today</span>}
                              </td>
                              <td className={`py-3 text-right ${d.isClosed ? 'text-rose-500 font-bold' : ''}`}>
                                {d.time}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            <section id="services" className="mb-10 pb-8 border-b border-slate-800 scroll-mt-[150px]">
              <h2 className="text-lg font-bold text-white mb-6">{t("ಸೇವೆಗಳು ಮತ್ತು ಸೌಲಭ್ಯಗಳು", "Services & Amenities")}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {Object.values(categorizedServices).flat().slice(0, 6).map((s, i) => (
                  <div key={i} className="flex items-center gap-3 text-[13px] text-slate-300">
                    <CheckCircle size={16} className="text-emerald-500 shrink-0" /> <span>{s}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {business.pure_veg && (
                  <span className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
                    <CheckCircle size={12} /> {t("ಶುದ್ಧ ಸಾಕಾಹಾರ", "Pure Vegetarian")}
                  </span>
                )}
                {business.emergency_24x7 && (
                  <span className="inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1 rounded-full text-xs font-semibold">
                    <CheckCircle size={12} /> {t("24/7 ತುರ್ತು ಸೇವೆ", "24/7 Emergency")}
                  </span>
                )}
              </div>
            </section>
          </div>

          <div className="hidden lg:block w-[320px] shrink-0 sticky top-[150px] h-fit">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
              <h3 className="text-base font-bold text-white mb-5 leading-tight">
                Get Details for <span className="text-sky-500">{title as string}</span>
              </h3>
              <form onSubmit={submitForm} className="flex flex-col gap-4">
                <input type="text" value={enquiryData.name} onChange={e => setEnquiryData({...enquiryData, name: e.target.value})} placeholder="Name" className="w-full bg-slate-950 border border-slate-700 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-sky-500" required />
                <input type="tel" value={enquiryData.phone} onChange={e => setEnquiryData({...enquiryData, phone: e.target.value})} placeholder="Mobile Number" className="w-full bg-slate-950 border border-slate-700 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-sky-500" required />
                <button type="submit" disabled={formStatus !== "idle"} className="w-full bg-sky-500 text-white font-bold py-3 rounded-lg text-sm hover:bg-sky-400 transition-colors flex items-center justify-center gap-2 mt-2">
                  {formStatus === "idle" ? t("ಅತ್ಯುತ್ತಮ ಡೀಲ್ ಪಡೆಯಿರಿ", "Get Best Deal") : formStatus === "success" ? <CheckCircle size={18} /> : <Loader2 className="animate-spin" size={18} />}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE BOTTOM STICKY BAR */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#050b14]/98 backdrop-blur-lg border-t border-slate-800 p-3 z-50 flex gap-3 shadow-[0_-10px_20px_rgba(0,0,0,0.5)] pb-safe-bottom">
        {business.phone ? (
          <a href={`tel:${business.phone}`} className="flex-1 bg-slate-800 border border-slate-700 text-white flex items-center justify-center gap-2 rounded-xl font-bold text-sm h-12">
            <Phone size={18} className="text-emerald-400" /> Call
          </a>
        ) : (
          <button disabled className="flex-1 bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center gap-2 rounded-xl font-bold text-sm h-12 cursor-not-allowed">
            <Phone size={18} /> N/A
          </button>
        )}
        <button onClick={() => setIsEnquiryOpen(true)} className="flex-[2] bg-sky-500 text-white flex items-center justify-center gap-2 rounded-xl font-bold text-sm h-12 shadow-lg shadow-sky-500/20">
          <MessageCircle size={18} /> {t("ಡೀಲ್ ಪಡೆಯಿರಿ", "Get Best Deal")}
        </button>
      </div>

      {/* MODALS */}
      {isEnquiryOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 flex justify-between items-center border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2"><MessageCircle className="text-sky-500" /> {t("ಡೀಲ್ ಪಡೆಯಿರಿ", "Get Best Deal")}</h3>
              <button onClick={() => setIsEnquiryOpen(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
            </div>
            <form onSubmit={submitForm} className="p-6 flex flex-col gap-4">
              <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg overflow-hidden focus-within:border-sky-500 h-12">
                <span className="px-4 text-slate-500"><User size={16} /></span>
                <input type="text" value={enquiryData.name} onChange={e => setEnquiryData({...enquiryData, name: e.target.value})} className="w-full bg-transparent text-white text-sm outline-none" placeholder="Your Name" required />
              </div>
              <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg overflow-hidden focus-within:border-sky-500 h-12">
                <span className="px-4 text-slate-500"><Smartphone size={16} /></span>
                <input type="tel" value={enquiryData.phone} onChange={e => setEnquiryData({...enquiryData, phone: e.target.value})} className="w-full bg-transparent text-white text-sm outline-none" placeholder="Mobile Number" required />
              </div>
              <button type="submit" disabled={formStatus !== "idle"} className="w-full bg-sky-500 text-white font-bold h-12 rounded-lg text-sm hover:bg-sky-400 mt-2 flex items-center justify-center gap-2">
                {formStatus === "loading" ? <Loader2 className="animate-spin" /> : formStatus === "success" ? <CheckCircle /> : t("ವಿಚಾರಣೆ ಕಳುಹಿಸಿ", "Submit Enquiry")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

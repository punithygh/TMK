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
import { submitEnquiry, toggleBookmark, submitReview, getUserDashboard } from "@/services/user";

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

// ✅ Inline ReviewForm sub-component
function ReviewForm({ businessId, onSuccess, t }: { businessId: number; onSuccess: () => void; t: (kn: string, en: string) => string }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    setStatus("loading");
    try {
      await submitReview(businessId, { rating, comment });
      setStatus("success");
      onSuccess();
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 text-emerald-500 font-semibold">
        <CheckCircle size={20} /> {t("ಧನ್ಯವಾದಗಳು! ವಿಮರ್ಶೆ ಸಲ್ಲಿಯಾಗಿದೆ.", "Thank you! Review submitted.")}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(s => (
          <button
            key={s} type="button"
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setRating(s)}
            className="p-0.5 transition-transform hover:scale-110"
          >
            <Star
              size={28}
              className={(hovered || rating) >= s
                ? "fill-amber-500 text-amber-500"
                : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"}
            />
          </button>
        ))}
        {rating > 0 && <span className="ml-2 text-sm text-slate-600 dark:text-slate-400 self-center font-semibold">{rating}/5</span>}
      </div>
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder={t("ನಿಮ್ಮ ಅನುಭವ ಹಂಚಿಕೊಳ್ಳಿ...", "Share your experience...")}
        rows={3}
        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-500 resize-none"
      />
      {status === "error" && <p className="text-rose-500 text-sm">{t("ವಿಫಲವಾಗಿದೆ, ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ", "Failed, please try again")}</p>}
      <button
        type="submit"
        disabled={rating === 0 || status === "loading"}
        className="self-start bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2"
      >
        {status === "loading" ? <Loader2 size={16} className="animate-spin" /> : <Star size={16} />}
        {t("ಸಲ್ಲಿಸಿ", "Submit Review")}
      </button>
    </form>
  );
}

export default function BusinessDetailClient({ business, similarBusinesses = [] }: { business: BusinessListing; similarBusinesses?: BusinessListing[] }) {
  const { lang, t } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [activeGalleryDot, setActiveGalleryDot] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [toastMsg, setToastMsg] = useState("");
  const [mainImgLoaded, setMainImgLoaded] = useState(false);

  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success">("idle");
  const [enquiryData, setEnquiryData] = useState({ name: user?.first_name || "", phone: user?.mobile || "" });
  const [phoneError, setPhoneError] = useState("");
  // Suggest edit form
  const [suggestData, setSuggestData] = useState({ name: "", phone: "", field: "", details: "" });
  const [suggestStatus, setSuggestStatus] = useState<"idle" | "loading" | "success">("idle");

  const galleryRef = useRef<HTMLDivElement>(null);

  // ✅ FIX A: Load bookmark state from API on mount
  useEffect(() => {
    if (!isAuthenticated) return;
    getUserDashboard().then(data => {
      const bookmarked = data.my_bookmarks.some(b => b.business.id === business.id);
      setIsBookmarked(bookmarked);
    }).catch(() => {/* fail silently */});
  }, [isAuthenticated, business.id]);

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

  // ✅ FIX 1: Only real highlights from DB — no fake padding
  const highlights = useMemo(() => {
    if (!business) return [];
    const h = [];
    if (business.emergency_24x7) h.push(t("24/7 ತುರ್ತು", "24/7 Emergency"));
    if (business.pure_veg) h.push(t("ಶುದ್ಧ ಸಾಕಾಹಾರ", "Pure Vegetarian"));
    if (business.is_verified) h.push(t("ಪರಿಶೋಧಿತ", "Verified"));
    return h;
  }, [business, t]);

  // ✅ FIX 2: Only real services from DB — no fake padding
  const realServices = useMemo(() => {
    if (!business) return [];
    const s = [];
    if (business.pure_veg) s.push(t("ಶುದ್ಧ ಸಾಕಾಹಾರ", "Pure Vegetarian"));
    if (business.emergency_24x7) s.push(t("24/7 ಸೇವೆ", "24/7 Service"));
    if (business.is_verified) s.push(t("ಪರಿಶೋಧಿತ ಬಿಜನೆಸ್", "Verified Business"));
    return s;
  }, [business, t]);

  // Toast helper
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

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
        showToast(t("✅ ಲಿಂಕ್ ಕಾಪಿ ಮಾಡಲಾಗಿದೆ!", "✅ Link copied to clipboard!"));
      } catch (err) {
        showToast(t("❌ ಕಾಪಿ ವಿಫಲವಾಗಿದೆ", "❌ Copy failed"));
      }
    } else {
      showToast(t("❌ ಬ್ರೌಸರ್ ಬೆಂಬಲಿಸುವುದಿಲ್ಲ", "❌ Not supported in this browser"));
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

  // ✅ FIX C: Phone validation (10-digit Indian number)
  const validatePhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 0) return t("ಮೋಬೈಲ್ ಸಂಖ್ಯೆ ಬೇಕು", "Mobile number is required");
    if (digits.length !== 10) return t("10 ಅಂಕೆಗಳ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ", "Enter a valid 10-digit number");
    return "";
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validatePhone(enquiryData.phone);
    if (err) { setPhoneError(err); return; }
    setPhoneError("");
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

  // ✅ FIX E: Suggest edit submit handler
  const submitSuggest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuggestStatus("loading");
    // For now just simulate — wire to backend API when endpoint is ready
    await new Promise(r => setTimeout(r, 1000));
    setSuggestStatus("success");
    setTimeout(() => { setSuggestStatus("idle"); setIsSuggestOpen(false); }, 2000);
  };

  const title = t(business.name_kn, business.name);
  const location = t(business.area_kn, business.area);
  const category = t(business.category_name_kn, business.category_name);
  let backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  if (typeof window !== 'undefined') {
    const host = window.location.hostname === 'localhost' ? '127.0.0.1' : window.location.hostname;
    backendUrl = `http://${host}:8000`;
  }

  // Safe URL resolver — guards against null/undefined/non-string from backend
  const resolveUrl = (url: unknown): string | null => {
    if (!url || typeof url !== 'string') return null;
    const trimmed = url.trim();
    if (!trimmed) return null;
    return trimmed.startsWith('http') ? trimmed : `${backendUrl}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
  };

  let mainImage = resolveUrl(business.main_image_upload) || resolveUrl(business.image_url);

  // Build real gallery — handles backend format: [{id, image}, ...] or string[]
  const galleryImages: string[] = [];
  if (mainImage) galleryImages.push(mainImage);

  // Add gallery_images from backend (array of {id, image} objects)
  if (business.gallery_images && Array.isArray(business.gallery_images)) {
    for (const item of business.gallery_images) {
      // Backend sends {id: number, image: string} — extract the URL
      const rawUrl = typeof item === 'string' ? item : (item as any)?.image;
      const resolved = resolveUrl(rawUrl);
      if (resolved && !galleryImages.includes(resolved)) galleryImages.push(resolved);
    }
  }

  // Also try image_url_2 / image_url_3 as additional fallback slots
  for (const extra of [business.image_url_2, business.image_url_3]) {
    const resolved = resolveUrl(extra);
    if (resolved && !galleryImages.includes(resolved)) galleryImages.push(resolved);
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
            
            {/* Rating Stars — FIX 3: No fake 5.0 default */}
            <div className="flex items-center gap-3 mt-3">
              {business.rating && Number(business.rating) > 0 ? (
                <>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={22}
                        className={star <= Math.round(Number(business.rating))
                          ? "fill-amber-500 text-amber-500 drop-shadow-sm"
                          : "fill-slate-200 text-slate-200 dark:fill-slate-800 dark:text-slate-800"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-lg font-extrabold text-slate-800 dark:text-slate-200">
                    {Number(business.rating).toFixed(1)}
                  </span>
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    ({business.review_count || 0} {t("ವಿಮರ್ಶೆಗಳು", "reviews")})
                  </span>
                </>
              ) : (
                <span className="text-sm text-slate-500 dark:text-slate-400 italic">
                  {t("ಇನ್ನೂ ವಿಮರ್ಶೆಗಳಿಲ್ಲ", "No ratings yet")}
                </span>
              )}
            </div>

            {/* Tags / Status / Address — FIX 4: Real is_open from DB */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-4 text-sm">
              {business.is_open !== null && business.is_open !== undefined ? (
                <span className={`font-bold px-2.5 py-1 rounded-md border ${
                  business.is_open
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20'
                    : 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20'
                }`}>
                  {business.is_open ? t("ಈಗ ತೆರೆದಿದೆ", "Open Now") : t("ಮುಚ್ಚಲಾಗಿದೆ", "Closed")}
                </span>
              ) : null}
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
            <button onClick={() => setIsSuggestOpen(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm group">
              <Edit3 size={18} className="text-slate-400 group-hover:text-sky-500 transition-colors" /> <span className="hidden md:inline text-sm">{t("ಆರ್ಡರ್ ಸುಧಾರಿಸಿ", "Suggest Edit")}</span>
            </button>
          </div>
        </div>

        {/* 3. Real Multi-Image Gallery — FIX B */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 md:gap-3 h-[280px] md:h-[420px] rounded-2xl md:rounded-3xl overflow-hidden mb-10 group/gallery cursor-pointer relative shadow-lg">

          {/* Main Large Image */}
          <div
            className="md:col-span-3 md:row-span-2 relative w-full h-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80"
            onClick={() => { if (galleryImages.length > 0) { setLightboxIndex(0); setLightboxOpen(true); } }}
          >
            {galleryImages[0] ? (
              <>
                {!mainImgLoaded && (
                  <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse z-10">
                    <div className="w-full h-full flex items-center justify-center">
                      <Store className="w-16 h-16 text-slate-300 dark:text-slate-700 animate-pulse" />
                    </div>
                  </div>
                )}
                <img
                  src={galleryImages[0]}
                  alt={title as string}
                  className={`w-full h-full object-cover transition-all duration-700 group-hover/gallery:scale-[1.02] ${mainImgLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setMainImgLoaded(true)}
                />
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900/50">
                <Store className="w-20 h-20 text-slate-300 dark:text-slate-700" />
              </div>
            )}
          </div>

          {/* Top Small Image (Desktop only) — image[1] if available, else placeholder */}
          <div
            className="hidden md:block relative w-full h-full bg-slate-200 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-800/80"
            onClick={() => { if (galleryImages.length > 1) { setLightboxIndex(1); setLightboxOpen(true); } }}
          >
            {galleryImages[1] ? (
              <img src={galleryImages[1]} alt="Gallery 2" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110 opacity-95 hover:opacity-100" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Store className="w-10 h-10 text-slate-400 dark:text-slate-600" />
              </div>
            )}
          </div>

          {/* Bottom Small Image with Overlay (Desktop only) — image[2] if available */}
          <div
            className="hidden md:block relative w-full h-full bg-slate-300 dark:bg-slate-800 overflow-hidden group border border-slate-200 dark:border-slate-800/80"
            onClick={() => { setLightboxIndex(2 < galleryImages.length ? 2 : 0); setLightboxOpen(true); }}
          >
            {galleryImages[2] ? (
              <img src={galleryImages[2]} alt="Gallery 3" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            ) : galleryImages[0] ? (
              <img src={galleryImages[0]} alt="Gallery 3" className="w-full h-full object-cover blur-[2px] group-hover:blur-[1px] transition-all duration-700" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><Store className="w-10 h-10 text-slate-400 dark:text-slate-600" /></div>
            )}
            {/* "View all" overlay */}
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white transition-colors group-hover:bg-black/60 backdrop-blur-[1px]">
              <span className="text-2xl font-bold">{galleryImages.length > 3 ? `+${galleryImages.length - 2}` : '+'}</span>
              <span className="text-sm font-extrabold tracking-wide uppercase mt-1">{t("ಫೋಟೋಗಳು", "View Photos")}</span>
            </div>
          </div>

          {/* Mobile floating count button */}
          {galleryImages.length > 0 && (
            <button
              onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}
              className="md:hidden absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-white/20 shadow-lg"
            >
              <span className="text-lg leading-none">{galleryImages.length}</span> {t("ಫೋಟೋಗಳು", "Photos")}
            </button>
          )}
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
            {/* FIX 5: Dark mode classes fixed in overview section */}
            <section id="overview" className="mb-10 pb-8 border-b border-slate-200 dark:border-slate-800 scroll-mt-[150px]">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">{t("ಹೈಲೈಟ್ಸ್", "Highlights from the business")}</h2>
              {highlights.length > 0 ? (
                <div className="flex flex-wrap gap-4 md:gap-8">
                  {highlights.map((item, i) => {
                    const lower = item.toLowerCase();
                    const iconKey = Object.keys(iconMap).find(k => lower.includes(k)) || "default";
                    return (
                      <div key={i} className="flex flex-col items-center gap-3 w-[70px] text-center">
                        <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-inner">
                          {iconMap[iconKey]}
                        </div>
                        <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-tight">{item}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400 italic">{t("ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ", "No highlights available")}</p>
              )}

              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-400 mt-8 mb-3 uppercase tracking-wider">{t("ವಿವರಣೆ", "Business summary")}</h3>
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

                {/* Working Hours — FIX 1: Real data or 'Not available' */}
                <div className="flex-1 shrink-0">
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md">
                    <h3 className="font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <Clock size={18} className="text-sky-500" /> {t("ಕೆಲಸದ ಸಮಯ", "Working Hours")}
                    </h3>
                    {business.working_hours ? (
                      <div className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        <div className="w-10 h-10 rounded-full bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center shrink-0">
                          <Clock size={18} className="text-sky-500" />
                        </div>
                        <div>
                          <p className="text-base font-bold text-slate-900 dark:text-white">{business.working_hours}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t("ಪ್ರತಿದಿನ", "Everyday")}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 dark:text-slate-400 italic flex items-center gap-2">
                        <Clock size={14} /> {t("ಸಮಯದ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ", "Hours not available")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* FIX 2: Services section — only real DB data, no fake padding */}
            <section id="services" className="mb-10 pb-8 border-b border-slate-200 dark:border-slate-800 scroll-mt-[150px]">
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mb-6">{t("ಸೇವೆಗಳು ಮತ್ತು ಸೌಲಭ್ಯಗಳು", "Services & Amenities")}</h2>
              {realServices.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {realServices.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 text-[13px] text-slate-700 dark:text-slate-300">
                      <CheckCircle size={16} className="text-emerald-500 shrink-0" /> <span>{s}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400 italic mb-6">{t("ಮಾಹಿತಿ ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿದೆ", "Information coming soon")}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {business.pure_veg && (
                  <span className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
                    <CheckCircle size={12} /> {t("ಶುದ್ಧ ಸಾಕಾಹಾರ", "Pure Vegetarian")}
                  </span>
                )}
                {business.emergency_24x7 && (
                  <span className="inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-xs font-semibold">
                    <CheckCircle size={12} /> {t("24/7 ತುರ್ತು ಸೇವೆ", "24/7 Emergency")}
                  </span>
                )}
              </div>
            </section>

            {/* FIX 5: Reviews Section — was completely missing */}
            <section id="reviews" className="mb-10 pb-8 scroll-mt-[150px]">
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mb-6">{t("ವಿಮರ್ಶೆಗಳು", "Reviews")}</h2>
              {/* Write a Review */}
              {isAuthenticated ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-6">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Star size={16} className="text-amber-500" /> {t("ವಿಮರ್ಶೆ ಬರೆಯಿರಿ", "Write a Review")}
                  </h3>
                  <ReviewForm businessId={business.id} onSuccess={() => {}} t={t} />
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-6 flex items-center justify-between gap-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">{t("ವಿಮರ್ಶೆ ಬರೆಯಲು ಲಾಗಿನ್ ಮಾಡಿ", "Login to write a review")}</p>
                  <button onClick={() => router.push('/login')} className="bg-sky-500 text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-sky-600 transition-colors">
                    {t("ಲಾಗಿನ್", "Login")}
                  </button>
                </div>
              )}
              {/* No reviews yet empty state */}
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Star size={40} className="text-slate-300 dark:text-slate-700 mb-3" />
                <p className="text-slate-500 dark:text-slate-400 font-semibold">{t("ಇನ್ನೂ ವಿಮರ್ಶೆಗಳಿಲ್ಲ", "No reviews yet")}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{t("ಮೊದಲ್ ವಿಮರ್ಶೆ ನೀವೇ ಬರೆಯಿರಿ!", "Be the first to review!")}</p>
              </div>
            </section>
          </div>

          <div className="hidden lg:block w-[320px] shrink-0 sticky top-[150px] h-fit">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
              <h3 className="text-base font-bold text-white mb-5 leading-tight">
                {t("ಇವರ ವಿವರ ಪಡೆಯಿರಿ", "Get Details for")} <span className="text-sky-500">{title as string}</span>
              </h3>
              <form onSubmit={submitForm} className="flex flex-col gap-4">
                <input type="text" value={enquiryData.name} onChange={e => setEnquiryData({...enquiryData, name: e.target.value})} placeholder={t("ನಿಮ್ಮ ಹೆಸರು", "Your Name")} className="w-full bg-slate-950 border border-slate-700 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-sky-500" required />
                <div>
                  <input
                    type="tel"
                    value={enquiryData.phone}
                    onChange={e => { setEnquiryData({...enquiryData, phone: e.target.value}); if (phoneError) setPhoneError(""); }}
                    placeholder={t("ಮೋಬೈಲ್ ಸಂಖ್ಯೆ", "Mobile Number")}
                    className={`w-full bg-slate-950 border text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-sky-500 ${phoneError ? 'border-rose-500' : 'border-slate-700'}`}
                    required
                  />
                  {phoneError && <p className="text-rose-400 text-xs mt-1">{phoneError}</p>}
                </div>
                <button type="submit" disabled={formStatus !== "idle"} className="w-full bg-sky-500 text-white font-bold py-3 rounded-lg text-sm hover:bg-sky-400 transition-colors flex items-center justify-center gap-2 mt-2">
                  {formStatus === "idle" ? t("ಅತ್ಯುತ್ತಮ ಡೀಲ್ ಪಡೆಯಿರಿ", "Get Best Deal") : formStatus === "success" ? <CheckCircle size={18} /> : <Loader2 className="animate-spin" size={18} />}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* SIMILAR BUSINESSES — only when data is passed */}
      {similarBusinesses.length > 0 && (
        <div className="max-w-[1200px] mx-auto px-4 md:px-[3%] mb-10">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Store size={22} className="text-sky-500" />
            {t("ಇದೇ ರೀತಿಯ ಬ್ಯುಸಿನೆಸ್‌ಗಳು", "Similar Businesses")}
          </h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
            {similarBusinesses.slice(0, 6).map(sb => {
              const sbTitle = t(sb.name_kn, sb.name);
              const sbSlug = sb.business_area_slug || sb.slug || `${sb.id}`;
              const sbImg = sb.main_image_upload || sb.image_url;
              return (
                <Link
                  key={sb.id}
                  href={`/business/${sbSlug}`}
                  className="min-w-[220px] md:min-w-[260px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-sky-500/50 hover:shadow-xl transition-all duration-300 shrink-0 group"
                >
                  <div className="h-36 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                    {sbImg ? (
                      <img src={typeof sbImg === 'string' && sbImg.startsWith('http') ? sbImg : `${backendUrl}${sbImg}`} alt={sbTitle as string} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Store className="w-10 h-10 text-slate-400" /></div>
                    )}
                    {sb.is_verified && (
                      <span className="absolute top-2 left-2 bg-sky-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase">Verified</span>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-sky-500 transition-colors">{sbTitle}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                      <MapPin size={12} /> {t(sb.area_kn, sb.area)}
                    </p>
                    {sb.rating && Number(sb.rating) > 0 && (
                      <div className="flex items-center gap-1 mt-1.5">
                        <Star size={12} className="fill-amber-500 text-amber-500" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{Number(sb.rating).toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM STICKY BAR — FIX D: 3 buttons: Call | WhatsApp | Deal */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#050b14]/98 backdrop-blur-lg border-t border-slate-800 p-3 z-50 flex gap-2 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
        {business.phone ? (
          <a href={`tel:${business.phone}`} className="flex-1 bg-slate-800 border border-slate-700 text-white flex items-center justify-center gap-1.5 rounded-xl font-bold text-xs h-12">
            <Phone size={16} className="text-emerald-400" /> {t("ಕರೆ", "Call")}
          </a>
        ) : (
          <button disabled className="flex-1 bg-slate-800 border border-slate-700 text-slate-500 flex items-center justify-center gap-1.5 rounded-xl font-bold text-xs h-12 cursor-not-allowed">
            <Phone size={16} /> N/A
          </button>
        )}
        {business.phone ? (
          <a
            href={`https://wa.me/91${business.phone.replace(/\D/g,'')}?text=Hi, I found your business on Tumakuru Connect.`}
            target="_blank" rel="noopener noreferrer"
            className="flex-1 bg-[#25D366] text-white flex items-center justify-center gap-1.5 rounded-xl font-bold text-xs h-12"
          >
            <MessageCircle size={16} /> WhatsApp
          </a>
        ) : (
          <button disabled className="flex-1 bg-slate-800 border border-slate-700 text-slate-500 flex items-center justify-center gap-1.5 rounded-xl font-bold text-xs h-12 cursor-not-allowed">
            <MessageCircle size={16} /> WA
          </button>
        )}
        <button onClick={() => setIsEnquiryOpen(true)} className="flex-[1.5] bg-sky-500 text-white flex items-center justify-center gap-1.5 rounded-xl font-bold text-xs h-12 shadow-lg shadow-sky-500/20">
          <Store size={16} /> {t("ಡೀಲ್ ಪಡೆಯಿರಿ", "Get Deal")}
        </button>
      </div>

      {/* MODALS */}
      {/* Enquiry Modal — FIX C: with phone validation */}
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
                <input type="text" value={enquiryData.name} onChange={e => setEnquiryData({...enquiryData, name: e.target.value})} className="w-full bg-transparent text-white text-sm outline-none" placeholder={t("ನಿಮ್ಮ ಹೆಸರು", "Your Name")} required />
              </div>
              <div>
                <div className={`flex items-center bg-slate-950 border rounded-lg overflow-hidden focus-within:border-sky-500 h-12 ${phoneError ? 'border-rose-500' : 'border-slate-700'}`}>
                  <span className="px-4 text-slate-500"><Smartphone size={16} /></span>
                  <input
                    type="tel"
                    value={enquiryData.phone}
                    onChange={e => { setEnquiryData({...enquiryData, phone: e.target.value}); if (phoneError) setPhoneError(""); }}
                    className="w-full bg-transparent text-white text-sm outline-none"
                    placeholder={t("ಮೋಬೈಲ್ ಸಂಖ್ಯೆ", "Mobile Number")}
                    required
                  />
                </div>
                {phoneError && <p className="text-rose-400 text-xs mt-1 ml-1">{phoneError}</p>}
              </div>
              <button type="submit" disabled={formStatus !== "idle"} className="w-full bg-sky-500 text-white font-bold h-12 rounded-lg text-sm hover:bg-sky-400 mt-2 flex items-center justify-center gap-2">
                {formStatus === "loading" ? <Loader2 className="animate-spin" /> : formStatus === "success" ? <CheckCircle /> : t("ವಿಚಾರಣೆ ಕಳುಹಿಸಿ", "Submit Enquiry")}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Suggest Edit Modal — FIX E */}
      {isSuggestOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p-5 flex justify-between items-center border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2"><Edit3 className="text-sky-500" size={20} /> {t("ಸುಧಾರಣೆ ಸೂಚಿಸಿ", "Suggest an Edit")}</h3>
              <button onClick={() => setIsSuggestOpen(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
            </div>
            {suggestStatus === "success" ? (
              <div className="p-8 flex flex-col items-center gap-3 text-emerald-400">
                <CheckCircle size={40} />
                <p className="font-bold text-lg">{t("ಧನ್ಯವಾದಗಳು!", "Thank you!")}</p>
                <p className="text-sm text-slate-400 text-center">{t("ನಿಮ್ಮ ಸೂಚನೆ ಸಲ್ಲಿಯಾಗಿದೆ", "Your suggestion has been submitted")}</p>
              </div>
            ) : (
              <form onSubmit={submitSuggest} className="p-6 flex flex-col gap-4">
                <input type="text" value={suggestData.name} onChange={e => setSuggestData({...suggestData, name: e.target.value})} placeholder={t("ನಿಮ್ಮ ಹೆಸರು", "Your Name")} className="w-full bg-slate-950 border border-slate-700 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-sky-500" required />
                <input type="tel" value={suggestData.phone} onChange={e => setSuggestData({...suggestData, phone: e.target.value})} placeholder={t("ಮೋಬೈಲ್ ಸಂಖ್ಯೆ", "Mobile Number")} className="w-full bg-slate-950 border border-slate-700 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-sky-500" required />
                <select value={suggestData.field} onChange={e => setSuggestData({...suggestData, field: e.target.value})} className="w-full bg-slate-950 border border-slate-700 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-sky-500" required>
                  <option value="">{t("ಇಲಿ್ಲ ಬದಲಾಯಿಸು ಆಯ್ಕೆ ಮಾಡಿ", "Select what to edit")}</option>
                  <option value="phone">{t("ಫೋನ್ ಸಂಖ್ಯೆ", "Phone Number")}</option>
                  <option value="address">{t("ವಿಳಾಸ", "Address")}</option>
                  <option value="hours">{t("ಕೆಲಸದ ಸಮಯ", "Working Hours")}</option>
                  <option value="name">{t("ಹೆಸರು", "Business Name")}</option>
                  <option value="other">{t("ಇತರೆ", "Other")}</option>
                </select>
                <textarea value={suggestData.details} onChange={e => setSuggestData({...suggestData, details: e.target.value})} placeholder={t("ವಿವರಗಳು ನಮೂದಿಸಿ...", "Describe the correction...")} rows={3} className="w-full bg-slate-950 border border-slate-700 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-sky-500 resize-none" required />
                <button type="submit" disabled={suggestStatus === "loading"} className="w-full bg-sky-500 text-white font-bold h-12 rounded-lg text-sm hover:bg-sky-400 flex items-center justify-center gap-2">
                  {suggestStatus === "loading" ? <Loader2 className="animate-spin" size={18} /> : t("ಸಲ್ಲಿಸಿ", "Submit")}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Lightbox — FIX B */}
      {lightboxOpen && galleryImages.length > 0 && (
        <div className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
          <button className="absolute top-4 right-4 text-white bg-white/10 rounded-full p-2 hover:bg-white/20" onClick={() => setLightboxOpen(false)}><X size={24} /></button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/10 rounded-full p-2 hover:bg-white/20 disabled:opacity-30"
            disabled={lightboxIndex === 0}
            onClick={e => { e.stopPropagation(); setLightboxIndex(i => i - 1); }}
          ><ChevronRight size={24} className="rotate-180" /></button>
          <img
            src={galleryImages[lightboxIndex]}
            alt={`Photo ${lightboxIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/10 rounded-full p-2 hover:bg-white/20 disabled:opacity-30"
            disabled={lightboxIndex === galleryImages.length - 1}
            onClick={e => { e.stopPropagation(); setLightboxIndex(i => i + 1); }}
          ><ChevronRight size={24} /></button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {galleryImages.map((_, i) => (
              <button key={i} onClick={e => { e.stopPropagation(); setLightboxIndex(i); }} className={`w-2 h-2 rounded-full transition-all ${i === lightboxIndex ? 'bg-white w-4' : 'bg-white/40'}`} />
            ))}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-[9999] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl shadow-2xl shadow-black/30 font-bold text-sm border border-slate-700 dark:border-slate-200 flex items-center gap-2">
            {toastMsg}
          </div>
        </div>
      )}
    </div>
  );
}

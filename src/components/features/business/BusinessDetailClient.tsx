"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Phone, MessageCircle, MapPin, Share2, Edit3, Heart,
  Star, ChevronRight, CheckCircle, Car, Wifi,
  Snowflake, Shield, Zap, X, User, Smartphone, Loader2, Store,
  BadgeCheck, Clock, Leaf, Truck, Activity, Dog, Search,
  Grid, Camera, Upload, Bookmark, ShieldCheck, TrendingUp, Sparkles, PhoneCall
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { BusinessListing } from "@/services/courses";

import NearbyPlaces from "./NearbyPlaces";
import ReviewForm from "./ReviewForm";
import BusinessGallery from "./BusinessGallery";
import { getSupabaseImageUrl } from "@/utils/imageUtils";
import {
  getSupabaseReviewsForBusiness,
  toggleSupabaseReviewReaction,
  toggleSupabaseBookmark,
  getSupabaseUserDashboard,
  submitSupabaseEnquiry,
  submitSupabaseSuggestion
} from "@/services/legacyStubs";
import { ThumbsUp, Laugh } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  "parking": <Car size={24} className="text-red-600 dark:text-sky-400" />,
  "ಪಾರ್ಕಿಂಗ್": <Car size={24} className="text-red-600 dark:text-sky-400" />,
  "wifi": <Wifi size={24} className="text-green-400" />,
  "ವೈಫೈ": <Wifi size={24} className="text-green-400" />,
  "ac": <Snowflake size={24} className="text-blue-300" />,
  "ಎಸಿ": <Snowflake size={24} className="text-blue-300" />,
  "security": <Shield size={24} className="text-amber-500" />,
  "ಭದ್ರತೆ": <Shield size={24} className="text-amber-500" />,
  "power": <Zap size={24} className="text-yellow-400" />,
  "ವಿದ್ಯುತ್": <Zap size={24} className="text-yellow-400" />,
  "24/7": <Clock size={24} className="text-rose-500" />,
  "ತುರ್ತು": <Clock size={24} className="text-rose-500" />,
  "veg": <Leaf size={24} className="text-emerald-500" />,
  "ಸಾಕಾಹಾರ": <Leaf size={24} className="text-emerald-500" />,
  "verified": <BadgeCheck size={24} className="text-red-600 dark:text-sky-500" />,
  "ಪರಿಶೋಧಿತ": <BadgeCheck size={24} className="text-red-600 dark:text-sky-500" />,
  "delivery": <Truck size={24} className="text-orange-500" />,
  "ಡೆಲಿವರಿ": <Truck size={24} className="text-orange-500" />,
  "ambulance": <Activity size={24} className="text-rose-500" />,
  "ಆಂಬ್ಯುಲೆನ್ಸ್": <Activity size={24} className="text-rose-500" />,
  "pets": <Dog size={24} className="text-amber-600" />,
  "ಪ್ರಾಣಿ": <Dog size={24} className="text-amber-600" />,
  "default": <CheckCircle size={24} className="text-emerald-500" />
};

export default function BusinessDetailClient({ business, similarBusinesses = [] }: { business: BusinessListing; similarBusinesses?: BusinessListing[] }) {
  const { lang, t } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [toastMsg, setToastMsg] = useState("");
  const isSharingRef = useRef(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // View All Modal States
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);
  const [serviceSearch, setServiceSearch] = useState("");
  const [activeServiceTab, setActiveServiceTab] = useState("all");

  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success">("idle");
  const [enquiryData, setEnquiryData] = useState({ name: user?.first_name || "", phone: user?.mobile || "", honeypot: "" });
  const [phoneError, setPhoneError] = useState("");
  const [suggestData, setSuggestData] = useState({ name: "", phone: "", field: "", details: "" });
  const [suggestStatus, setSuggestStatus] = useState<"idle" | "loading" | "success">("idle");

  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setToastMsg(t("ಚಿತ್ರವನ್ನು ಪರಿಶೀಲನೆಗೆ ಕಳುಹಿಸಲಾಗಿದೆ!", "Photo submitted for review!"));
      setTimeout(() => setToastMsg(""), 3000);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const fetchReviews = async () => {
    try {
      const data = await getSupabaseReviewsForBusiness(business.slug || String(business.id), user?.id);
      setReviews(data);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, [business.slug, business.id, user?.id]);

  const handleToggleReaction = async (reviewId: number, reactionType: 'HELPFUL' | 'FUNNY' | 'COOL') => {
    if (!isAuthenticated) return router.push("/login");

    const originalReviews = [...reviews];
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        const alreadyReacted = r.user_reacted[reactionType];
        return {
          ...r,
          reaction_counts: { ...r.reaction_counts, [reactionType]: r.reaction_counts[reactionType] + (alreadyReacted ? -1 : 1) },
          user_reacted: { ...r.user_reacted, [reactionType]: !alreadyReacted }
        };
      }
      return r;
    }));

    try { await toggleSupabaseReviewReaction(reviewId, user!.id, reactionType); } 
    catch (err) { console.error("Reaction toggle failed:", err); setReviews(originalReviews); }
  };

  const calculatedRating = useMemo(() => {
    if (reviews.length > 0) {
      const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
      return sum / reviews.length;
    }
    return (business.review_count && business.review_count > 0) ? (Number(business.rating) || 0) : 0;
  }, [reviews, business.rating, business.review_count]);

  const calculatedReviewCount = useMemo(() => {
    return reviews.length > 0 ? reviews.length : (business.review_count || 0);
  }, [reviews, business.review_count]);

  const ratingDistribution = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    reviews.forEach(r => {
      const rate = Math.round(r.rating);
      if (rate >= 1 && rate <= 5) counts[rate - 1]++;
    });
    return counts.reverse().map((count, i) => ({ stars: 5 - i, count, percent: reviews.length > 0 ? (count / reviews.length) * 100 : 0 }));
  }, [reviews]);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;
    getSupabaseUserDashboard().then(data => {
      const bookmarked = data.my_bookmarks.some((b: any) => b.business.id === business.id);
      setIsBookmarked(bookmarked);
    }).catch(err => console.error("Failed to fetch bookmarks:", err));
  }, [isAuthenticated, business.id, user?.id]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowStickyBar(scrollY > 350);
      const sections = ["overview", "services", "quick-info", "location-hours", "photos", "reviews"];
      let foundSection = "overview";
      const headerOffset = 160;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && el.getBoundingClientRect().top <= headerOffset) foundSection = section;
      }
      if ((window.innerHeight + scrollY) >= document.documentElement.scrollHeight - 20) foundSection = "reviews";
      setActiveTab((prev) => (prev !== foundSection ? foundSection : prev));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const activeTabEl = document.getElementById(`tab-${activeTab}`);
    const menuEl = document.getElementById('jd-scroll-menu');
    if (activeTabEl && menuEl) {
      const timeout = setTimeout(() => {
        const scrollLeft = activeTabEl.offsetLeft - (menuEl.clientWidth / 2) + (activeTabEl.clientWidth / 2);
        menuEl.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [activeTab]);

  const highlights = useMemo(() => {
    if (!business) return [];
    const h = [];
    if (business.emergency_24x7) h.push(t("24/7 ತುರ್ತು", "24/7 Emergency"));
    if (business.pure_veg) h.push(t("ಶುದ್ಧ ಸಾಕಾಹಾರ", "Pure Vegetarian"));
    if (business.is_verified) h.push(t("ಪರಿಶೋಧಿತ", "Verified"));
    if (business.home_delivery) h.push(t("ಹೋಮ್ ಡೆಲಿವರಿ", "Home Delivery"));
    if (business.ambulance_available) h.push(t("ಆಂಬ್ಯುಲೆನ್ಸ್", "Ambulance"));
    if (business.pets_allowed) h.push(t("ಸಾಕು ಪ್ರಾಣಿ ಅನುಮತಿ", "Pets Allowed"));
    if (h.length === 0 && business.amenities) {
      business.amenities.split(',').slice(0, 4).forEach((item: string) => {
        const trimmed = item.trim();
        if (trimmed) h.push(trimmed);
      });
    }
    return h;
  }, [business, t]);

  const realServices = useMemo(() => {
    if (!business || !business.services_offered) return [];
    return business.services_offered.split(',').map((s: string) => s.trim()).filter(Boolean);
  }, [business]);

  const realAmenities = useMemo(() => {
    if (!business || !business.amenities) return [];
    return business.amenities.split(',').map((a: string) => a.trim()).filter(Boolean);
  }, [business]);

  const realProducts = useMemo(() => {
    if (!business || !business.products_available) return [];
    return business.products_available.split(',').map((p: string) => p.trim()).filter(Boolean);
  }, [business]);

  const dynamicCategories = useMemo(() => {
    const allItems = [...realAmenities, ...realServices, ...realProducts];
    const groups: Record<string, string[]> = {
      "Facilities": [], "Timing": [], "Complimentary": [], "Transfers": [],
      "Amenities": [], "Services": [], "Products": []
    };

    allItems.forEach(item => {
      const lower = item.toLowerCase();
      if (lower.includes('check in') || lower.includes('check out') || lower.includes('timing') || lower.includes('hours') || lower.match(/\d+\s*(am|pm)/)) groups["Timing"].push(item);
      else if (lower.includes('parking') || lower.includes('seating') || lower.includes('washroom') || lower.includes('lift') || lower.includes('elevator') || lower.includes('pool') || lower.includes('lounge')) groups["Facilities"].push(item);
      else if (lower.includes('complimentary') || lower.includes('free') || lower.includes('breakfast')) groups["Complimentary"].push(item);
      else if (lower.includes('transfer') || lower.includes('shuttle') || lower.includes('pickup') || lower.includes('drop') || lower.includes('cab')) groups["Transfers"].push(item);
      else if (realProducts.includes(item)) groups["Products"].push(item);
      else if (realServices.includes(item)) groups["Services"].push(item);
      else groups["Amenities"].push(item);
    });

    return Object.entries(groups).filter(([_, items]) => items.length > 0).map(([name, items]) => ({ name, items }));
  }, [realAmenities, realServices, realProducts]);

  const showToast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(""), 3000); };

  const handleShare = async () => {
    if (!business || isSharingRef.current) return;
    const shareData = {
      title: t(business.name_kn, business.name),
      text: `${t(business.name_kn, business.name)} - ${category} in Tumkur. Check it out on Tumkurconnect!`,
      url: window.location.href
    };
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        isSharingRef.current = true;
        await navigator.share(shareData);
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareData.url);
        showToast(t("✅ ಲಿಂಕ್ ಕಾಪಿ ಮಾಡಲಾಗಿದೆ!", "✅ Link copied to clipboard!"));
      } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareData.text + " " + shareData.url)}`, '_blank');
      }
    } catch (err: any) {
      if (err.name !== 'AbortError' && err.name !== 'NotAllowedError') {
        try { await navigator.clipboard.writeText(shareData.url); showToast(t("✅ ಲಿಂಕ್ ಕಾಪಿ ಮಾಡಲಾಗಿದೆ!", "✅ Link copied to clipboard!")); } 
        catch (clipErr) { console.error("Fallback clipboard failed:", clipErr); }
      }
    } finally { setTimeout(() => { isSharingRef.current = false; }, 800); }
  };

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated || !user?.id) return router.push("/login");
    setIsBookmarked(!isBookmarked);
    try { await toggleSupabaseBookmark(business.id); }
    catch (error) { setIsBookmarked(isBookmarked); alert(t("ಸಂಪರ್ಕ ದೋಷ, ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ", "Network error, please try again.")); }
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enquiryData.honeypot) return;
    const digits = enquiryData.phone.replace(/\D/g, '');
    if (digits.length !== 10) { setPhoneError(t("10 ಅಂಕೆಗಳ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ", "Enter a valid 10-digit number")); return; }
    setPhoneError(""); setFormStatus("loading");
    try {
      const res = await submitSupabaseEnquiry(business.id, { customer_name: enquiryData.name, phone_number: enquiryData.phone });
      setFormStatus("success");
      setTimeout(() => {
        setFormStatus("idle"); setIsEnquiryOpen(false);
        if (res.data?.owner_phone) {
          const waPhone = res.data.owner_phone.replace(/\D/g, '');
          const waText = encodeURIComponent(
            lang === 'kn' ? `ನಮಸ್ಕಾರ ${title}, ನಾನು Tumkurconnect ಮೂಲಕ ಎನ್ಕ್ವೈರಿ ಮಾಡುತ್ತಿದ್ದೇನೆ. ನನ್ನ ಹೆಸರು ${enquiryData.name} (${enquiryData.phone}). ದಯವಿಟ್ಟು ಸಂಪರ್ಕಿಸಿ.`
              : `Hello ${title}, I am sending an enquiry from Tumkurconnect. My name is ${enquiryData.name} (${enquiryData.phone}). Please contact me.`
          );
          window.open(`https://wa.me/91${waPhone}?text=${waText}`, '_blank');
        } else {
          alert(t("ನಿಮ್ಮ ವಿಚಾರಣೆ ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಕೆಯಾಗಿದೆ!", "Your enquiry was submitted successfully!"));
        }
      }, 1000);
    } catch (error) {
      console.error("Enquiry failed:", error); setFormStatus("idle"); alert(t("ವಿಫಲವಾಗಿದೆ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.", "Failed to submit enquiry. Please try again."));
    }
  };

  const submitSuggest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return router.push("/login");
    setSuggestStatus("loading");
    try {
      const suggestionPayload = `[Field: ${suggestData.field}] ${suggestData.details} | Phone: ${suggestData.phone}`;
      await submitSupabaseSuggestion(business.id, user.id, suggestionPayload);
      setSuggestStatus("success");
      setTimeout(() => { setSuggestStatus("idle"); setIsSuggestOpen(false); }, 2000);
    } catch (error) {
      console.error("Suggestion failed:", error); setSuggestStatus("idle"); alert(t("ವಿಫಲವಾಗಿದೆ.", "Failed."));
    }
  };

  const title = t(business.name_kn, business.name);
  const location = t(business.area_kn, business.area);
  const category = t(business.category_name_kn, business.category_name);

  const resolveUrl = (url: unknown, context: 'hero' | 'gallery' = 'gallery'): string | null => {
    return getSupabaseImageUrl(url as string, { context });
  };

  let mainImage = resolveUrl(business.main_image_upload, 'hero') || resolveUrl(business.image_url, 'hero');
  const galleryImages: string[] = [];
  if (mainImage) galleryImages.push(mainImage);
  if (business.gallery_images && Array.isArray(business.gallery_images)) {
    business.gallery_images.forEach(item => {
      const resolved = resolveUrl(typeof item === 'string' ? item : (item as any)?.image, 'gallery');
      if (resolved && !galleryImages.includes(resolved)) galleryImages.push(resolved);
    });
  }
  [business.image_url_2, business.image_url_3].forEach(extra => {
    const resolved = resolveUrl(extra, 'gallery');
    if (resolved && !galleryImages.includes(resolved)) galleryImages.push(resolved);
  });

  const dynamicTabs = useMemo(() => [
    { id: "overview", labelKn: "ಸ್ಥೂಲನೋಟ", labelEn: "Overview", show: true },
    { id: "services", labelKn: "ಸೇವೆಗಳು", labelEn: "Services", show: realServices.length > 0 || realAmenities.length > 0 || realProducts.length > 0 },
    { id: "quick-info", labelKn: "ಮಾಹಿತಿ", labelEn: "Quick Info", show: true },
    { id: "location-hours", labelKn: "ವಿಳಾಸ & ಸಮಯ", labelEn: "Location & Hours", show: true },
    { id: "photos", labelKn: "ಫೋಟೋಗಳು", labelEn: "Photos", show: galleryImages.length > 0 },
    { id: "reviews", labelKn: "ವಿಮರ್ಶೆಗಳು", labelEn: "Reviews", show: true }
  ].filter(t => t.show), [realProducts, realServices, realAmenities, galleryImages]);

  return (
    <div className="w-full bg-white dark:bg-[#0a1120] min-h-screen pb-24 md:pb-10 font-poppins relative">
      {/* Hidden File Input for Add Photos */}
      <input type="file" id="photo-upload" accept="image/*" multiple ref={fileInputRef} onChange={handleImageUpload} className="hidden" />

      <div className="max-w-[1200px] mx-auto px-4 md:px-[3%] pt-1 md:pt-1">

        {/* Breadcrumbs */}
        <div className="flex items-center gap-1 text-[11px] md:text-[13px] text-red-600 dark:text-slate-400 mb-3 font-semibold whitespace-nowrap overflow-x-auto scrollbar-hide">
          <Link href="/" className="hover:text-red-700 dark:hover:text-sky-500 transition-colors">{t("ತುಮಕೂರು", "Tumkur")}</Link> <ChevronRight size={14} className="text-red-600 dark:text-slate-500 shrink-0" />
          <Link href={`/${business.category_name.toLowerCase().replace(/\s+/g, '-')}-in-tumkur`} className="hover:text-red-700 dark:hover:text-sky-500 transition-colors">{category}</Link> <ChevronRight size={14} className="text-red-600 dark:text-slate-500 shrink-0" />
          <span className="font-bold text-red-700 dark:text-white truncate">{title as string}</span>
        </div>

        <div className="mb-4 md:mb-6">
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center justify-between gap-3 w-full">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
                <span className="flex items-center gap-1.5 md:gap-3">{title as string}</span>
              </h1>

              <div className="flex items-center gap-2 shrink-0">
                <button onClick={handleShare} aria-label={t("ಹಂಚಿ", "Share")} className="flex items-center gap-1.5 px-2.5 md:px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm group">
                  <Share2 size={16} className="text-red-600 dark:text-sky-500 group-hover:scale-110 transition-transform" />
                  <span className="hidden md:inline text-[13px] font-bold">{t("ಹಂಚಿ", "Share")}</span>
                </button>
                <button onClick={() => setIsSuggestOpen(true)} aria-label={t("ತಿದ್ದುಪಡಿ", "Suggest Edit")} className="flex items-center gap-1.5 px-2.5 md:px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm group">
                  <Edit3 size={16} className="text-slate-500 group-hover:text-red-600 dark:group-hover:text-sky-500 transition-colors" />
                  <span className="hidden md:inline text-[13px] font-bold">{t("ತಿದ್ದುಪಡಿ", "Suggest Edit")}</span>
                </button>
              </div>
            </div>
            {business.established_year && <span className="inline-block mt-1 text-[11px] md:text-sm text-amber-700 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-2 py-0.5 md:py-1 rounded-md shadow-sm"><Shield size={12} className="inline md:hidden mr-1 -mt-0.5" /><Shield size={18} className="hidden md:inline mr-1.5 -mt-0.5" />{new Date().getFullYear() - business.established_year}+ Years of Trust</span>}
          </div>
        </div>

        {/* ✅ EXTRACTED GALLERY COMPONENT (Handles Desktop, Mobile & Lightbox) */}
        <BusinessGallery 
          galleryImages={galleryImages} 
          title={title as string} 
          business={business} 
          calculatedRating={calculatedRating} 
          calculatedReviewCount={calculatedReviewCount} 
          t={t} 
        />

        {/* Desktop Header */}
        <div className="hidden md:flex md:flex-row md:justify-between md:items-end gap-5 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mt-3">
              {calculatedRating > 0 ? (
                <><div className="flex gap-0.5">{[1, 2, 3, 4, 5].map((star) => (<Star key={star} size={22} className={star <= Math.round(calculatedRating) ? "fill-amber-500 text-amber-500 drop-shadow-sm" : "fill-slate-200 text-slate-200 dark:fill-slate-800 dark:text-slate-800"} />))}</div>
                  <span className="text-lg font-extrabold text-slate-800 dark:text-slate-200">{calculatedRating.toFixed(1)}</span>
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">({calculatedReviewCount} {t("ವಿಮರ್ಶೆಗಳು", "reviews")})</span></>
              ) : <span className="text-sm text-slate-500 dark:text-slate-400 italic">{t("ಇನ್ನೂ ವಿಮರ್ಶೆಗಳಿಲ್ಲ", "No ratings yet")}</span>}
            </div>
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-4 text-sm">
              {business.is_open !== null && business.is_open !== undefined && <span className={`font-bold px-2.5 py-1 rounded-md border ${business.is_open ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20' : 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20'}`}>{business.is_open ? t("ಈಗ ತೆರೆದಿದೆ", "Open Now") : t("ಮುಚ್ಚಲಾಗಿದೆ", "Closed")}</span>}
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
              <span className="text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px] md:text-xs">{category}</span>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
              <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5 font-medium"><MapPin size={16} className="text-red-600 dark:text-sky-500" /> {business.address || `${location}, Tumkur`}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            <Link
              href={`/radius-search?lat=${business.lat}&lng=${business.lng}&name=${encodeURIComponent(title as string)}`}
              aria-label={`View ${title} on nearby map`}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 dark:bg-sky-600 dark:hover:bg-sky-700 text-white border border-transparent rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-95 group"
            >
              <MapPin size={18} className="animate-pulse" /> <span className="hidden md:inline">{t("ಹತ್ತಿರದ ನೋಡಿ", "Nearby Map")}</span>
            </Link>
            <button onClick={handleBookmarkToggle} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-colors border shadow-sm ${isBookmarked ? 'bg-rose-50 text-rose-500 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/30 hover:bg-rose-100 dark:hover:bg-rose-500/20' : 'bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-rose-500'}`}><Heart size={18} fill={isBookmarked ? "currentColor" : "none"} className={isBookmarked ? "text-rose-500" : ""} /> <span className="hidden md:inline">{isBookmarked ? t("ಉಳಿಸಲಾಗಿದೆ", "Saved") : t("ಉಳಿಸಿ", "Save")}</span></button>
          </div>
        </div>

        {/* One-Line Unified Action Buttons (Mobile) */}
        <div className="md:hidden flex items-center gap-2 mb-6 w-full">
          <button onClick={() => { document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' }); }} className="flex-1 flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 py-2.5 px-1 rounded-xl font-bold transition-all border border-slate-200 dark:border-slate-700 shadow-sm active:scale-95">
            <Star size={15} className="shrink-0" />
            <span className="text-[11px] sm:text-[12px] whitespace-nowrap overflow-hidden text-ellipsis">{t("ವಿಮರ್ಶೆ ಬರೆಯಿರಿ", "Add Review")}</span>
          </button>
          <button onClick={(e) => { e.stopPropagation(); document.getElementById('photo-upload')?.click(); }} className="flex-1 flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 py-2.5 px-1 rounded-xl font-bold transition-all border border-slate-200 dark:border-slate-700 shadow-sm active:scale-95">
            <Camera size={15} className="shrink-0" />
            <span className="text-[11px] sm:text-[12px] whitespace-nowrap overflow-hidden text-ellipsis">{t("ಫೋಟೋ ಸೇರಿಸಿ", "Add photos")}</span>
          </button>
          <button onClick={handleBookmarkToggle} className="flex-1 flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 py-2.5 px-1 rounded-xl font-bold transition-all border border-slate-200 dark:border-slate-700 shadow-sm active:scale-95">
            <Bookmark size={15} fill={isBookmarked ? "currentColor" : "none"} className={`shrink-0 ${isBookmarked ? "text-red-500" : ""}`} />
            <span className="text-[11px] sm:text-[12px] whitespace-nowrap overflow-hidden text-ellipsis">{isBookmarked ? t("ಉಳಿಸಲಾಗಿದೆ", "Saved") : t("ಉಳಿಸಿ", "Save")}</span>
          </button>
        </div>

        {/* Mobile Info details */}
        <div className="md:hidden mb-6 pb-6 border-b border-gray-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[11px] bg-slate-100 dark:bg-slate-800/50 px-2.5 py-1 rounded-md">{category}</span>
          </div>
          <p className="text-[13px] text-slate-700 dark:text-slate-300 flex items-start gap-2 leading-relaxed mb-4 font-medium"><MapPin size={16} className="text-red-600 dark:text-sky-500 shrink-0 mt-0.5" /> {business.address || `${location}, Tumkur`}</p>
          <div className="flex gap-2">
            {business.phone ? <a href={`tel:${business.phone}`} aria-label={`${t("ಕರೆ ಮಾಡಿ", "Call")} ${business.phone}`} className="flex-[1.5] flex items-center justify-center gap-1.5 bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm shadow-sm"><Phone size={16} /> {t("ಕರೆ", "Call")}</a> : <button disabled aria-label="No phone available" className="flex-[1.5] flex items-center justify-center gap-1.5 bg-slate-200 dark:bg-slate-800 text-slate-400 py-3 rounded-xl font-bold text-sm"><Phone size={16} /></button>}
            <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(business.address || `${location}, Tumkur`)}`} target="_blank" rel="noopener noreferrer" aria-label={`Get directions to ${title}`} className="flex-1 flex items-center justify-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white py-3 rounded-xl font-bold text-sm shadow-sm"><MapPin size={16} className="text-red-600 dark:text-sky-500" /> {t("ದಾರಿ", "Directions")}</a>
          </div>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex flex-wrap md:flex-nowrap gap-3 mb-10 w-full pb-8 border-b border-gray-200 dark:border-slate-800">
          {business.phone ? <a href={`tel:${business.phone}`} className="flex-1 md:flex-none bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200 dark:bg-slate-800 dark:border-slate-700 dark:text-white flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-colors shadow-sm group"><Phone size={18} className="group-hover:animate-pulse" /> <span>{t("ಈಗ ಕರೆ ಮಾಡಿ", "Call Now")} - {business.phone}</span></a> : <button disabled className="flex-1 md:flex-none bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-slate-500 flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm cursor-not-allowed border border-gray-200 dark:border-slate-700"><Phone size={18} /> <span>{t("ಸಂಪರ್ಕ ಲಭ್ಯವಿಲ್ಲ", "No Contact")}</span></button>}
          {business.phone && <a href={`https://wa.me/91${business.phone.replace(/\D/g, '')}?text=${encodeURIComponent(lang === 'kn' ? `ನಮಸ್ಕಾರ ${title}, ನಾನು ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಅನ್ನು Tumkurconnect ನಲ್ಲಿ ನೋಡಿದೆ. ನಿಮ್ಮ ಸೇವೆಗಳ ಬಗ್ಗೆ ತಿಳಿಯಲು ಬಯಸುತ್ತೇನೆ.` : `Hello ${title}, I found your profile on Tumkurconnect. I am interested in your services. Can we talk?`)}`} target="_blank" rel="noopener noreferrer" className="flex-1 md:flex-none bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400 flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-colors shadow-sm group"><MessageCircle size={18} className="group-hover:scale-110 transition-transform" /> <span>WhatsApp</span></a>}
          <button onClick={() => setIsEnquiryOpen(true)} className="w-full md:w-auto md:ml-auto bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md animate-[pulse_2s_ease-in-out_infinite] hover:animate-none"><Store size={18} /> {t("ಅತ್ಯುತ್ತಮ ಡೀಲ್ ಪಡೆಯಿರಿ", "Get Best Deal")}</button>
        </div>

        {/* STICKY MENU BAR */}
        <div className="sticky top-[56px] md:top-[56px] bg-white dark:bg-slate-900 z-[90] border-b border-gray-200 dark:border-slate-800 shadow-sm mb-4 md:mb-8 -mx-4 px-4 md:mx-[-3.2%] md:px-[3.2%]">
          <ul id="jd-scroll-menu" className="flex overflow-x-auto whitespace-nowrap scrollbar-hide relative pt-2">
            {dynamicTabs.map((tab) => (
              <li key={tab.id} id={`tab-${tab.id}`} className="inline-block flex-shrink-0 relative">
                <button onClick={() => { const el = document.getElementById(tab.id); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 140, behavior: "smooth" }); }} className={`relative px-4 pb-3.5 pt-1 text-[14.5px] font-bold transition-all duration-300 ${activeTab === tab.id ? 'text-red-600 dark:text-sky-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>{t(tab.labelKn, tab.labelEn)}</button>
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-red-600 dark:bg-sky-400 rounded-t-md shadow-[0_-2px_4px_rgba(220,38,38,0.15)] dark:shadow-[0_-2px_4px_rgba(14,165,233,0.15)]"></div>}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 min-w-0">

            {/* 1. OVERVIEW */}
            <section id="overview" className="mb-10 pb-8 border-b border-gray-200 dark:border-slate-800 scroll-mt-[150px]">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5">{t("ಹೈಲೈಟ್ಸ್", "Highlights from the Business")}</h2>
              {highlights.length > 0 ? (
                <div className="grid grid-cols-4 gap-3 md:flex md:flex-wrap md:gap-8">
                  {highlights.slice(0, 4).map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 text-center">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-red-50 dark:bg-sky-500/10 border border-red-100 dark:border-sky-500/20 flex items-center justify-center shadow-sm">{iconMap[Object.keys(iconMap).find(k => item.toLowerCase().includes(k)) || "default"]}</div>
                      <span className="text-[10px] md:text-[11px] text-slate-600 dark:text-slate-400 font-semibold leading-tight line-clamp-2">{item}</span>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-slate-500 dark:text-slate-400 italic">{t("ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ", "No highlights available")}</p>}
            </section>

            {/* 2. SERVICES & AMENITIES */}
            <section id="services" className="mb-10 pb-8 border-b border-gray-200 dark:border-slate-800 scroll-mt-[150px]">
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mb-6">{t("ಸೇವೆಗಳು ಮತ್ತು ಸೌಲಭ್ಯಗಳು", "Services & Amenities")}</h2>
              {realAmenities.length > 0 || realServices.length > 0 || realProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6 mb-6">
                    {[...realAmenities, ...realServices, ...realProducts].slice(0, 8).map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <CheckCircle size={18} className="text-slate-800 dark:text-slate-200 shrink-0 mt-0.5" />
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-tight">{item}</span>
                      </div>
                    ))}
                  </div>
                  {([...realAmenities, ...realServices, ...realProducts].length > 8) && (
                    <div className="flex justify-center mt-6">
                      <button onClick={() => setIsViewAllOpen(true)} className="border border-red-600 text-red-600 hover:bg-red-50 dark:border-sky-500 dark:text-sky-500 dark:hover:bg-sky-500/10 font-bold px-8 py-2 rounded-lg text-sm transition-colors">{t("ಎಲ್ಲವನ್ನು ನೋಡಿ", "View all")}</button>
                    </div>
                  )}
                </>
              ) : <p className="text-sm text-slate-500 dark:text-slate-400 italic">{t("ಮಾಹಿತಿ ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿದೆ", "Information coming soon")}</p>}
            </section>

            {/* 3. QUICK INFO */}
            <section id="quick-info" className="mb-10 pb-8 border-b border-gray-200 dark:border-slate-800 scroll-mt-[150px]">
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mb-6">{t("ಮಾಹಿತಿ", "Quick Info")}</h2>
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-400 mt-2 mb-3 uppercase tracking-wider">{t("ವಿವರಣೆ", "Business summary")}</h3>
              <p className="text-[13px] md:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{t(business.description_kn, business.description) || t("ವಿವರಗಳು ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿವೆ.", "Detailed information will be updated soon.")}</p>
            </section>

            {/* 4. LOCATION & HOURS */}
            <section id="location-hours" className="mb-10 pb-8 border-b border-gray-200 dark:border-slate-800 scroll-mt-[150px]">
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mb-6">{t("ವಿಳಾಸ ಮತ್ತು ಸಮಯ", "Location & Hours")}</h2>
              <div className="flex flex-col md:flex-row gap-8 md:gap-10">
                <div className="flex-[1.5]">
                  <div className="w-full h-56 bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden mb-5 border border-slate-200 dark:border-slate-700 shadow-md">
                    <iframe
                      title={`Map location of ${title}`}
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      loading="lazy"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(business.address || `${location}, Tumkur`)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    />
                  </div>
                  <div className="flex items-start gap-4 mb-6">
                    <MapPin className="text-red-600 dark:text-sky-500 shrink-0 mt-1" size={22} />
                    <div>
                      <p className="text-slate-900 dark:text-white font-extrabold text-lg mb-1">{t(business.name_kn, business.name)}</p>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-2 font-medium">{business.address || `${location}, Tumkur, Karnataka, India`}</p>
                      <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(business.address || `${location}, Tumkur`)}`} target="_blank" rel="noopener noreferrer" className="text-red-600 dark:text-sky-500 font-bold text-sm hover:underline flex items-center gap-1">{t("ದಾರಿ ಹುಡುಕಿ", "Get Directions")} <ChevronRight size={14} /></a>
                    </div>
                  </div>
                </div>
                <div className="flex-1 shrink-0">
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md">
                    <h3 className="font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Clock size={18} className="text-red-600 dark:text-sky-500" /> {t("ಕೆಲಸದ ಸಮಯ", "Working Hours")}</h3>
                    {business.working_hours ? (
                      <div className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-sky-500/10 flex items-center justify-center shrink-0"><Clock size={18} className="text-red-600 dark:text-sky-500" /></div>
                        <div><p className="text-base font-bold text-slate-900 dark:text-white">{business.working_hours}</p><p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t("ಪ್ರತಿದಿನ", "Everyday")}</p></div>
                      </div>
                    ) : <p className="text-sm text-slate-500 dark:text-slate-400 italic flex items-center gap-2"><Clock size={14} /> {t("ಸಮಯದ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ", "Hours not available")}</p>}
                  </div>
                </div>
              </div>

              {business.lat && business.lng && (
                <NearbyPlaces lat={business.lat} lng={business.lng} businessName={business.name} />
              )}
            </section>

            {/* ✅ 6. REVIEWS (YELP STYLE) */}
            <section id="reviews" className="mb-10 pb-8 scroll-mt-[150px]">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-8">{t("ವಿಮರ್ಶೆಗಳು", "Reviews")}</h2>
              <div className="flex flex-col md:flex-row gap-8 mb-10 items-start">
                <div className="flex flex-col gap-3 w-full md:w-1/3">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Overall rating</h3>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <div key={s} className={`w-10 h-10 rounded-md flex items-center justify-center shadow-sm ${s <= Math.round(calculatedRating) ? 'bg-[#f15c4f]' : 'bg-slate-200 dark:bg-slate-800'}`}>
                        <Star size={22} fill={s <= Math.round(calculatedRating) ? "white" : "none"} className={s <= Math.round(calculatedRating) ? "text-white" : "text-slate-400 dark:text-slate-600"} />
                      </div>
                    ))}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{calculatedReviewCount} {t("ವಿಮರ್ಶೆಗಳು", "reviews")}</p>
                </div>
                <div className="flex flex-col gap-2.5 w-full md:w-2/3">
                  {ratingDistribution.map((bar) => (
                    <div key={bar.stars} className="flex items-center gap-4 text-sm group">
                      <span className="w-14 text-slate-700 dark:text-slate-300 font-bold whitespace-nowrap group-hover:text-red-600 transition-colors">{bar.stars} stars</span>
                      <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-[#f15c4f] rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(241,92,79,0.4)]" style={{ width: `${bar.percent}%` }}></div>
                      </div>
                      <span className="w-10 text-right text-[11px] font-bold text-slate-600 dark:text-slate-400">{Math.round(bar.percent)}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col lg:flex-row justify-between items-center gap-4 border-t border-b border-slate-200 dark:border-slate-800 py-4 mb-8">
                <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                  <label htmlFor="review-sort" className="sr-only">Sort reviews</label>
                  <select id="review-sort" aria-label="Sort reviews" className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-full text-sm text-slate-700 dark:text-slate-300 outline-none focus:border-red-600 dark:focus:border-sky-500 cursor-pointer shadow-sm"><option>Yelp Sort</option><option>Newest First</option></select>
                  <label htmlFor="review-lang" className="sr-only">Filter by language</label>
                  <select id="review-lang" aria-label="Filter by language" className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-full text-sm text-slate-700 dark:text-slate-300 outline-none focus:border-red-600 dark:focus:border-sky-500 cursor-pointer shadow-sm"><option>English (172)</option><option>Kannada (8)</option></select>
                  <label htmlFor="review-rating" className="sr-only">Filter by rating</label>
                  <select id="review-rating" aria-label="Filter by rating" className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-full text-sm text-slate-700 dark:text-slate-300 outline-none focus:border-red-600 dark:focus:border-sky-500 cursor-pointer shadow-sm"><option>Filter by rating</option><option>5 Stars</option></select>
                </div>
                <div className="w-full lg:w-[320px] flex items-center bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md overflow-hidden shadow-sm focus-within:border-red-600 dark:focus-within:border-sky-500 transition-all">
                  <input type="text" id="review-search" name="review_search" autoComplete="off" placeholder="Search reviews" aria-label="Search reviews" className="w-full px-4 py-2 outline-none bg-transparent text-sm text-slate-800 dark:text-white" />
                  <button aria-label="Search reviews" className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border-l border-slate-300 dark:border-slate-700 hover:bg-slate-100 transition-colors"><Search size={18} className="text-slate-500" /></button>
                </div>
              </div>
              
              {/* ✅ EXTRACTED REVIEW FORM COMPONENT */}
              {isAuthenticated ? (
                <div className="mb-10 p-5 bg-white dark:bg-slate-900/50 rounded-2xl border border-gray-200 dark:border-slate-800">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-sm">{t("ವಿಮರ್ಶೆ ಬರೆಯಿರಿ", "Write a Review")}</h3>
                  <ReviewForm businessId={business.id} onSuccess={fetchReviews} t={t} />
                </div>
              ) : <div className="mb-10 flex items-center justify-between p-4 bg-white dark:bg-slate-900/50 rounded-xl border border-gray-200 dark:border-slate-800"><span className="text-sm text-slate-600 dark:text-slate-400">{t("ವಿಮರ್ಶೆ ಬರೆಯಲು ಲಾಗಿನ್ ಮಾಡಿ", "Login to write a review")}</span><button onClick={() => router.push('/login')} className="text-sm font-bold text-red-600 hover:text-red-700 dark:text-sky-500 dark:hover:text-sky-600">Login</button></div>}
              
              <div className="flex flex-col gap-2">
                {reviewsLoading ? (
                  <div className="flex flex-col gap-6 w-full mt-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex flex-col md:flex-row gap-4 md:gap-6 py-6 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex gap-4 md:w-[220px] shrink-0"><div className="w-14 h-14 rounded-full bg-slate-200/60 dark:bg-slate-800/60 animate-pulse shrink-0"></div><div className="flex flex-col justify-center space-y-2.5 flex-1"><div className="w-24 h-3.5 bg-slate-200/60 dark:bg-slate-800/60 animate-pulse rounded"></div><div className="w-16 h-2.5 bg-slate-200/60 dark:bg-slate-800/60 animate-pulse rounded"></div></div></div>
                        <div className="flex-1 space-y-3"><div className="w-32 h-4 bg-slate-200/60 dark:bg-slate-800/60 animate-pulse rounded mb-5"></div><div className="w-full h-3 bg-slate-200/60 dark:bg-slate-800/60 animate-pulse rounded"></div><div className="w-[90%] h-3 bg-slate-200/60 dark:bg-slate-800/60 animate-pulse rounded"></div><div className="w-[60%] h-3 bg-slate-200/60 dark:bg-slate-800/60 animate-pulse rounded"></div></div>
                      </div>
                    ))}
                  </div>
                ) : reviews.length > 0 ? reviews.map((review) => (
                  <div key={review.id} id={`review-${review.id}`} className="flex flex-col md:flex-row gap-4 md:gap-6 py-8 border-b border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-500 scroll-mt-[180px]">
                    <div className="flex gap-4 md:w-[220px] shrink-0">
                      <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-sky-900/50 flex items-center justify-center text-red-600 dark:text-sky-400 font-extrabold text-xl shadow-sm shrink-0 border border-red-200 dark:border-sky-500/20 overflow-hidden">
                        {review.user?.profile_image ? (
                          <img src={getSupabaseImageUrl(review.user.profile_image) || ''} className="w-full h-full object-cover" alt="Profile" />
                        ) : (
                          (review.user?.first_name?.[0] || review.user?.username?.[0] || 'U').toUpperCase()
                        )}
                      </div>
                      <div className="flex flex-col">
                        <h4 className="font-bold text-slate-900 dark:text-white flex items-center flex-wrap">
                          <Link href={`/user/${review.user?.id}`} className="hover:text-red-600 dark:hover:text-sky-400 transition-colors">
                            {review.user?.first_name ? `${review.user.first_name} ${review.user.last_name || ''}` : review.user?.username || 'Anonymous'}
                          </Link>
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 uppercase tracking-tighter">Contributor</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <div key={s} className={`w-6 h-6 rounded border border-transparent ${s <= review.rating ? 'bg-[#f15c4f]' : 'bg-slate-200 dark:bg-slate-800'} flex items-center justify-center`}>
                              <Star size={14} fill={s <= review.rating ? "white" : "none"} className={s <= review.rating ? "text-white" : "text-slate-400 dark:text-slate-600"} />
                            </div>
                          ))}
                        </div>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          {isMounted ? new Date(review.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '...'}
                        </span>
                      </div>
                      <p className="text-slate-800 dark:text-slate-300 text-[15px] leading-relaxed font-medium">
                        {review.comment}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 mt-6">
                        <button onClick={() => handleToggleReaction(review.id, 'HELPFUL')} className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-extrabold transition-all duration-300 ${review.user_reacted.HELPFUL ? 'bg-red-50 text-red-600 border-red-200 shadow-sm scale-105' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 active:scale-95'}`}>
                          <ThumbsUp size={14} className={review.user_reacted.HELPFUL ? 'fill-current animate-bounce' : ''} /> {t("ಉಪಯುಕ್ತ", "Helpful")} {review.reaction_counts.HELPFUL > 0 && <span className="ml-0.5 bg-red-100 dark:bg-red-900/30 px-1.5 py-0.5 rounded-full">{review.reaction_counts.HELPFUL}</span>}
                        </button>
                        <button onClick={() => handleToggleReaction(review.id, 'FUNNY')} className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-extrabold transition-all duration-300 ${review.user_reacted.FUNNY ? 'bg-amber-50 text-amber-600 border-amber-200 shadow-sm scale-105' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 active:scale-95'}`}>
                          <Laugh size={14} className={review.user_reacted.FUNNY ? 'fill-current animate-bounce' : ''} /> {t("ತಮಾಷೆ", "Funny")} {review.reaction_counts.FUNNY > 0 && <span className="ml-0.5 bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded-full">{review.reaction_counts.FUNNY}</span>}
                        </button>
                        <button onClick={() => handleToggleReaction(review.id, 'COOL')} className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-extrabold transition-all duration-300 ${review.user_reacted.COOL ? 'bg-sky-50 text-sky-600 border-sky-200 shadow-sm scale-105' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 active:scale-95'}`}>
                          <Zap size={14} className={review.user_reacted.COOL ? 'fill-current animate-bounce' : ''} /> {t("ಕೂಲ್", "Cool")} {review.reaction_counts.COOL > 0 && <span className="ml-0.5 bg-sky-100 dark:bg-sky-900/30 px-1.5 py-0.5 rounded-full">{review.reaction_counts.COOL}</span>}
                        </button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="py-20 text-center bg-slate-50 dark:bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <Star size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4 opacity-50" />
                    <p className="text-slate-500 dark:text-slate-400 font-bold">{t("ಯಾವುದೇ ವಿಮರ್ಶೆಗಳಿಲ್ಲ. ಮೊದಲನೆಯವರಾಗಿರಿ!", "No reviews yet. Be the first to write one!")}</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="hidden lg:block w-[320px] shrink-0 sticky top-[150px] h-fit">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
              <h3 className="text-base font-bold text-white mb-5 leading-tight">{t("ಇವರ ವಿವರ ಪಡೆಯಿರಿ", "Get Details for")} <span className="text-red-600 dark:text-sky-500">{title as string}</span></h3>
              <form onSubmit={submitForm} className="flex flex-col gap-4">
                <input type="text" name="honeypot" id="enquiry-honeypot" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" value={enquiryData.honeypot} onChange={e => setEnquiryData({ ...enquiryData, honeypot: e.target.value })} />
                <input type="text" id="sidebar-name" name="name" autoComplete="name" value={enquiryData.name} onChange={e => setEnquiryData({ ...enquiryData, name: e.target.value })} placeholder={t("ನಿಮ್ಮ ಹೆಸರು", "Your Name")} className="w-full bg-slate-950 border border-slate-700 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-red-600 dark:focus:border-sky-500" required />
                <div>
                  <input type="tel" id="sidebar-phone" name="phone" autoComplete="tel" value={enquiryData.phone} onChange={e => { setEnquiryData({ ...enquiryData, phone: e.target.value }); if (phoneError) setPhoneError(""); }} placeholder={t("ಮೋಬೈಲ್ ಸಂಖ್ಯೆ", "Mobile Number")} className={`w-full bg-slate-950 border text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-red-600 dark:focus:border-sky-500 ${phoneError ? 'border-rose-500' : 'border-slate-700'}`} required />
                  {phoneError && <p className="text-rose-400 text-xs mt-1">{phoneError}</p>}
                </div>
                <button type="submit" disabled={formStatus !== "idle"} className="w-full bg-red-600 hover:bg-red-700 dark:bg-sky-500 text-white font-bold py-3 rounded-lg text-sm dark:hover:bg-sky-400 transition-colors flex items-center justify-center gap-2 mt-2">
                  {formStatus === "idle" ? t("ಅತ್ಯುತ್ತಮ ಡೀಲ್ ಪಡೆಯಿರಿ", "Get Best Deal") : formStatus === "success" ? <CheckCircle size={18} /> : <Loader2 className="animate-spin" size={18} />}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {similarBusinesses.length > 0 && (
        <div className="max-w-[1200px] mx-auto px-4 md:px-[3%] mb-10">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-2"><Store size={22} className="text-red-600 dark:text-sky-500" /> {t("ಇದೇ ರೀತಿಯ ಬ್ಯುಸಿನೆಸ್‌ಗಳು", "Similar Businesses")}</h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
            {similarBusinesses.slice(0, 6).map(sb => {
              const sbTitle = t(sb.name_kn, sb.name);
              const sbSlug = sb.business_area_slug || sb.slug || `${sb.id}`;
              const sbImg = sb.main_image_upload || sb.image_url;
              return (
                <Link key={sb.id} href={`/business/${sbSlug}`} className="min-w-[220px] md:min-w-[260px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-red-600/50 dark:hover:border-sky-500/50 hover:shadow-xl transition-all duration-300 shrink-0 group">
                  <div className="h-36 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                    {sbImg ? <img src={getSupabaseImageUrl(sbImg as string) || ""} alt={sbTitle as string} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center"><Store className="w-10 h-10 text-slate-400" /></div>}
                    {sb.is_verified && <span className="absolute top-2 left-2 bg-sky-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase">Verified</span>}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-sky-500 transition-colors">{sbTitle}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1"><MapPin size={12} /> {t(sb.area_kn, sb.area)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* TOP COMPACT NAV */}
      <div className={`fixed top-0 left-0 right-0 z-[200] transition-transform duration-300 ${showStickyBar ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800 shadow-md">
          <div className="max-w-[1200px] mx-auto px-3 md:px-4 h-[56px] flex items-center gap-3">
            <div className="flex-1 min-w-0"><p className="text-[13px] md:text-sm font-extrabold text-slate-900 dark:text-white truncate leading-tight">{title as string}</p></div>
            <div className="flex items-center gap-1.5 shrink-0">
              {business.phone && <a href={`tel:${business.phone}`} className="h-9 px-3 md:px-4 bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-emerald-600 transition-colors"><Phone size={14} /><span className="hidden sm:inline">{t("ಕರೆ", "Call")}</span></a>}
              {business.phone && <a href={`https://wa.me/91${business.phone.replace(/\D/g, '')}?text=${encodeURIComponent(lang === 'kn' ? `ನಮಸ್ಕಾರ ${title}, ನಾನು ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಅನ್ನು Tumkurconnect ನಲ್ಲಿ ನೋಡಿದೆ. ನಿಮ್ಮ ಸೇವೆಗಳ ಬಗ್ಗೆ ತಿಳಿಯಲು ಬಯಸುತ್ತೇನೆ.` : `Hello ${title}, I found your profile on Tumkurconnect. I am interested in your services. Can we talk?`)}`} target="_blank" rel="noopener noreferrer" className="h-9 px-3 md:px-4 bg-[#25D366] text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-[#1DA851] transition-colors"><MessageCircle size={14} /><span className="hidden sm:inline">WA</span></a>}
              <button onClick={() => setIsEnquiryOpen(true)} aria-label={t("ಡೀಲ್ ಪಡೆಯಿರಿ", "Get Deal")} className="h-9 px-3 md:px-4 bg-sky-500 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-sky-600 transition-colors"><Store size={14} /><span className="hidden sm:inline">{t("ಡೀಲ್", "Deal")}</span></button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE BOTTOM FIXED BAR */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 dark:bg-[#050b14]/98 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 px-3 py-2.5 z-50 flex gap-2 shadow-[0_-8px_24px_rgba(0,0,0,0.15)]">
        {business.phone ? <a href={`tel:${business.phone}`} aria-label={t("ಕರೆ ಮಾಡಿ", "Call now")} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 rounded-xl font-bold text-sm h-12 shadow-md transition-all"><Phone size={18} /> {t("ಕರೆ", "Call")}</a> : <button disabled aria-label="Call unavailable" className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center gap-2 rounded-xl font-bold text-sm h-12 cursor-not-allowed"><Phone size={18} /></button>}
        {business.phone ? <a href={`https://wa.me/91${business.phone.replace(/\D/g, '')}?text=Hi, I found your business on Tumakuru Connect.`} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" className="flex-1 bg-[#25D366] hover:bg-[#1DA851] text-white flex items-center justify-center gap-2 rounded-xl font-bold text-sm h-12 shadow-md transition-all"><MessageCircle size={18} /></a> : <button disabled aria-label="WhatsApp unavailable" className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center gap-2 rounded-xl font-bold text-sm h-12 cursor-not-allowed"><MessageCircle size={18} /></button>}
        <button onClick={() => setIsEnquiryOpen(true)} aria-label={t("ಡೀಲ್ ಪಡೆಯಿರಿ", "Get Deal")} className="flex-[1.8] bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center gap-2 rounded-xl font-bold text-sm h-12 shadow-lg shadow-sky-500/25 transition-all"><Store size={18} /> {t("ಡೀಲ್ ಪಡೆಯಿರಿ", "Get Deal")}</button>
      </div>

      {/* Modals */}
      {isViewAllOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex flex-col justify-end md:justify-center md:items-center md:p-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full h-[95vh] md:h-[85vh] md:max-w-[1000px] rounded-t-2xl md:rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 md:slide-in-from-bottom-0 md:zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-3 md:px-5 md:py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <h3 className="font-extrabold text-sm md:text-lg text-slate-900 dark:text-white flex items-center gap-2 truncate pr-2"><Store size={18} className="text-slate-700 dark:text-slate-300 shrink-0" /><span className="truncate">{title as string}</span></h3>
              <div className="flex items-center gap-2 md:gap-3 shrink-0">
                {business.phone && (
                  <div className="flex gap-1.5 md:gap-2">
                    <a href={`tel:${business.phone}`} className="bg-[#0b8e21] hover:bg-[#09731b] transition-colors text-white px-2.5 py-1.5 md:px-4 md:py-2 rounded-md font-bold text-[11px] md:text-sm flex items-center gap-1 shadow-sm"><Phone size={14} className="fill-white" /> <span className="hidden sm:inline">{business.phone}</span></a>
                    <a href={`https://wa.me/91${business.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 transition-colors px-2.5 py-1.5 md:px-4 md:py-2 rounded-md font-bold text-[11px] md:text-sm flex items-center gap-1 shadow-sm"><MessageCircle size={14} className="text-[#25D366]" /> <span className="hidden sm:inline">WhatsApp</span></a>
                  </div>
                )}
                <button onClick={() => { setIsViewAllOpen(false); setServiceSearch(""); setActiveServiceTab("all"); }} className="text-slate-500 hover:text-slate-900 p-1 md:p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"><X size={22} /></button>
              </div>
            </div>
            <div className="flex flex-row flex-1 overflow-hidden bg-white dark:bg-slate-900">
              <div className="w-[110px] sm:w-[160px] md:w-[260px] border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 bg-slate-50/30 dark:bg-[#0a1120]">
                <div className="p-2 md:p-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1.5 md:px-3 md:py-2 focus-within:border-sky-500 bg-white dark:bg-slate-950">
                    <input type="text" placeholder={t("Search...", "Search...")} className="w-full bg-transparent outline-none text-[11px] md:text-sm text-slate-900 dark:text-white" value={serviceSearch} onChange={(e) => setServiceSearch(e.target.value)} />
                    <Search size={14} className="text-sky-500 shrink-0" />
                  </div>
                </div>
                <div className="overflow-y-auto flex flex-col scrollbar-hide flex-1 py-1">
                  <button onClick={() => setActiveServiceTab('all')} className={`text-left px-3 md:px-5 py-3 md:py-4 text-[12px] md:text-[14px] transition-colors border-l-[3px] ${activeServiceTab === 'all' ? 'border-sky-500 text-slate-900 dark:text-white font-bold bg-white dark:bg-slate-800/50 shadow-[2px_0_5px_rgba(0,0,0,0.02)]' : 'border-transparent text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800/30'}`}>All <span className="text-[10px] md:text-[12px] ml-0.5">({dynamicCategories.reduce((acc, cat) => acc + cat.items.length, 0)})</span></button>
                  {dynamicCategories.map((category) => (
                    <button key={category.name} onClick={() => setActiveServiceTab(category.name)} className={`text-left px-3 md:px-5 py-3 md:py-4 text-[12px] md:text-[14px] transition-colors border-l-[3px] ${activeServiceTab === category.name ? 'border-sky-500 text-slate-900 dark:text-white font-bold bg-white dark:bg-slate-800/50 shadow-[2px_0_5px_rgba(0,0,0,0.02)]' : 'border-transparent text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800/30'}`}>{category.name} <span className="text-[10px] md:text-[12px] ml-0.5">({category.items.length})</span></button>
                  ))}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-white dark:bg-slate-900">
                {dynamicCategories.map((category, index) => {
                  const isTabActive = activeServiceTab === 'all' || activeServiceTab === category.name;
                  const filteredItems = category.items.filter(item => item.toLowerCase().includes(serviceSearch.toLowerCase()));
                  if (!isTabActive || filteredItems.length === 0) return null;
                  return (
                    <div key={category.name} className={`${index !== dynamicCategories.length - 1 ? 'border-b border-slate-100 dark:border-slate-800 pb-6 mb-6 md:pb-8 md:mb-8' : 'pb-4'}`}>
                      <h4 className="text-base md:text-lg font-bold text-slate-900 dark:text-white mb-4 md:mb-5">{category.name}</h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-y-4 gap-x-4">
                        {filteredItems.map((item, i) => (<div key={i} className="flex items-start gap-2.5"><CheckCircle size={16} className="text-slate-800 dark:text-slate-200 shrink-0 mt-0.5" /><span className="text-[13px] md:text-[14px] font-medium text-slate-700 dark:text-slate-300 leading-snug">{item}</span></div>))}
                      </div>
                    </div>
                  );
                })}
                {dynamicCategories.every(cat => cat.items.filter(i => i.toLowerCase().includes(serviceSearch.toLowerCase())).length === 0) && (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400"><Search size={40} className="mb-3 opacity-20 text-slate-400" /><p className="font-medium text-sm text-slate-500">{t("ಯಾವುದೇ ಮಾಹಿತಿ ಸಿಗಲಿಲ್ಲ", "No results found")}</p></div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {isEnquiryOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 flex justify-between items-center border-b border-slate-800"><h3 className="text-lg font-bold text-white flex items-center gap-2"><MessageCircle className="text-sky-500" /> {t("ಡೀಲ್ ಪಡೆಯಿರಿ", "Get Best Deal")}</h3><button onClick={() => setIsEnquiryOpen(false)} className="text-slate-400 hover:text-white"><X size={24} /></button></div>
            <form onSubmit={submitForm} className="p-6 flex flex-col gap-4">
              <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg overflow-hidden focus-within:border-sky-500 h-12"><span className="px-4 text-slate-500"><User size={16} /></span><input type="text" id="modal-name" name="name" autoComplete="name" value={enquiryData.name} onChange={e => setEnquiryData({ ...enquiryData, name: e.target.value })} className="w-full bg-transparent text-white text-sm outline-none" placeholder={t("ನಿಮ್ಮ ಹೆಸರು", "Your Name")} required suppressHydrationWarning /></div>
              <div><div className={`flex items-center bg-slate-950 border rounded-lg overflow-hidden focus-within:border-sky-500 h-12 ${phoneError ? 'border-rose-500' : 'border-slate-700'}`}><span className="px-4 text-slate-500"><Smartphone size={16} /></span><input type="tel" id="modal-phone" name="phone" autoComplete="tel" value={enquiryData.phone} onChange={e => { setEnquiryData({ ...enquiryData, phone: e.target.value }); if (phoneError) setPhoneError(""); }} className="w-full bg-transparent text-white text-sm outline-none" placeholder={t("ಮೋಬೈಲ್ ಸಂಖ್ಯೆ", "Mobile Number")} required suppressHydrationWarning /></div>{phoneError && <p className="text-rose-400 text-xs mt-1 ml-1">{phoneError}</p>}</div>
              <button type="submit" disabled={formStatus !== "idle"} className="w-full bg-sky-500 text-white font-bold h-12 rounded-lg text-sm hover:bg-sky-400 mt-2 flex items-center justify-center gap-2">{formStatus === "loading" ? <Loader2 className="animate-spin" /> : formStatus === "success" ? <CheckCircle /> : t("ವಿಚಾರಣೆ ಕಳುಹಿಸಿ", "Submit Enquiry")}</button>
            </form>
          </div>
        </div>
      )}

      {isSuggestOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p-5 flex justify-between items-center border-b border-slate-800"><h3 className="text-lg font-bold text-white flex items-center gap-2"><Edit3 className="text-sky-500" size={20} /> {t("ಸುಧಾರಣೆ ಸೂಚಿಸಿ", "Suggest an Edit")}</h3><button onClick={() => setIsSuggestOpen(false)} className="text-slate-400 hover:text-white"><X size={24} /></button></div>
            {suggestStatus === "success" ? (
              <div className="p-8 flex flex-col items-center gap-3 text-emerald-400"><CheckCircle size={40} /><p className="font-bold text-lg">{t("ಧನ್ಯವಾದಗಳು!", "Thank you!")}</p><p className="text-sm text-slate-400 text-center">{t("ನಿಮ್ಮ ಸೂಚನೆ ಸಲ್ಲಿಯಾಗಿದೆ", "Your suggestion has been submitted")}</p></div>
            ) : (
              <form onSubmit={submitSuggest} className="p-6 flex flex-col gap-4">
                <input type="text" id="suggest-name" name="suggest_name" autoComplete="name" value={suggestData.name} onChange={e => setSuggestData({ ...suggestData, name: e.target.value })} placeholder={t("ನಿಮ್ಮ ಹೆಸರು", "Your Name")} className="w-full bg-slate-950 border border-slate-700 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-sky-500" required suppressHydrationWarning />
                <input type="tel" id="suggest-phone" name="suggest_phone" autoComplete="tel" value={suggestData.phone} onChange={e => setSuggestData({ ...suggestData, phone: e.target.value })} placeholder={t("ಮೋಬೈಲ್ ಸಂಖ್ಯೆ", "Mobile Number")} className="w-full bg-slate-950 border border-slate-700 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-sky-500" required suppressHydrationWarning />
                <select id="suggest-field" name="suggest_field" value={suggestData.field} onChange={e => setSuggestData({ ...suggestData, field: e.target.value })} className="w-full bg-slate-950 border border-slate-700 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-sky-500" required><option value="">{t("ಇಲಿ್ಲ ಬದಲಾಯಿಸು ಆಯ್ಕೆ ಮಾಡಿ", "Select what to edit")}</option><option value="phone">{t("ಫೋನ್ ಸಂಖ್ಯೆ", "Phone Number")}</option><option value="address">{t("ವಿಳಾಸ", "Address")}</option><option value="hours">{t("ಕೆಲಸದ ಸಮಯ", "Working Hours")}</option><option value="name">{t("ಹೆಸರು", "Business Name")}</option><option value="other">{t("ಇತರೆ", "Other")}</option></select>
                <textarea value={suggestData.details} onChange={e => setSuggestData({ ...suggestData, details: e.target.value })} placeholder={t("ವಿವರಗಳು ನಮೂದಿಸಿ...", "Describe the correction...")} rows={3} className="w-full bg-slate-950 border border-slate-700 text-white px-4 py-3 rounded-lg text-sm outline-none focus:border-sky-500 resize-none" required />
                <button type="submit" disabled={suggestStatus === "loading"} className="w-full bg-sky-500 text-white font-bold h-12 rounded-lg text-sm hover:bg-sky-400 flex items-center justify-center gap-2">{suggestStatus === "loading" ? <Loader2 className="animate-spin" size={18} /> : t("ಸಲ್ಲಿಸಿ", "Submit")}</button>
              </form>
            )}
          </div>
        </div>
      )}

      {toastMsg && (
        <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-[9999] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl shadow-2xl shadow-black/30 font-bold text-sm border border-slate-700 dark:border-slate-200 flex items-center gap-2">{toastMsg}</div>
        </div>
      )}
    </div>
  );
}
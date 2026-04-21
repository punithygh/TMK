"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { 
  Phone, MessageCircle, MapPin, Share2, Edit3, Heart, 
  Star, ChevronRight, CheckCircle, Car, Wifi, 
  Snowflake, Shield, Zap, X, User, Smartphone, Loader2, Store,
  BadgeCheck
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
      await navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(shareData.url);
      alert(t("ಲಿಂಕ್ ಕಾಪಿ ಮಾಡಲಾಗಿದೆ!", "Link copied to clipboard!"));
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
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  let mainImage = business.main_image_upload || business.image_url;
  
  if (mainImage && !mainImage.startsWith('http')) {
    mainImage = `${backendUrl}${mainImage.startsWith('/') ? '' : '/'}${mainImage}`;
  }

  return (
    <div className="w-full bg-[#050b14] min-h-screen pb-24 md:pb-10 font-poppins">
      <div className="max-w-[1400px] mx-auto px-4 md:px-[3%] pt-6">
        <div className="flex items-center gap-2 text-[11px] md:text-xs text-slate-400 mb-4 whitespace-nowrap overflow-x-auto scrollbar-hide">
          <Link href="/" className="hover:text-sky-400 transition-colors">{t("ತುಮಕೂರು", "Tumkur")}</Link>
          <ChevronRight size={12} />
          <Link href={`/listings?category=${business.category_name}`} className="hover:text-sky-400 transition-colors">{category}</Link>
          <ChevronRight size={12} />
          <span className="font-semibold text-sky-400">{title}</span>
        </div>

        <div 
          ref={galleryRef}
          onScroll={handleGalleryScroll}
          className="flex md:grid md:grid-cols-3 gap-1 h-[250px] md:h-[350px] rounded-xl overflow-x-auto md:overflow-hidden snap-x snap-mandatory scrollbar-hide bg-slate-900 border border-slate-800 mb-3 md:mb-6"
        >
          <div className="min-w-full md:min-w-0 md:col-span-2 relative snap-start bg-slate-800 flex items-center justify-center group">
            {mainImage ? (
              <img src={mainImage} alt={title as string} className="w-full h-full object-contain md:object-cover" />
            ) : (
              <Store className="w-20 h-20 text-slate-700" />
            )}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm text-slate-900 px-4 py-1.5 rounded-md font-bold text-lg shadow-lg flex items-baseline gap-1">
              <span className="text-emerald-600">₹{business.id * 100}</span> <small className="text-[11px] text-slate-500">/ {t("ದಿನಕ್ಕೆ", "day")}</small>
            </div>
          </div>
          <div className="hidden md:grid grid-rows-2 gap-1 h-full">
            <div className="relative bg-slate-800 flex items-center justify-center">
              <Store className="w-10 h-10 text-slate-700" />
            </div>
            <div className="relative bg-slate-800 flex items-center justify-center cursor-pointer group">
              <Store className="w-10 h-10 text-slate-700" />
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-3xl mb-1">+</span>
                <span className="text-sm font-semibold">{t("ಫೋಟೋ ಸೇರಿಸಿ", "Add Photos")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
          <div className="w-full md:w-auto">
            <div className="flex gap-2 mb-2">
              <span className="bg-transparent border border-slate-700 text-slate-400 px-2.5 py-0.5 rounded text-[11px] font-medium">{category}</span>
              <span className="bg-transparent border border-slate-700 text-slate-400 px-2.5 py-0.5 rounded text-[11px] font-medium">{location}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3 flex-wrap">
              {title}
              {business.is_verified && (
                <span className="text-sky-400 flex items-center gap-1 text-sm font-bold bg-sky-400/10 px-2 py-0.5 rounded border border-sky-400/20">
                  <BadgeCheck size={16} /> Verified
                </span>
              )}
            </h1>
            <div className="flex items-center gap-3 mt-3">
              <span className="bg-emerald-500 text-white font-bold px-2 py-0.5 rounded text-sm flex items-center gap-1">
                {business.rating || 4.5} <Star size={12} fill="currentColor" />
              </span>
            </div>
            <div className="text-slate-400 text-[13px] md:text-sm mt-3 flex items-start gap-2 leading-relaxed">
              <MapPin size={16} className="shrink-0 mt-0.5 text-sky-500" />
              {business.address || `${location}, Tumkur`}
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
            <button onClick={handleBookmarkToggle} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border rounded-lg transition-colors text-sm font-semibold ${isBookmarked ? 'bg-red-500 border-red-500 text-white' : 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white'}`}>
              <Heart size={16} fill={isBookmarked ? "currentColor" : "none"} /> <span className="hidden md:inline">{isBookmarked ? t("ಉಳಿಸಲಾಗಿದೆ", "Saved") : t("ಉಳಿಸಿ", "Save")}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap md:flex-nowrap gap-3 mb-8 w-full border-y border-slate-800 py-4">
          {business.phone ? (
            <>
              <a href={`tel:${business.phone}`} className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-transform hover:-translate-y-1 shadow-lg shadow-emerald-500/20">
                <Phone size={18} /> <span className="hidden md:inline">{business.phone}</span>
              </a>
            </>
          ) : (
            <button disabled className="flex-1 md:flex-none bg-slate-700 text-slate-400 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm cursor-not-allowed">
              <Phone size={18} /> <span className="hidden md:inline">{t("ಸಂಪರ್ಕ ಲಭ್ಯವಿಲ್ಲ", "No Contact")}</span>
            </button>
          )}
          <button onClick={() => setIsEnquiryOpen(true)} className="w-full md:w-auto bg-sky-500 hover:bg-sky-400 text-white flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-transform hover:-translate-y-1 shadow-lg shadow-sky-500/20">
            <MessageCircle size={18} /> {t("ಅತ್ಯುತ್ತಮ ಡೀಲ್ ಪಡೆಯಿರಿ", "Get Best Deal")}
          </button>
          <div className="hidden md:flex gap-3 ml-auto">
            <button onClick={handleShare} className="border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-colors">
              <Share2 size={18} /> Share
            </button>
          </div>
        </div>

        <div className="sticky top-[60px] md:top-[75px] bg-[#050b14]/95 backdrop-blur-md z-40 flex gap-6 md:gap-10 border-b border-slate-800 overflow-x-auto scrollbar-hide pt-2 mb-6">
          {["overview", "services", "photos", "reviews"].map((tab) => (
            <button 
              key={tab}
              onClick={() => {
                const el = document.getElementById(tab);
                if (el) window.scrollTo({ top: el.offsetTop - 120, behavior: "smooth" });
              }}
              className={`pb-3 text-[13px] md:text-sm font-semibold capitalize whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? 'text-sky-400 border-sky-400' : 'text-slate-400 border-transparent hover:text-slate-200'}`}
            >
              {t(tab === "overview" ? "ಸ್ಥೂಲನೋಟ" : tab === "services" ? "ಸೇವೆಗಳು" : tab === "photos" ? "ಫೋಟೋಗಳು" : "ವಿಮರ್ಶೆಗಳು", tab)}
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
              
              <h3 className="text-sm font-semibold text-slate-400 mt-8 mb-3">{t("ವಿವರಣೆ", "Business summary")}</h3>
              <p className="text-[13px] md:text-sm text-slate-300 leading-relaxed">
                {t(business.description_kn, business.description) || t("ವಿವರಗಳು ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿವೆ.", "Detailed information will be updated soon.")}
              </p>
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

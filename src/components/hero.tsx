"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { getBanners, Banner } from "@/services/courses";
import { getSupabaseImageUrl } from "@/utils/imageUtils";

const FALLBACK_BANNER: Banner = {
  id: 0,
  title: "Tumkurconnect – Everything One Click",
  image_url: null,
  link_url: null,
  order: 0,
  view_time: 5,
};

const Hero = ({ banners: initialBanners }: { banners?: Banner[] }) => {
  const router = useRouter();
  const { lang, t } = useLanguage();

  const [banners, setBanners] = useState<Banner[]>(initialBanners && initialBanners.length > 0 ? initialBanners : [FALLBACK_BANNER]);
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    // Only fetch internally if no banners were passed as props
    if (!initialBanners || initialBanners.length === 0) {
      getBanners().then((data) => {
        if (data && data.length > 0) setBanners(data);
      });
    }
  }, [initialBanners]);

  const goToNext = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
      setVisible(true);
    }, 500);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const duration = (banners[current]?.view_time || 5) * 1000;
    const timer = setInterval(goToNext, duration);
    return () => clearInterval(timer);
  }, [banners, current, goToNext]);

  useEffect(() => {
    const phrases = lang === "kn"
      ? ["ಹೋಟೆಲ್ ಹುಡುಕಿ...", "ಪಿಜಿ ಹುಡುಕಿ...", "ವೈದ್ಯರನ್ನು ಹುಡುಕಿ...", "ಕಲ್ಯಾಣ ಮಂಟಪ..."]
      : ["Search for Hotels...", "Search for PGs...", "Search for Doctors...", "Search Plumbers..."];

    const handleType = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];
      setPlaceholder(isDeleting ? fullText.substring(0, placeholder.length - 1) : fullText.substring(0, placeholder.length + 1));
      setTypingSpeed(isDeleting ? 40 : 80);

      if (!isDeleting && placeholder === fullText) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && placeholder === "") {
        setIsDeleting(false);
        setLoopNum((n) => n + 1);
      }
    };
    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [placeholder, isDeleting, loopNum, typingSpeed, lang]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) router.push(`/listings?q=${encodeURIComponent(searchQuery)}`);
  };

  const activeBanner = banners[current];

  return (
    <div className="flex flex-col w-full relative mt-[0px] md:mt-[0px]">
      {/* BANNER CONTAINER - 4:3 on Mobile (for 4096x3072), 21:9 on Desktop */}
      <section className="relative w-full overflow-hidden aspect-[4/3] md:aspect-[21/9] lg:max-h-[600px] shadow-sm md:shadow-none">
        <div className="absolute inset-0 z-0" style={{ opacity: visible ? 1 : 0, transition: "opacity 700ms cubic-bezier(0.4, 0, 0.2, 1)" }}>
          {getSupabaseImageUrl(activeBanner.image_url, { width: 1920, quality: 85 }) ? (
            <Image
              key={activeBanner.id}
              src={getSupabaseImageUrl(activeBanner.image_url, { width: 1920, quality: 85 }) || ""}
              alt={activeBanner.title}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center transition-opacity duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#050b14] via-[#0c1a35] to-[#071020]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/40 md:bg-black/30" />
        </div>

        {/* 💻 DESKTOP SEARCH BAR (Inside Banner) */}
        <div className="hidden md:flex absolute inset-0 z-20 items-center justify-center px-4 pointer-events-none flex-col gap-5 pt-[85px]">
          <div className="w-full max-w-xl mx-auto pointer-events-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center w-full bg-white/95 dark:bg-[#0a1120]/90 backdrop-blur-xl rounded-full p-2 border-[1.5px] border-red-500 dark:border-white shadow-[0_8px_30px_rgb(0,0,0,0.15)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.15)] focus-within:shadow-[0_8px_40px_rgba(220,38,38,0.2)] dark:focus-within:shadow-[0_8px_40px_rgba(255,255,255,0.2)] transition-all duration-300"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={placeholder}
                className="flex-grow w-full bg-transparent pl-5 pr-2 py-2.5 text-slate-900 dark:text-white outline-none text-[15px] font-extrabold placeholder:text-slate-500 dark:placeholder:text-slate-300"
                autoComplete="off"
              />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 dark:bg-sky-600 dark:hover:bg-sky-500 text-white rounded-full h-11 w-11 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-lg shrink-0 ml-1"
              >
                <Search size={20} className="drop-shadow-sm" />
              </button>
            </form>
          </div>

          <div className="flex flex-nowrap items-center justify-center gap-2.5 pointer-events-auto overflow-x-auto w-full max-w-2xl scrollbar-hide pb-2">
            <Link href="/listings?category=hotel" className="shrink-0 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white text-[12px] font-bold transition-all hover:-translate-y-0.5 shadow-lg flex items-center gap-1.5">🏨 Hotels</Link>
            <Link href="/listings?category=hospital" className="shrink-0 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white text-[12px] font-bold transition-all hover:-translate-y-0.5 shadow-lg flex items-center gap-1.5">🏥 Hospitals</Link>
            <Link href="/listings?category=restaurant" className="shrink-0 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white text-[12px] font-bold transition-all hover:-translate-y-0.5 shadow-lg flex items-center gap-1.5">🍔 Food</Link>
            <Link href="/listings?category=plumber" className="shrink-0 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white text-[12px] font-bold transition-all hover:-translate-y-0.5 shadow-lg flex items-center gap-1.5">🛠️ Plumbers</Link>
          </div>
        </div>
      </section>

      {/* 📱 MOBILE SEARCH SECTION (Below Banner with Glowing Lines) */}
      <div className="md:hidden flex flex-col w-full px-4 mt-6 gap-3">
        {/* Top Glow Line */}
        <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-red-500 dark:via-sky-400 to-transparent shadow-[0_0_10px_rgba(220,38,38,0.6)] dark:shadow-[0_0_10px_rgba(56,189,248,0.6)] opacity-80" />

        <div className="flex flex-col gap-4 py-2">
          {/* Mobile Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center w-full bg-white dark:bg-[#0f172a] rounded-2xl p-1.5 border-[1.5px] border-red-500 dark:border-white shadow-sm focus-within:ring-2 focus-within:ring-red-500/20 dark:focus-within:ring-white/20 transition-all duration-300"
          >
            <Search size={18} className="text-gray-400 ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={placeholder}
              className="flex-grow w-full bg-transparent px-2.5 py-2.5 text-gray-900 dark:text-white outline-none text-[14px] font-extrabold placeholder:text-gray-400 dark:placeholder:text-slate-400"
              autoComplete="off"
            />
            <button
              type="submit"
              className="bg-gradient-to-br from-red-600 to-red-500 dark:from-sky-500 dark:to-blue-600 text-white rounded-xl h-10 w-10 flex items-center justify-center shadow-md shrink-0 active:scale-95 transition-transform"
            >
              <Search size={18} />
            </button>
          </form>

          {/* Mobile Quick Tags */}
          <div className="flex flex-nowrap overflow-x-auto scrollbar-hide gap-2 px-1">
            <Link href="/listings?category=hotel" className="shrink-0 px-3 py-1.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-full text-slate-700 dark:text-slate-300 text-[11px] font-extrabold shadow-sm flex items-center gap-1.5">🏨 Hotels</Link>
            <Link href="/listings?category=hospital" className="shrink-0 px-3 py-1.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-full text-slate-700 dark:text-slate-300 text-[11px] font-extrabold shadow-sm flex items-center gap-1.5">🏥 Hospitals</Link>
            <Link href="/listings?category=restaurant" className="shrink-0 px-3 py-1.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-full text-slate-700 dark:text-slate-300 text-[11px] font-extrabold shadow-sm flex items-center gap-1.5">🍔 Food</Link>
            <Link href="/listings?category=pg" className="shrink-0 px-3 py-1.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-full text-slate-700 dark:text-slate-300 text-[11px] font-extrabold shadow-sm flex items-center gap-1.5">🛏️ PGs</Link>
          </div>
        </div>

        {/* Bottom Glow Line */}
        <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-red-500 dark:via-sky-400 to-transparent shadow-[0_0_10px_rgba(220,38,38,0.6)] dark:shadow-[0_0_10px_rgba(56,189,248,0.6)] opacity-80 mb-2" />
      </div>
    </div>
  );
};

export default Hero;

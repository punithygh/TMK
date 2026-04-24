"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Hotel, Hospital, Bed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { getBanners, Banner } from "@/services/courses";

// ─── Fallback gradient slide (shown when no banners are uploaded yet) ──────────
const FALLBACK_BANNER: Banner = {
  id: 0,
  title: "Tumakuru Connect – Everything One Click",
  image_url: null,
  link_url: null,
  order: 0,
};

const Hero = () => {
  const router = useRouter();
  const { lang, t } = useLanguage();

  // ── Slider state ──────────────────────────────────────────────────────────────
  const [banners, setBanners] = useState<Banner[]>([FALLBACK_BANNER]);
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true); // controls CSS opacity for fade

  // ── Search / typewriter state ──────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);

  // ── Fetch banners from /api/v1/banners/ ────────────────────────────────────
  useEffect(() => {
    getBanners().then((data) => {
      if (data && data.length > 0) {
        setBanners(data);
      }
    });
  }, []);

  // ── Auto-slide every 5 s with Fade-out → swap → Fade-in ───────────────────
  const goToNext = useCallback(() => {
    setVisible(false); // start fade-out
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
      setVisible(true); // fade-in new slide
    }, 500); // 500 ms fade duration
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(goToNext, 5000);
    return () => clearInterval(timer);
  }, [banners.length, goToNext]);

  // ── Typewriter effect (language-aware) ───────────────────────────────────
  useEffect(() => {
    const phrases =
      lang === "kn"
        ? ["ಹೋಟೆಲ್ ಹುಡುಕಿ...", "ಪಿಜಿ (PG) ಹುಡುಕಿ...", "ವೈದ್ಯರನ್ನು ಹುಡುಕಿ...", "ಕಲ್ಯಾಣ ಮಂಟಪ..."]
        : ["Search for Hotels...", "Search for PGs...", "Search for Doctors...", "Search Plumbers..."];

    const handleType = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];
      setPlaceholder(
        isDeleting
          ? fullText.substring(0, placeholder.length - 1)
          : fullText.substring(0, placeholder.length + 1)
      );
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

  // ── Search submit ──────────────────────────────────────────────────────────
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/listings?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const activeBanner = banners[current];

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "clamp(280px, 45vw, 520px)" }}
      aria-label="Homepage banner slider"
    >
      {/* ── Background layer: full-bleed image with fade transition ─────────── */}
      <div
        className="absolute inset-0 z-0"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 500ms ease-in-out",
        }}
      >
        {activeBanner.image_url ? (
          <Image
            key={activeBanner.id}
            src={activeBanner.image_url}
            alt={activeBanner.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        ) : (
          /* Fallback gradient when no image is uploaded */
          <div className="w-full h-full bg-gradient-to-br from-[#050b14] via-[#0c1a35] to-[#071020]" />
        )}

        {/* Dark overlay — always on top of image for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
      </div>

      {/* ── Dot indicators ───────────────────────────────────────────────────── */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => {
                setVisible(false);
                setTimeout(() => { setCurrent(idx); setVisible(true); }, 500);
              }}
              className="rounded-full transition-all duration-300"
              style={{
                width: idx === current ? "24px" : "8px",
                height: "8px",
                background: idx === current ? "#38bdf8" : "rgba(255,255,255,0.45)",
              }}
            />
          ))}
        </div>
      )}

      {/* ── Optional click-through link wrapping the whole banner ────────────── */}
      {activeBanner.link_url && (
        <Link
          href={activeBanner.link_url}
          className="absolute inset-0 z-10"
          aria-label={activeBanner.title}
        />
      )}

      {/* ── Centered overlay content: SEARCH BAR ONLY ────────────────────────── */}
      <div className="absolute inset-0 z-20 flex items-center justify-center px-4 pointer-events-none">
        <div className="w-full max-w-xl pointer-events-auto">

          {/* Premium Glassmorphism Search Bar */}
          <div className="group">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center bg-white/90 dark:bg-[#0f172a]/85 backdrop-blur-xl rounded-2xl p-1.5 shadow-[0_8px_40px_rgba(14,165,233,0.25)] border border-white/30 dark:border-white/10 focus-within:border-sky-400 focus-within:shadow-[0_8px_40px_rgba(14,165,233,0.4)] focus-within:bg-white dark:focus-within:bg-[#0f172a]/98 transition-all duration-500"
            >
              <input
                type="text"
                id="hero-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={placeholder}
                className="flex-grow bg-transparent pl-4 pr-2 py-3 md:py-3.5 text-slate-900 dark:text-white outline-none text-sm md:text-[15px] font-medium placeholder:text-slate-500 dark:placeholder:text-slate-400"
                autoComplete="off"
              />
              <button
                type="submit"
                id="hero-search-btn"
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl h-10 w-10 md:h-12 md:w-auto md:px-6 flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-500/30 shrink-0 mr-0.5"
              >
                <Search size={18} className="md:w-5 md:h-5" />
                <span className="hidden md:inline font-bold text-sm tracking-wide">
                  {t("ಹುಡುಕಿ", "Search")}
                </span>
              </button>
            </form>

            {/* Quick Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
              <span className="text-[10px] md:text-xs font-bold text-white/60 uppercase tracking-widest mr-1">
                {t("ಜನಪ್ರಿಯ:", "Popular:")}
              </span>
              <button
                onClick={() => router.push("/listings?q=Hotel")}
                className="bg-white/15 hover:bg-sky-500 text-white border border-white/20 rounded-full px-3 py-1 text-[11px] md:text-xs flex items-center gap-1.5 backdrop-blur-md transition-all duration-300 hover:border-sky-400"
              >
                <Hotel size={12} /> {t("ಹೋಟೆಲ್", "Hotels")}
              </button>
              <button
                onClick={() => router.push("/listings?q=Hospital")}
                className="bg-white/15 hover:bg-sky-500 text-white border border-white/20 rounded-full px-3 py-1 text-[11px] md:text-xs flex items-center gap-1.5 backdrop-blur-md transition-all duration-300 hover:border-sky-400"
              >
                <Hospital size={12} /> {t("ಆಸ್ಪತ್ರೆ", "Hospitals")}
              </button>
              <button
                onClick={() => router.push("/listings?q=PG")}
                className="bg-white/15 hover:bg-sky-500 text-white border border-white/20 rounded-full px-3 py-1 text-[11px] md:text-xs flex items-center gap-1.5 backdrop-blur-md transition-all duration-300 hover:border-sky-400"
              >
                <Bed size={12} /> {t("ಪಿಜಿ", "PGs")}
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
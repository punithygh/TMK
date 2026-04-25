"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { getBanners, Banner } from "@/services/courses";

const FALLBACK_BANNER: Banner = {
  id: 0,
  title: "Tumakuru Connect – Everything One Click",
  image_url: null,
  link_url: null,
  order: 0,
  view_time: 5,
};

const Hero = () => {
  const router = useRouter();
  const { lang, t } = useLanguage();

  const [banners, setBanners] = useState<Banner[]>([FALLBACK_BANNER]);
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    getBanners().then((data) => {
      if (data && data.length > 0) setBanners(data);
    });
  }, []);

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
    <section className="relative w-full overflow-hidden aspect-video md:aspect-[21/9] max-h-[80vh] lg:max-h-[600px]">
      <div className="absolute inset-0 z-0" style={{ opacity: visible ? 1 : 0, transition: "opacity 500ms ease-in-out" }}>
        {activeBanner.image_url ? (
          <Image key={activeBanner.id} src={activeBanner.image_url} alt={activeBanner.title} fill priority sizes="100vw" className="object-cover object-center" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#050b14] via-[#0c1a35] to-[#071020]" />
        )}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="absolute inset-0 z-20 flex items-center justify-center px-4 pointer-events-none">
        <div className="w-[85%] md:w-full max-w-md mx-auto pointer-events-auto mt-4">
          <form
            onSubmit={handleSearchSubmit}
            /* 🌟 Design Updates: BLUE Glass, Background showing through & Thick Blue Border 🌟 */
            className="flex items-center w-full bg-blue-500/20 backdrop-blur-xl rounded-full p-1.5 border-[3px] border-blue-500 shadow-2xl focus-within:border-blue-400 focus-within:bg-blue-500/30 transition-all duration-300"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={placeholder}
              className="flex-grow w-full bg-transparent pl-5 pr-2 py-3 text-white outline-none text-sm md:text-base font-bold placeholder:text-white/90 drop-shadow-md"
              autoComplete="off"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white rounded-full h-11 w-11 flex items-center justify-center transition-all shadow-lg shrink-0 ml-1"
            >
              <Search size={20} className="drop-shadow-sm" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Hero;
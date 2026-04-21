"use client";

import { useState, useEffect } from "react";
import { Search, Hotel, Hospital, Bed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext"; // 🚨 ಗ್ಲೋಬಲ್ ಕಾಂಟೆಕ್ಸ್ಟ್ ಇಂಪೋರ್ಟ್

const Hero = () => {
  const router = useRouter();
  
  // 🚨 ಸ್ವಂತ useState ಬದಲು ಗ್ಲೋಬಲ್ ಕಾಂಟೆಕ್ಸ್ಟ್‌ನಿಂದ `lang` ಮತ್ತು `t` ಅನ್ನು ಪಡೆಯುತ್ತಿದ್ದೇವೆ
  const { lang, t } = useLanguage(); 

  const [searchQuery, setSearchQuery] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);

  // 🚨 ಗಮನಿಸಿ: ಇಲ್ಲಿಂದ Cookie Hydration useEffect ಅನ್ನು ತೆಗೆಯಲಾಗಿದೆ. 

  // 🚨 Premium Feature: Typewriter Effect Logic (Language Aware - Realtime Sync)
  useEffect(() => {
    const phrases = lang === "kn" 
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
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [placeholder, isDeleting, loopNum, typingSpeed, lang]);

  // ಸರ್ಚ್ ಫಾರ್ಮ್ ಸಬ್ಮಿಟ್ ಲಾಜಿಕ್
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/listings?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="relative min-h-[400px] md:min-h-[450px] flex items-center justify-center pt-28 pb-16 overflow-hidden">
      
      {/* 1. Dynamic Background with Gradient Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10s] hover:scale-105"
        style={{ 
          backgroundImage: `linear-gradient(180deg, rgba(5, 11, 20, 0.75) 0%, rgba(5, 11, 20, 0.95) 100%), url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1920&q=80')` 
        }}
      />

      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10 text-center space-y-6 md:space-y-8">
        
        {/* 2. Main Title (Language Aware with JSX) */}
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-[28px] md:text-5xl lg:text-[54px] font-black text-white leading-[1.3] md:leading-tight">
            {lang === "kn" ? (
              <>ತುಮಕೂರಿನ ಎಲ್ಲವೂ.. <br className="hidden md:block" /> <span className="text-sky-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">ಒಂದೇ ಕ್ಲಿಕ್‌ನಲ್ಲಿ.</span></>
            ) : (
              <>Everything Tumakuru.. <br className="hidden md:block" /> <span className="text-sky-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">One Click.</span></>
            )}
          </h1>
        </div>

        {/* 3. Premium Search Container */}
        <div className="max-w-[90%] md:max-w-xl mx-auto w-full group animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          <form onSubmit={handleSearchSubmit} className="flex items-center bg-white rounded-full p-1 shadow-2xl shadow-sky-500/20 border-[3px] border-transparent focus-within:border-sky-400 transition-all duration-300">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={placeholder}
              className="flex-grow bg-transparent pl-4 pr-2 py-2.5 md:py-3 text-slate-900 outline-none text-sm md:text-base font-medium placeholder:text-slate-500"
            />
            <button type="submit" className="bg-sky-500 hover:bg-sky-400 text-white rounded-full h-10 w-10 md:h-12 md:w-12 md:px-6 md:w-auto flex items-center justify-center gap-2 transition-colors shrink-0 mr-0.5">
              <Search size={18} className="md:w-5 md:h-5" />
              {/* 🚨 t() ಫಂಕ್ಷನ್ ಬಳಕೆ (ಕೋಡ್ ಚಿಕ್ಕದಾಗಿದೆ) */}
              <span className="hidden md:inline font-bold text-sm">{t("ಹುಡುಕಿ", "Search")}</span>
            </button>
          </form>

          {/* 4. Quick Chips (Popular Searches with t() helper) */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
            <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mr-1">
              {t("ಜನಪ್ರಿಯ:", "Popular:")}
            </span>
            <button onClick={() => router.push('/listings?q=Hotel')} className="bg-white/10 hover:bg-sky-500 text-white border border-white/10 rounded-full px-3 py-1 text-[11px] md:text-xs flex items-center gap-1.5 backdrop-blur-md transition-all">
              <Hotel size={12} /> {t("ಹೋಟೆಲ್", "Hotels")}
            </button>
            <button onClick={() => router.push('/listings?q=Hospital')} className="bg-white/10 hover:bg-sky-500 text-white border border-white/10 rounded-full px-3 py-1 text-[11px] md:text-xs flex items-center gap-1.5 backdrop-blur-md transition-all">
              <Hospital size={12} /> {t("ಆಸ್ಪತ್ರೆ", "Hospitals")}
            </button>
            <button onClick={() => router.push('/listings?q=PG')} className="bg-white/10 hover:bg-sky-500 text-white border border-white/10 rounded-full px-3 py-1 text-[11px] md:text-xs flex items-center gap-1.5 backdrop-blur-md transition-all">
              <Bed size={12} /> {t("ಪಿಜಿ", "PGs")}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
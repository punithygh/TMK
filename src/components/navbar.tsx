"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Mic, Megaphone, UserCircle, Hexagon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext"; // 🚨 1. ಹೊಸ ಗ್ಲೋಬಲ್ ಸ್ಟೇಟ್ ಹುಕ್

export default function Navbar() {
  const router = useRouter();
  
  // 🚨 2. ಸ್ವಂತ useState ಬದಲು ಗ್ಲೋಬಲ್ context ಬಳಸುತ್ತಿದ್ದೇವೆ
  const { lang, setLang, t } = useLanguage(); 

  const [searchQuery, setSearchQuery] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [isListening, setIsListening] = useState(false);

  // 🚨 ಗಮನಿಸಿ: ಇಲ್ಲಿಂದ Cookie useEffect ಅನ್ನು ತೆಗೆಯಲಾಗಿದೆ, ಏಕೆಂದರೆ LanguageContext ಅದನ್ನು ನೋಡಿಕೊಳ್ಳುತ್ತದೆ.

  // 🚨 3. React-based Typing Effect for Search Bar
  useEffect(() => {
    const phrases =
      lang === "kn"
        ? ["ತುಮಕೂರಿನಲ್ಲಿ ಹುಡುಕಿ...", "ಹೋಟೆಲ್‌ಗಳನ್ನು ಹುಡುಕಿ...", "ಆಸ್ಪತ್ರೆಗಳನ್ನು ಹುಡುಕಿ..."]
        : ["Search in Tumkur...", "Search for Hotels...", "Search for Hospitals..."];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingTimer: NodeJS.Timeout;

    const type = () => {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        setPlaceholder(currentPhrase.substring(0, charIndex - 1) + "|");
        charIndex--;
      } else {
        setPlaceholder(currentPhrase.substring(0, charIndex + 1) + "|");
        charIndex++;
      }

      let typeSpeed = isDeleting ? 50 : 100;

      if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
      }

      typingTimer = setTimeout(type, typeSpeed);
    };

    type();
    return () => clearTimeout(typingTimer);
  }, [lang]);

  // 🚨 4. Web Speech API (Voice Search)
  const handleVoiceSearch = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = lang === "kn" ? "kn-IN" : "en-IN";
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setPlaceholder(lang === "kn" ? "ಆಲಿಸುತ್ತಿದೆ..." : "Listening...");
      };

      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setSearchQuery(transcript);
        router.push(`/listings?q=${encodeURIComponent(transcript)}`);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert(lang === "kn" ? "ನಿಮ್ಮ ಬ್ರೌಸರ್ ವಾಯ್ಸ್ ಸರ್ಚ್ ಬೆಂಬಲಿಸುವುದಿಲ್ಲ." : "Voice search not supported.");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/listings?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 w-full z-[9999] bg-[#050b14]/95 backdrop-blur-md border-b border-slate-800 shadow-lg pt-safe-top">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-4 py-3 gap-y-3 md:gap-y-0 max-w-[1400px] mx-auto">
        
        {/* 🌟 MOBILE ROW 1: Logo & Lang Switcher */}
        <div className="flex md:hidden items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-2 no-underline group">
            <div className="bg-gradient-to-br from-sky-500 to-sky-400 w-8 h-8 rounded-lg flex items-center justify-center shadow-md shadow-sky-500/30 shrink-0">
              <Hexagon className="text-white w-5 h-5 fill-white/20" />
            </div>
            <div className="font-extrabold text-[22px] text-white tracking-tight uppercase whitespace-nowrap">
              TUMAKURU<span className="text-sky-400">CONNECT</span>
            </div>
          </Link>
          
          <div className="flex bg-slate-800 rounded-full p-1 border border-slate-700 shrink-0">
            {/* 🚨 ಇಲ್ಲಿ ನೇರವಾಗಿ setLang(newLang) ಕರೆಯಲಾಗಿದೆ, window.location.reload() ಇಲ್ಲ! */}
            <button onClick={() => setLang("kn")} className={`w-7 h-7 rounded-full text-xs font-bold transition-all flex items-center justify-center ${lang === "kn" ? "bg-sky-500 text-white shadow-md shadow-sky-500/40" : "text-slate-400 hover:text-white"}`}>ಕ</button>
            <button onClick={() => setLang("en")} className={`w-7 h-7 rounded-full text-xs font-bold transition-all flex items-center justify-center ${lang === "en" ? "bg-sky-500 text-white shadow-md shadow-sky-500/40" : "text-slate-400 hover:text-white"}`}>E</button>
          </div>
        </div>

        {/* 🖥️ DESKTOP LOGO */}
        <div className="hidden md:flex items-center justify-start w-auto shrink-0">
          <Link href="/" className="flex items-center gap-3 no-underline group">
            <div className="bg-gradient-to-br from-sky-500 to-sky-400 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/30 shrink-0 group-hover:scale-105 transition-transform">
              <Hexagon className="text-white w-6 h-6 fill-white/20" />
            </div>
            <div className="flex flex-col justify-center leading-none">
              <div className="text-2xl font-black text-white tracking-tight uppercase whitespace-nowrap">
                TUMAKURU<span className="text-sky-400">CONNECT</span>
              </div>
              <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-widest mt-1">
                Local Search Engine
              </div>
            </div>
          </Link>
        </div>

        {/* 🔍 SEARCH BAR (Mobile & Desktop Unified) */}
        <div className="flex w-full md:absolute md:left-1/2 md:-translate-x-1/2 md:max-w-[400px]">
          <form onSubmit={handleSearchSubmit} className="w-full relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full h-10 md:h-11 pl-10 pr-12 rounded-full border border-slate-700 bg-slate-800/80 text-white text-sm outline-none transition-all focus:border-sky-500 focus:shadow-[0_0_12px_rgba(14,165,233,0.2)] placeholder:text-slate-400"
              required
            />
            <button
              type="button"
              onClick={handleVoiceSearch}
              className={`absolute right-3 p-1.5 rounded-full transition-colors flex items-center justify-center ${isListening ? "text-red-500 bg-red-500/10" : "text-sky-400 hover:bg-sky-500/10"}`}
              aria-label="Voice Search"
            >
              <Mic className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* 🖥️ DESKTOP RIGHT ACTIONS */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          <Link href="/free-listing" className="flex items-center gap-2 py-2 px-4 rounded-lg font-semibold text-sm transition-all bg-transparent text-white border border-slate-700 hover:bg-slate-800 hover:border-sky-400 hover:text-sky-400">
            <Megaphone className="w-4 h-4" />
            {/* 🚨 t() helper ಫಂಕ್ಷನ್ ಬಳಕೆ (ಆಯ್ಕೆ) ಅಥವಾ ನೇರ ಟೆನರಿ ಆಪರೇಟರ್ */}
            <span>{t("ಉಚಿತ ಲಿಸ್ಟಿಂಗ್", "Free Listing")}</span>
          </Link>
          
          <Link href="/login" className="flex items-center gap-2 py-2 px-4 rounded-lg font-semibold text-sm transition-all bg-sky-500 text-white border-none hover:bg-sky-400 hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5">
            <UserCircle className="w-4 h-4" />
            <span>{t("ಲಾಗಿನ್", "Login")}</span>
          </Link>
          
          {/* Desktop Lang Switch */}
          <div className="flex bg-slate-800 rounded-full p-1 border border-slate-700">
            <button onClick={() => setLang("kn")} className={`w-8 h-8 rounded-full text-xs font-bold transition-all flex items-center justify-center ${lang === "kn" ? "bg-sky-500 text-white shadow-md" : "text-slate-400 hover:text-white"}`}>ಕ</button>
            <button onClick={() => setLang("en")} className={`w-8 h-8 rounded-full text-xs font-bold transition-all flex items-center justify-center ${lang === "en" ? "bg-sky-500 text-white shadow-md" : "text-slate-400 hover:text-white"}`}>E</button>
          </div>
        </div>

      </div>
    </nav>
  );
}
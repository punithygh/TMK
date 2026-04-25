"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, Mic, Megaphone, UserCircle, Hexagon, LogOut, LayoutDashboard, Sun, Moon, Menu, X, Layers, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  
  const { lang, setLang, t } = useLanguage(); 
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [isListening, setIsListening] = useState(false);

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 50 || currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        setIsVisible(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

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
        setIsSearchOverlayOpen(false);
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
      setIsSearchOverlayOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 w-full z-[9999] bg-white/95 dark:bg-[#050b14]/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 shadow-sm dark:shadow-lg pt-safe-top transition-transform duration-500 ease-in-out ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-4 py-3 gap-y-3 md:gap-y-0 max-w-[1400px] mx-auto">
        
        {/* 🌟 MOBILE ROW 1: Logo & Lang Switcher/Search & Menu */}
        <div className="flex md:hidden items-center justify-between w-full">
          <Link href="/" className="flex items-center no-underline group shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="font-black text-[26px] tracking-tighter whitespace-nowrap flex items-center">
              <span className="text-slate-900 dark:text-white drop-shadow-sm">Tumkur</span>
              <div className="relative ml-[1px] flex flex-col justify-end">
                <span className="text-red-600 dark:text-sky-400 italic -skew-x-7 drop-shadow-[0_0_12px_rgba(220,38,38,0.4)] dark:drop-shadow-[0_0_12px_rgba(14,165,233,0.8)]">
                  connect
                </span>
                <div className="absolute bottom-[5px] left-0 w-full h-[2px] rounded-full bg-red-600 dark:bg-sky-400 shadow-[0_0_15px_rgba(220,38,38,0.5)] dark:shadow-[0_0_15px_rgba(14,165,233,1)]"></div>
              </div>
            </div>
          </Link>
          
          <div className="flex items-center gap-2 shrink-0">
            {isHomePage ? (
              mounted ? (
                <div 
                  className="relative flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-full p-1 border border-slate-200 dark:border-slate-700/50 shadow-inner w-[60px] h-8 cursor-pointer shrink-0" 
                  onClick={() => setLang(lang === 'kn' ? 'en' : 'kn')}
                >
                  <div className={`absolute top-1 bottom-1 w-[24px] bg-gradient-to-r from-red-500 to-red-600 dark:from-sky-500 dark:to-blue-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.3)] dark:shadow-[0_0_10px_rgba(14,165,233,0.5)] transition-all duration-300 ease-in-out ${lang === 'kn' ? 'left-1' : 'left-[32px]'}`} />
                  <span className={`relative z-10 w-1/2 text-center text-[10px] font-bold transition-colors duration-300 ${lang === 'kn' ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>ಕ</span>
                  <span className={`relative z-10 w-1/2 text-center text-[10px] font-bold transition-colors duration-300 ${lang === 'en' ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>EN</span>
                </div>
              ) : (
                <div className="w-[60px] h-8 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse"></div>
              )
            ) : (
              <button 
                onClick={() => setIsSearchOverlayOpen(true)}
                className="p-1.5 rounded-full bg-red-50 dark:bg-sky-500/10 text-gray-700 border border-red-200 dark:border-sky-500/20 hover:bg-red-100 dark:hover:bg-sky-500/20 transition-colors shadow-sm"
                aria-label="Open Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-lg bg-white hover:bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-slate-300 border border-gray-200 dark:border-slate-700 shadow-sm transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* 🖥️ DESKTOP LOGO */}
        <div className="hidden md:flex items-center justify-start w-auto shrink-0">
          <Link href="/" className="flex flex-col justify-center leading-none no-underline group">
            <div className="font-black text-[28px] tracking-tighter whitespace-nowrap flex items-center group-hover:scale-[1.02] transition-transform duration-300">
              <span className="text-slate-900 dark:text-white drop-shadow-sm">Tumkur</span>
              <div className="relative ml-[2px] flex flex-col justify-end">
                <span className="text-red-600 dark:text-sky-400 italic -skew-x-7 drop-shadow-[0_0_12px_rgba(220,38,38,0.4)] dark:drop-shadow-[0_0_12px_rgba(14,165,233,0.8)]">
                  connect
                </span>
                <div className="absolute -bottom-[1px] left-0 w-full h-[2.5px] rounded-full bg-red-600 dark:bg-sky-400 shadow-[0_0_15px_rgba(220,38,38,0.5)] dark:shadow-[0_0_15px_rgba(14,165,233,1)]"></div>
              </div>
            </div>
            <div className="w-full ml-[100px] pr10 mt-2 text-[10px] text-slate-500 dark:text-slate-400 font-bold lowercase tracking-widest group-hover:text-red-600 dark:group-hover:text-sky-500 transition-colors duration-300">
              Local Business Engine
            </div>
          </Link>
        </div>

        {/* 🔍 SEARCH BAR (Desktop Only - Hidden on Mobile) */}
        <div className="hidden md:flex w-full md:absolute md:left-1/2 md:-translate-x-1/2 md:max-w-[400px]">
          <form onSubmit={handleSearchSubmit} className="w-full relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-red-600 dark:text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full h-10 md:h-11 pl-10 pr-12 rounded-full border border-red-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-gray-900 dark:text-white text-sm outline-none transition-all focus:border-red-600 dark:focus:border-sky-500 shadow-inner placeholder:text-gray-400"
              required
            />
            <button
              type="button"
              onClick={handleVoiceSearch}
              className={`absolute right-3 p-1.5 rounded-full transition-colors flex items-center justify-center ${isListening ? "text-red-500 bg-red-500/10" : "text-red-600 hover:bg-red-50 dark:text-sky-400 dark:hover:bg-sky-500/10"}`}
              aria-label="Voice Search"
            >
              <Mic className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* 🖥️ DESKTOP RIGHT ACTIONS */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          {mounted ? (
            <>
              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full bg-white border border-gray-200 dark:bg-slate-800/50 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Add Business Link (Replaced Free Listing) */}
              <Link href="/add-business" className="flex items-center gap-2 py-2 px-4 rounded-lg font-semibold text-sm transition-all bg-transparent text-slate-700 dark:text-white border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-red-600 dark:hover:border-sky-400 hover:text-red-600 dark:hover:text-sky-400">
                <Megaphone className="w-4 h-4" />
                <span>{t("ಬ್ಯುಸಿನೆಸ್ ಸೇರಿಸಿ", "Add Business")}</span>
              </Link>
              
              {/* Auth User Profile / Login */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 py-1.5 px-3 rounded-full font-semibold text-sm transition-all bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-red-400 dark:hover:border-sky-400 text-slate-700 dark:text-white"
                  >
                    <div className="w-6 h-6 rounded-full bg-red-600 dark:bg-sky-500 flex items-center justify-center text-white text-xs font-bold uppercase">
                      {user.first_name.charAt(0)}
                    </div>
                    <span className="max-w-[80px] truncate">{user.first_name}</span>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 text-slate-800 dark:text-slate-200">
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Signed in as</p>
                        <p className="text-sm font-bold truncate">{user.mobile}</p>
                      </div>
                      <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-red-600 dark:hover:text-sky-400 transition-colors">
                        <LayoutDashboard className="w-4 h-4" /> {t("ಡ್ಯಾಶ್ಬೋರ್ಡ್", "Dashboard")}
                      </Link>
                      <button onClick={() => { logout(); setIsDropdownOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300 transition-colors text-left">
                        <LogOut className="w-4 h-4" /> {t("ಲಾಗ್ ಔಟ್", "Logout")}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="flex items-center gap-2 py-2 px-4 rounded-lg font-semibold text-sm transition-colors bg-red-600 dark:bg-sky-600 text-white border-none hover:bg-red-700 dark:hover:bg-sky-700 shadow-sm">
                  <UserCircle className="w-4 h-4" />
                  <span>{t("ಲಾಗಿನ್", "Login")}</span>
                </Link>
              )}
              
              {/* Language Switcher */}
              <div 
                className="relative flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-full p-1 border border-slate-200 dark:border-slate-700/50 shadow-inner w-[76px] h-10 cursor-pointer shrink-0" 
                onClick={() => setLang(lang === 'kn' ? 'en' : 'kn')}
              >
                <div className={`absolute top-1 bottom-1 w-[32px] bg-gradient-to-r from-red-500 to-red-600 dark:from-sky-500 dark:to-blue-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.3)] dark:shadow-[0_0_10px_rgba(14,165,233,0.5)] transition-all duration-300 ease-in-out ${lang === 'kn' ? 'left-1' : 'left-[39px]'}`} />
                <span className={`relative z-10 w-1/2 text-center text-xs font-bold transition-colors duration-300 ${lang === 'kn' ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>ಕ</span>
                <span className={`relative z-10 w-1/2 text-center text-xs font-bold transition-colors duration-300 ${lang === 'en' ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>E</span>
              </div>
            </>
          ) : (
            /* Hydration Mismatch ತಡೆಯಲು Skeleton Loader */
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse"></div>
              <div className="w-32 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse"></div>
              <div className="w-24 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse"></div>
              <div className="w-[76px] h-10 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      </div>

      {/* 📱 MOBILE OFFCANVAS MENU */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-white dark:bg-[#050b14] border-b border-slate-200 dark:border-slate-800 shadow-xl transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-[400px] py-4 opacity-100' : 'max-h-0 py-0 border-none opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col px-4 gap-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{t("ಥೀಮ್ ಬದಲಾಯಿಸಿ", "Change Theme")}</span>
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="py-1.5 px-3 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-colors hover:bg-slate-300 dark:hover:bg-slate-600"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span className="text-xs font-bold">{theme === 'dark' ? 'Day Mode' : 'Night Mode'}</span>
              </button>
            )}
          </div>
          <Link href="/add-business" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-sky-400">
            <Megaphone className="w-5 h-5 text-red-600 dark:text-sky-500" />
            <span className="text-sm font-bold">{t("ಬ್ಯುಸಿನೆಸ್ ಸೇರಿಸಿ", "Add Business")}</span>
          </Link>
          <Link href="/categories" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-sky-400">
            <Layers className="w-5 h-5 text-red-600 dark:text-sky-500" />
            <span className="text-sm font-bold">{t("ವರ್ಗಗಳು", "Categories")}</span>
          </Link>
          {mounted && isAuthenticated && user ? (
            <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-sky-500/10 border border-red-100 dark:border-sky-500/20 text-red-600 dark:text-sky-400">
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-sm font-bold">{t("ಡ್ಯಾಶ್ಬೋರ್ಡ್", "Dashboard")}</span>
            </Link>
          ) : mounted ? (
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl bg-red-600 dark:bg-gradient-to-r dark:from-sky-500 dark:to-blue-600 text-white shadow-lg shadow-red-600/30 dark:shadow-sky-500/30">
              <UserCircle className="w-5 h-5" />
              <span className="text-sm font-bold">{t("ಲಾಗಿನ್", "Login")}</span>
            </Link>
          ) : null}
        </div>
      </div>

      {/* 📱 🚨 MOBILE FULL-SCREEN SEARCH OVERLAY (YELP STYLE) 🚨 */}
      <div className={`md:hidden fixed inset-0 z-[100000] bg-white dark:bg-[#050b14] transition-transform duration-300 ease-in-out flex flex-col ${isSearchOverlayOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}>
        <div className="flex items-center gap-3 p-4 bg-white dark:bg-[#050b14] border-b border-slate-200 dark:border-slate-800 shadow-sm pt-safe-top">
          <button 
            type="button"
            onClick={() => setIsSearchOverlayOpen(false)}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <form 
            onSubmit={handleSearchSubmit} 
            className="flex-1 relative flex items-center"
          >
            <input
              type="text"
              autoFocus={isSearchOverlayOpen}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === "kn" ? "ಹುಡುಕಿ..." : "Search in Tumkur..."}
              className="w-full h-11 pl-4 pr-12 rounded-full border border-red-500/30 dark:border-sky-500/30 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-base outline-none shadow-[0_0_10px_rgba(220,38,38,0.1)] dark:shadow-[0_0_10px_rgba(14,165,233,0.1)] focus:border-red-600 dark:focus:border-sky-500"
            />
            <button
              type="button"
              onClick={handleVoiceSearch}
              className={`absolute right-2 p-2 rounded-full transition-colors flex items-center justify-center ${isListening ? "text-red-500 bg-red-500/10" : "text-red-600 dark:text-sky-500"}`}
            >
              <Mic className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
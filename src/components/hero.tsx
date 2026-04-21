"use client";

import { useState, useEffect } from "react";
import { Search, Hotel, Hospital, Bed, MapPin } from "lucide-react";

const Hero = () => {
  const [placeholder, setPlaceholder] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);

  const phrases = [
    "ಹೋಟೆಲ್ ಹುಡುಕಿ...",
    "ಪಿಜಿ (PG) ಹುಡುಕಿ...",
    "ವೈದ್ಯರನ್ನು ಹುಡುಕಿ...",
    "Search for Hotels...",
    "Search for PGs..."
  ];

  // 🚨 Premium Feature: Typewriter Effect Logic (Legacy JS to React)
  useEffect(() => {
    const handleType = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];

      setPlaceholder(
        isDeleting
          ? fullText.substring(0, placeholder.length - 1)
          : fullText.substring(0, placeholder.length + 1)
      );

      setTypingSpeed(isDeleting ? 50 : 100);

      if (!isDeleting && placeholder === fullText) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && placeholder === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [placeholder, isDeleting, loopNum, typingSpeed]);

  return (
    <section className="relative min-h-[450px] flex items-center justify-center py-20 overflow-hidden">
      {/* 1. Dynamic Background with Gradient Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10s] hover:scale-110"
        style={{ 
          backgroundImage: `linear-gradient(180deg, rgba(5, 11, 20, 0.7) 0%, rgba(5, 11, 20, 0.95) 100%), url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1920&q=80')` 
        }}
      />

      <div className="mobile-container relative z-10 text-center space-y-8">
        {/* 2. Main Title */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
            ತುಮಕೂರಿನ ಎಲ್ಲವೂ.. <br />
            <span className="text-blue-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">
              ಒಂದೇ ಕ್ಲಿಕ್‌ನಲ್ಲಿ.
            </span>
          </h1>
        </div>

        {/* 3. Premium Search Container */}
        <div className="max-w-2xl mx-auto w-full group">
          <form className="flex items-center bg-white rounded-2xl p-1.5 shadow-2xl shadow-blue-500/20 border-2 border-transparent focus-within:border-blue-400 transition-all duration-300">
            <input
              type="text"
              placeholder={placeholder}
              className="flex-grow bg-transparent px-4 py-3 text-slate-900 outline-none font-medium placeholder:text-slate-400"
            />
            <button className="btn-primary rounded-xl px-4 md:px-8 flex items-center gap-2">
              <Search size={20} />
              <span className="hidden md:inline">ಹುಡುಕಿ</span>
            </button>
          </form>

          {/* 4. Quick Chips (Popular Searches) */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Popular:</span>
            <button className="quick-chip bg-white/10 hover:bg-blue-600 text-white border border-white/10 rounded-full px-4 py-1.5 text-sm flex items-center gap-2 backdrop-blur-md transition-all">
              <Hotel size={14} /> ಹೋಟೆಲ್
            </button>
            <button className="quick-chip bg-white/10 hover:bg-blue-600 text-white border border-white/10 rounded-full px-4 py-1.5 text-sm flex items-center gap-2 backdrop-blur-md transition-all">
              <Bed size={14} /> ಪಿಜಿ
            </button>
            <button className="quick-chip bg-white/10 hover:bg-blue-600 text-white border border-white/10 rounded-full px-4 py-1.5 text-sm flex items-center gap-2 backdrop-blur-md transition-all">
              <Hospital size={14} /> ಆಸ್ಪತ್ರೆ
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
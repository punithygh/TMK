"use client";

import React, { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Check if already dismissed in this session or installed
    const isDismissed = sessionStorage.getItem("pwa_prompt_dismissed");
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    if (isDismissed || isStandalone) {
      return;
    }

    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Delay showing prompt so it's not too aggressive
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setShowPrompt(false);
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem("pwa_prompt_dismissed", "true");
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 md:bottom-24 left-4 right-4 md:left-auto md:right-8 md:w-80 z-[99999] animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xl flex items-center gap-4 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 blur-3xl rounded-full pointer-events-none"></div>
        
        {/* App Icon placeholder */}
        <div className="w-12 h-12 bg-sky-100 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 rounded-xl flex items-center justify-center shrink-0 border border-sky-200 dark:border-sky-500/30">
          <Download size={22} />
        </div>
        
        <div className="flex-1 pr-6">
          <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-0.5">
            {t("ಆ್ಯಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ", "Install App")}
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
            {t("ವೇಗದ ಹಾಗೂ ಸುಲಭ ಬಳಕೆಗಾಗಿ ಹೋಮ್ ಸ್ಕ್ರೀನ್‌ಗೆ ಸೇರಿಸಿ.", "Add to home screen for faster access.")}
          </p>
        </div>
        
        <div className="flex flex-col gap-2 shrink-0">
          <button 
            onClick={handleInstallClick}
            className="bg-sky-500 hover:bg-sky-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm"
          >
            {t("ಸೇರಿಸಿ", "Install")}
          </button>
        </div>

        <button 
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-colors"
        >
          <X size={12} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}

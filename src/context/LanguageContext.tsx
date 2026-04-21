"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Language = "kn" | "en";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (knText: string | null | undefined, enText: string | null | undefined) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("kn");
  const router = useRouter();

  // ಪೇಜ್ ಲೋಡ್ ಆದಾಗ ಕುಕಿಯಿಂದ ಭಾಷೆ ಓದುವುದು
  useEffect(() => {
    if (typeof document !== "undefined") {
      const match = document.cookie.match(new RegExp('(^| )NEXT_LOCALE=([^;]+)'));
      const oldMatch = document.cookie.match(new RegExp('(^| )googtrans=([^;]+)'));
      if (match) {
        setLangState(match[2] as Language);
      } else if (oldMatch) {
        const val = oldMatch[2];
        if (val.includes('/en') || val === 'en') setLangState("en");
        else setLangState("kn");
      }
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    // Modern Next.js cookie standard
    document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000;`;
    // Backward compatibility for existing old code
    document.cookie = `googtrans=/en/${newLang}; path=/; max-age=31536000;`;
    
    // 🚨 Next.js 15: Instantly reload Server & Client Components to fetch new lang data
    router.refresh();
  };

  // 🚨 SMART HELPER: ಕನ್ನಡ ಟೆಕ್ಸ್ಟ್ ಇಲ್ಲದಿದ್ದರೆ ಆಟೋಮ್ಯಾಟಿಕ್ ಆಗಿ ಇಂಗ್ಲಿಷ್ ತೋರಿಸುವ ಫಂಕ್ಷನ್
  const t = (knText: string | null | undefined, enText: string | null | undefined) => {
    if (lang === "kn" && knText && knText.trim() !== "") return knText;
    return enText || ""; // ಕನ್ನಡ ಇಲ್ಲದಿದ್ದರೆ ಅಥವಾ ಇಂಗ್ಲಿಷ್ ಆಯ್ಕೆಯಾಗಿದ್ದರೆ ಇಂಗ್ಲಿಷ್ ಬರುತ್ತದೆ
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
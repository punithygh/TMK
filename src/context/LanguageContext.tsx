"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "kn" | "en";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (knText: string | null | undefined, enText: string | null | undefined) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("kn");

  // ಪೇಜ್ ಲೋಡ್ ಆದಾಗ ಕುಕಿಯಿಂದ ಭಾಷೆ ಓದುವುದು
  useEffect(() => {
    if (typeof document !== "undefined") {
      const match = document.cookie.match(new RegExp('(^| )googtrans=([^;]+)'));
      if (match) {
        const val = match[2];
        if (val.includes('/en') || val === 'en') setLangState("en");
        else setLangState("kn");
      }
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    document.cookie = `googtrans=/en/${newLang}; path=/; max-age=31536000;`;
    // 🚨 ಗಮನಿಸಿ: ಇಲ್ಲಿ ನಾವು window.location.reload() ತೆಗೆದಿದ್ದೇವೆ. 
    // ರಿಯಾಕ್ಟ್ ಸ್ಟೇಟ್ ಬದಲಾದ ತಕ್ಷಣ ಇಡೀ ಆ್ಯಪ್ ಆಟೋಮ್ಯಾಟಿಕ್ ಆಗಿ ಅಪ್‌ಡೇಟ್ ಆಗುತ್ತದೆ!
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
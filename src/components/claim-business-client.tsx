"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { BusinessListing } from "@/services/courses";
import { ShieldCheck, Store, CheckCircle2, Send, Info } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface ClaimBusinessClientProps {
  business: BusinessListing;
}

const getValidImageUrl = (url?: string | null) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  return `${backendUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

export default function ClaimBusinessClient({ business }: ClaimBusinessClientProps) {
  const { lang, t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [imgError, setImgError] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const title = lang === 'kn' && business.name_kn ? business.name_kn : business.name;
  const category = lang === 'kn' && business.category_name_kn ? business.category_name_kn : business.category_name;
  const area = lang === 'kn' && business.area_kn ? business.area_kn : business.area;
  const imgSrc = getValidImageUrl(business.main_image_upload || business.image_url);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to Django API: path('businesses/<int:business_id>/claim/')
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[80vh] bg-[#050b14] flex items-center justify-center p-4 md:p-[5%]">
        <div className="bg-[#0c1220] border border-emerald-500/30 p-8 md:p-12 rounded-2xl max-w-[600px] w-full text-center shadow-2xl shadow-emerald-500/10 animate-in zoom-in duration-500">
          <CheckCircle2 size={80} className="text-emerald-500 mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {t("ಕ್ಲೈಮ್ ವಿನಂತಿಯನ್ನು ಕಳುಹಿಸಲಾಗಿದೆ!", "Claim Request Submitted!")}
          </h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            {t(
              "ನಿಮ್ಮ ವಿನಂತಿಯನ್ನು ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ನಮ್ಮ ತಂಡವು ಶೀಘ್ರದಲ್ಲೇ ಪರಿಶೀಲಿಸಿ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತದೆ.", 
              "We have received your claim request. Our team will verify the details and contact you shortly."
            )}
          </p>
          <Link 
            href={`/business/${business.business_area_slug || business.slug}`}
            className="inline-block bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-sky-500/20"
          >
            {t("ಬ್ಯಾಕ್ ಟು ಬ್ಯುಸಿನೆಸ್", "Back to Business")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050b14] pt-10 pb-20 px-4 md:px-[5%] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-[600px] h-[500px] bg-sky-500/5 rounded-full blur-[150px] -z-10"></div>

      <div className="max-w-[700px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-[#0c1220] border border-slate-800 rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-black text-white mb-3">
              {t("ಬ್ಯುಸಿನೆಸ್ ಕ್ಲೈಮ್ ವಿನಂತಿ", "Business Claim Request")}
            </h1>
            <p className="text-slate-400 text-sm md:text-base font-medium">
              {t(
                "ಈ ಬ್ಯುಸಿನೆಸ್‌ನ ಮಾಲೀಕತ್ವವನ್ನು ದೃಢೀಕರಿಸಿ ಮತ್ತು ವಿಶೇಷ ಪ್ರಯೋಜನಗಳನ್ನು ಪಡೆಯಿರಿ", 
                "Verify your ownership of this business and get exclusive benefits"
              )}
            </p>
          </div>

          {/* Business Info Card */}
          <div className="bg-[#050b14] border border-slate-700 rounded-2xl p-4 flex items-center gap-4 mb-8">
            <div className="relative w-20 h-20 shrink-0 bg-slate-800 rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center">
              {imgSrc && !imgError ? (
                <Image src={imgSrc} alt={title || ""} fill className="object-cover" onError={() => setImgError(true)} />
              ) : (
                <Store className="text-slate-600" size={32} />
              )}
            </div>
            <div>
              <h3 className="text-white font-bold text-lg leading-tight mb-1">{title}</h3>
              <p className="text-sky-400 text-xs font-semibold uppercase tracking-wide mb-1">{category}</p>
              <p className="text-slate-400 text-sm">{area}, {t("ತುಮಕೂರು", "Tumkur")}</p>
            </div>
          </div>

          {!isAuthenticated ? (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 text-center mb-8">
              <Info className="text-amber-500 mx-auto mb-3" size={32} />
              <h3 className="text-white font-bold mb-2">
                {t("ಲಾಗಿನ್ ಅಗತ್ಯವಿದೆ", "Login Required")}
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                {t(
                  "ನಿಮ್ಮ ಬ್ಯುಸಿನೆಸ್ ಅನ್ನು ಕ್ಲೈಮ್ ಮಾಡಲು ನೀವು ಲಾಗಿನ್ ಆಗಿರಬೇಕು.", 
                  "You must be logged in to claim a business."
                )}
              </p>
              <Link 
                href={`/login?redirect=/claim-business/${business.business_area_slug || business.slug}`}
                className="inline-block bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold py-2.5 px-6 rounded-xl transition-all"
              >
                {t("ಲಾಗಿನ್ ಮಾಡಿ", "Login Now")}
              </Link>
            </div>
          ) : (
            <>
              {/* Requirements */}
              <div className="bg-sky-500/5 border border-sky-500/20 rounded-2xl p-6 mb-8">
                <h3 className="text-sky-400 font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                  <ShieldCheck size={18} />
                  {t("ಪರಿಶೀಲನೆಗಾಗಿ ಅವಶ್ಯಕತೆಗಳು", "Requirements for Verification")}
                </h3>
                <ul className="text-slate-300 text-sm space-y-2 list-disc list-inside marker:text-sky-500">
                  <li>{t("ನೀವು ಕಾನೂನುಬದ್ಧ ಮಾಲೀಕರಾಗಿರಬೇಕು", "You must be the legal owner or authorized representative")}</li>
                  <li>{t("ಮಾನ್ಯವಾದ ಸಂಪರ್ಕ ಮಾಹಿತಿಯನ್ನು ಒದಗಿಸಿ", "Provide valid contact information")}</li>
                  <li>{t("ಮಾಲೀಕತ್ವದ ಪುರಾವೆ ಸಲ್ಲಿಸಿ", "Submit proof of ownership or authorization")}</li>
                  <li>{t("ಬ್ಯುಸಿನೆಸ್ ಮಾಹಿತಿ ನಿಖರವಾಗಿರಬೇಕು", "Business information must be accurate and up-to-date")}</li>
                </ul>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-300">
                    {t("ಸಂಪರ್ಕ ಮಾಹಿತಿ", "Contact Information")} <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-[#050b14] border border-slate-700 text-white px-4 py-3.5 rounded-xl outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-600 font-medium"
                    placeholder={t("ಇಮೇಲ್ ಅಥವಾ ಫೋನ್ ನಂಬರ್", "Email or Phone Number")}
                  />
                  <p className="text-xs text-slate-500">
                    {t("ನಿಮ್ಮ ಗುರುತನ್ನು ಪರಿಶೀಲಿಸಲು ನಾವು ಇದನ್ನು ಬಳಸುತ್ತೇವೆ", "We'll use this to verify your identity")}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-300">
                    {t("ಮಾಲೀಕತ್ವದ ಪುರಾವೆ / ಹೆಚ್ಚುವರಿ ವಿವರಗಳು", "Proof of Ownership / Additional Details")} <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    required
                    rows={5}
                    className="w-full bg-[#050b14] border border-slate-700 text-white px-4 py-3.5 rounded-xl outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-600 resize-none leading-relaxed"
                    placeholder={t(
                      "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಮಾಲೀಕತ್ವದ ಬಗ್ಗೆ ವಿವರಗಳನ್ನು ಒದಗಿಸಿ, ಉದಾಹರಣೆಗೆ:\n- ಬ್ಯುಸಿನೆಸ್ ನೋಂದಣಿ ಸಂಖ್ಯೆ\n- GST ಸಂಖ್ಯೆ\n- ವೆಬ್‌ಸೈಟ್ ಅಥವಾ ಸೋಷಿಯಲ್ ಮೀಡಿಯಾ ಲಿಂಕ್‌ಗಳು", 
                      "Please provide details about your ownership, such as:\n- Business registration number\n- GST number\n- Website or social media links"
                    )}
                  ></textarea>
                  <p className="text-xs text-slate-500">
                    {t("ಹೆಚ್ಚಿನ ವಿವರಗಳು ನಿಮ್ಮ ಕ್ಲೈಮ್ ಅನ್ನು ವೇಗವಾಗಿ ಪರಿಶೀಲಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ", "More details help us verify your claim faster")}
                  </p>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-8 shadow-lg shadow-sky-500/20 group"
                >
                  <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                  {t("ಕ್ಲೈಮ್ ವಿನಂತಿಯನ್ನು ಸಲ್ಲಿಸಿ", "Submit Claim Request")}
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

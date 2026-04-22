"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Megaphone, Plus, Trash2, Send, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function AddBusinessPage() {
  const { lang, t } = useLanguage();
  const [images, setImages] = useState<number[]>([Date.now()]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const addImageField = () => {
    setImages([...images, Date.now()]);
  };

  const removeImageField = (idToRemove: number) => {
    setImages(images.filter(id => id !== idToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to backend API when ready
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[80vh] bg-[#050b14] flex items-center justify-center p-4 md:p-[5%]">
        <div className="bg-[#0c1220] border border-emerald-500/30 p-8 md:p-12 rounded-2xl max-w-[600px] w-full text-center shadow-2xl shadow-emerald-500/10 animate-in zoom-in duration-500">
          <CheckCircle2 size={80} className="text-emerald-500 mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {t("ಧನ್ಯವಾದಗಳು!", "Thank You!")}
          </h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            {t(
              "ನಿಮ್ಮ ಬ್ಯುಸಿನೆಸ್ ಮಾಹಿತಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ. ನಮ್ಮ ತಂಡ ಪರಿಶೀಲಿಸಿದ ನಂತರ ಅದು ಲೈವ್ ಆಗುತ್ತದೆ.", 
              "Your business details have been submitted successfully. It will go live after our team reviews it."
            )}
          </p>
          <button 
            onClick={() => { setIsSubmitted(false); setImages([Date.now()]); }}
            className="bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-sky-500/20"
          >
            {t("ಇನ್ನೊಂದು ಬ್ಯುಸಿನೆಸ್ ಸೇರಿಸಿ", "Add Another Business")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050b14] pt-10 pb-20 px-4 md:px-[5%] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-[600px] h-[500px] bg-sky-500/5 rounded-full blur-[150px] -z-10"></div>

      <div className="max-w-[800px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-[#0c1220] border border-slate-800 rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Header */}
          <div className="text-center mb-10 border-b border-slate-800 pb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-3 flex items-center justify-center gap-3">
              <Megaphone className="text-sky-500" size={32} />
              {t("ನಿಮ್ಮ ಬ್ಯುಸಿನೆಸ್ ಸೇರಿಸಿ", "Add Your Business")}
            </h1>
            <p className="text-slate-400 text-sm md:text-base font-medium">
              {t(
                "ತುಮಕೂರಿನ ಅತಿ ವೇಗವಾಗಿ ಬೆಳೆಯುತ್ತಿರುವ ಡೈರೆಕ್ಟರಿಯಲ್ಲಿ ನಿಮ್ಮ ಬ್ಯುಸಿನೆಸ್ ಸೇರಿಸಿ. ಇದು 100% ಉಚಿತ!", 
                "Get listed on Tumkur's fastest-growing directory. It's 100% Free!"
              )}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Business Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">
                {t("ಬ್ಯುಸಿನೆಸ್ ಹೆಸರು (ಶಾಪ್ / ಸರ್ವೀಸ್ ಹೆಸರು) *", "Business Name (Shop / Service Name) *")}
              </label>
              <input 
                type="text" 
                required
                className="w-full bg-[#050b14] border border-slate-700 text-white px-4 py-3.5 rounded-xl outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-600 font-medium"
                placeholder={t("ಉದಾಹರಣೆಗೆ: ಶ್ರೀ ಸಾಯಿ ಹೋಟೆಲ್", "e.g., Sri Sai Hotel")}
              />
            </div>

            {/* Category & Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300">
                  {t("ಕ್ಯಾಟಗರಿ *", "Business Category *")}
                </label>
                <select required className="w-full bg-[#050b14] border border-slate-700 text-white px-4 py-3.5 rounded-xl outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all appearance-none cursor-pointer">
                  <option value="">{t("ಕ್ಯಾಟಗರಿ ಆಯ್ಕೆಮಾಡಿ", "Select Category")}</option>
                  <option value="hotel">{t("ಹೋಟೆಲ್ / ರೆಸ್ಟೋರೆಂಟ್", "Hotel / Restaurant")}</option>
                  <option value="hospital">{t("ಆಸ್ಪತ್ರೆ / ಕ್ಲಿನಿಕ್", "Hospital / Clinic")}</option>
                  <option value="pg">{t("ಪಿಜಿ (PG) / ಹಾಸ್ಟೆಲ್", "PG / Hostel")}</option>
                  <option value="education">{t("ಶಿಕ್ಷಣ / ಕೋಚಿಂಗ್", "Education / Coaching")}</option>
                  <option value="other">{t("ಇತರೆ", "Other")}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300">
                  {t("ಏರಿಯಾ / ಸ್ಥಳ *", "Area / Location *")}
                </label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-[#050b14] border border-slate-700 text-white px-4 py-3.5 rounded-xl outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-600"
                  placeholder={t("ಉದಾಹರಣೆಗೆ: ಬಿ.ಹೆಚ್. ರಸ್ತೆ", "e.g., B.H. Road")}
                />
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300">
                  {t("ಸಂಪರ್ಕ ಸಂಖ್ಯೆ *", "Contact Phone Number *")}
                </label>
                <input 
                  type="tel" 
                  required
                  className="w-full bg-[#050b14] border border-slate-700 text-white px-4 py-3.5 rounded-xl outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-600"
                  placeholder="+91 "
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300">
                  {t("ವಾಟ್ಸಾಪ್ ನಂಬರ್", "WhatsApp Number")}
                </label>
                <input 
                  type="tel" 
                  className="w-full bg-[#050b14] border border-slate-700 text-white px-4 py-3.5 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-600"
                  placeholder="+91 "
                />
              </div>
            </div>

            {/* Full Address */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">
                {t("ಪೂರ್ಣ ವಿಳಾಸ *", "Full Address *")}
              </label>
              <textarea 
                required
                rows={3}
                className="w-full bg-[#050b14] border border-slate-700 text-white px-4 py-3.5 rounded-xl outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-600 resize-none"
                placeholder={t("ನಿಮ್ಮ ಬ್ಯುಸಿನೆಸ್ ನ ಪೂರ್ಣ ವಿಳಾಸವನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ...", "Enter your full business address here...")}
              ></textarea>
            </div>

            {/* Images */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-300">
                {t("ಶಾಪ್/ಬ್ಯುಸಿನೆಸ್ ಫೋಟೋಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ", "Upload Shop/Business Photos")}
                <span className="text-slate-500 font-normal ml-2 text-xs">({t("ಬೆಂಬಲಿತ: JPG, PNG", "Supported: JPG, PNG")})</span>
              </label>
              
              <div className="space-y-3">
                {images.map((id, index) => (
                  <div key={id} className="flex gap-2 animate-in fade-in slide-in-from-top-2">
                    <input 
                      type="file" 
                      accept="image/*"
                      className="flex-1 bg-[#050b14] border border-slate-700 text-slate-300 px-4 py-2.5 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-sky-500/10 file:text-sky-400 hover:file:bg-sky-500/20 cursor-pointer"
                    />
                    {index === 0 ? (
                      <button 
                        type="button" 
                        onClick={addImageField}
                        className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white border border-emerald-500/20 px-4 rounded-xl transition-colors flex items-center justify-center shrink-0"
                      >
                        <Plus size={20} />
                      </button>
                    ) : (
                      <button 
                        type="button" 
                        onClick={() => removeImageField(id)}
                        className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 px-4 rounded-xl transition-colors flex items-center justify-center shrink-0"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-8 shadow-lg shadow-sky-500/20 group"
            >
              <Send size={18} className="group-hover:translate-x-1 transition-transform" />
              {t("ಸಲ್ಲಿಸಿ (Submit)", "Submit Listing")}
            </button>

          </form>

          {/* Trust Banner */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-center gap-3 text-slate-400 bg-slate-900/50 p-4 rounded-xl border-dashed">
            <ShieldCheck className="text-emerald-500 shrink-0" size={24} />
            <p className="text-xs md:text-sm font-medium">
              {t(
                "ಕ್ವಾಲಿಟಿ ಚೆಕ್: ಲೈವ್ ಆಗುವ ಮೊದಲು ನಿಮ್ಮ ಡೀಟೇಲ್ಸ್ ಅನ್ನು ನಮ್ಮ ತಂಡ ಪರಿಶೀಲಿಸುತ್ತದೆ.", 
                "Quality Check: Your listing will be reviewed by our team before going live."
              )}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

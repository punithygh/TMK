"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { MapPin, Mail, Phone, Send, MessageSquareText, CheckCircle2, AlertCircle } from "lucide-react";
import { submitContactMessage } from "@/services/user";

export default function ContactPage() {
  const { lang, t } = useLanguage();

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await submitContactMessage(formData);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" }); // Reset form
    } catch (error: any) {
      setSubmitStatus("error");
      setErrorMessage(error.response?.data?.message || (lang === 'kn' ? "ಏನೋ ತಪ್ಪಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ." : "Something went wrong. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. Header Section */}
      <div className="bg-slate-900 pt-28 pb-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-red-600/10 dark:bg-sky-500/10 blur-[100px]"></div>
          <div className="absolute bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[80px]"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-red-50 dark:bg-sky-500/10 rounded-2xl mb-6 shadow-inner border border-red-200 dark:border-sky-500/20">
            <MessageSquareText className="w-8 h-8 text-red-600 dark:text-sky-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
            {t("ನಮ್ಮನ್ನು ", "Get In ")}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600 dark:from-sky-400 dark:to-blue-500">
              {t("ಸಂಪರ್ಕಿಸಿ", "Touch")}
            </span>
          </h1>
          <p className="text-slate-300 text-base md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            {lang === "kn" 
              ? "ನಿಮ್ಮ ಬ್ಯುಸಿನೆಸ್ ಸೇರಿಸುವ ಬಗ್ಗೆ ಪ್ರಶ್ನೆಗಳಿವೆಯೇ? ಯಾವುದೇ ಸೇವೆ ಹುಡುಕಲು ಸಹಾಯ ಬೇಕೇ? ನಾವು ಇಲ್ಲಿದ್ದೇವೆ!" 
              : "Have questions about listing your business? Need help finding a service? We are here to help!"}
          </p>
        </div>
      </div>

      {/* 2. Main Content Section (Cards overlap the header) */}
      <div className="max-w-6xl mx-auto px-4 pb-20 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8">
          
          {/* Contact Info Sidebar */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex-1">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-8 border-b-2 border-red-600 dark:border-sky-500 inline-block pb-2">
                {t("ಸಂಪರ್ಕ ಮಾಹಿತಿ", "Contact Information")}
              </h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-sky-500/10 text-red-600 dark:text-sky-500 flex items-center justify-center shrink-0 shadow-sm border border-red-100 dark:border-sky-500/20">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-1">
                      {t("ವಿಳಾಸ", "Address")}
                    </h4>
                    <p className="text-slate-600 font-medium">Tumkur, Karnataka, India - 572101</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-sky-500/10 text-red-600 dark:text-sky-500 flex items-center justify-center shrink-0 shadow-sm border border-red-100 dark:border-sky-500/20">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-1">
                      {t("ಇಮೇಲ್ ಮಾಡಿ", "Email Us")}
                    </h4>
                    <a href="mailto:Punithygh@gmail.com" className="text-slate-600 dark:text-slate-400 font-medium hover:text-red-600 dark:hover:text-sky-500 transition-colors">
                      Punithygh@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-sky-500/10 text-red-600 dark:text-sky-500 flex items-center justify-center shrink-0 shadow-sm border border-red-100 dark:border-sky-500/20">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-1">
                      {t("ಕರೆ ಮಾಡಿ", "Call Us")}
                    </h4>
                    <a href="tel:+918553538505" className="text-slate-600 dark:text-slate-400 font-medium hover:text-red-600 dark:hover:text-sky-500 transition-colors">
                      +91 8553538505
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 h-full">
              <h3 className="text-2xl font-bold text-slate-800 mb-8">
                {t("ನಮಗೆ ಸಂದೇಶ ಕಳುಹಿಸಿ", "Send us a Message")}
              </h3>

              {submitStatus === "success" && (
                <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-emerald-800 font-bold">{t("ಯಶಸ್ವಿ!", "Success!")}</h4>
                    <p className="text-emerald-600 text-sm">
                      {lang === 'kn' ? "ಸಂದೇಶ ಕಳುಹಿಸಲಾಗಿದೆ! ನಾವು ಶೀಘ್ರದಲ್ಲೇ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತೇವೆ." : "Message Sent Successfully! We will contact you soon."}
                    </p>
                  </div>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-red-800 font-bold">{t("ದೋಷ", "Error")}</h4>
                    <p className="text-red-600 text-sm">{errorMessage}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      {t("ನಿಮ್ಮ ಹೆಸರು", "Your Name")} <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={lang === 'kn' ? "ಉದಾ: ಪುನೀತ್" : "e.g., Punith"}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/50 dark:focus:ring-sky-500/50 focus:border-red-600 dark:focus:border-sky-500 transition-all font-medium"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">
                      {t("ಇಮೇಲ್ ವಿಳಾಸ", "Email Address")} <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="hello@example.com"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/50 dark:focus:ring-sky-500/50 focus:border-red-600 dark:focus:border-sky-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">
                    {t("ನಿಮ್ಮ ಸಂದೇಶ", "Your Message")} <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={lang === 'kn' ? "ನಾವು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?" : "How can we help you?"}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/50 dark:focus:ring-sky-500/50 focus:border-red-600 dark:focus:border-sky-500 transition-all font-medium resize-y min-h-[120px]"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-red-600 hover:bg-red-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-red-600/30 dark:shadow-sky-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      {t("ಸಂದೇಶ ಕಳುಹಿಸಿ", "Send Message")}
                      <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

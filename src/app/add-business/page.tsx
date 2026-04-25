"use client";
import React, { useState, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Building2, MapPin, Phone, Image as ImageIcon, CheckCircle2, ChevronRight, ChevronLeft, Loader2, ShieldCheck, Upload, X } from "lucide-react";
import api from "@/services/api";

const STEPS = ["Business Info", "Location", "Contact & Hours", "Photos & Details"];

const INPUT = "w-full bg-white dark:bg-slate-900 border border-red-200 dark:border-slate-700 text-slate-900 dark:text-white px-4 py-3 rounded-xl outline-none focus:border-red-600 dark:focus:border-sky-500 focus:ring-2 focus:ring-red-600/20 dark:focus:ring-sky-500/20 transition-all placeholder:text-slate-400 font-medium text-sm";
const LABEL = "block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5";

export default function AddBusinessPage() {
  const { lang, t } = useLanguage();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [previews, setPreviews] = useState<string[]>([]);
  const fileRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const [form, setForm] = useState({
    business_name: "", category: "", subcategory: "",
    area: "", full_address: "", landmark: "", pincode: "", map_link: "",
    phone: "", whatsapp: "", email: "", website: "", instagram: "", facebook: "",
    working_hours: "", established_year: "",
    description: "", amenities: "", services_offered: "",
    submitter_name: "", submitter_phone: "", submitter_email: "",
  });
  const [files, setFiles] = useState<(File | null)[]>([null, null, null, null, null]);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const inp = (k: keyof typeof form, ph: string, type = "text") => (
    <input type={type} value={form[k]} onChange={e => set(k, e.target.value)} placeholder={ph} className={INPUT} />
  );

  const handleFileChange = (i: number, file: File | null) => {
    const nf = [...files]; nf[i] = file;
    setFiles(nf);
    if (file) {
      const url = URL.createObjectURL(file);
      const np = [...previews]; np[i] = url; setPreviews(np);
    }
  };

  const canNext = () => {
    if (step === 0) return form.business_name && form.category;
    if (step === 1) return form.area && form.full_address;
    if (step === 2) return form.phone && form.submitter_name && form.submitter_phone;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true); setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      files.forEach((f, i) => f && fd.append(`image_${i + 1}`, f));
      await api.post("/submit-business/", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setSuccess(true);
    } catch (e: any) {
      setError(e?.response?.data?.message || (lang === "kn" ? "ಏನೋ ತಪ್ಪಾಗಿದೆ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ." : "Something went wrong. Please try again."));
    } finally { setLoading(false); }
  };

  if (success) return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050b14] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0c1220] border border-emerald-200 dark:border-emerald-500/30 p-8 md:p-12 rounded-2xl max-w-lg w-full text-center shadow-2xl">
        <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={44} className="text-emerald-500" />
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-3">{t("ಯಶಸ್ವಿ!", "Submitted!")}</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">{t("ನಿಮ್ಮ ಬ್ಯುಸಿನೆಸ್ ವಿನಂತಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ. 24-48 ಗಂಟೆಗಳಲ್ಲಿ ಪರಿಶೀಲಿಸಲಾಗುವುದು.", "Your business request has been received. Our team will review it within 24–48 hours.")}</p>
        <div className="flex items-center gap-2 justify-center text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-xl mb-6">
          <ShieldCheck size={18} /> <span className="text-sm font-semibold">{t("ಕ್ವಾಲಿಟಿ ತಂಡ ಪರಿಶೀಲಿಸಿ ಲೈವ್ ಮಾಡುತ್ತದೆ", "Quality team will review before going live")}</span>
        </div>
        <button onClick={() => { setSuccess(false); setStep(0); setForm({ business_name:"",category:"",subcategory:"",area:"",full_address:"",landmark:"",pincode:"",map_link:"",phone:"",whatsapp:"",email:"",website:"",instagram:"",facebook:"",working_hours:"",established_year:"",description:"",amenities:"",services_offered:"",submitter_name:"",submitter_phone:"",submitter_email:"" }); setFiles([null,null,null,null,null]); setPreviews([]); }} className="bg-red-600 hover:bg-red-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg">
          {t("ಇನ್ನೊಂದು ಸೇರಿಸಿ", "Add Another")}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050b14]">
      {/* Header */}
      <div className="bg-white dark:bg-[#0c1220] border-b border-red-100 dark:border-slate-800 px-4 py-6 text-center">
        <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-600/10 text-red-600 dark:text-red-400 px-4 py-1.5 rounded-full text-xs font-bold mb-3 border border-red-200 dark:border-red-500/20">
          <ShieldCheck size={13} /> {t("100% ಉಚಿತ", "100% Free")}
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-1">{t("ನಿಮ್ಮ ಬ್ಯುಸಿನೆಸ್ ಸೇರಿಸಿ", "Add Your Business")}</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">{t("ತುಮಕೂರಿನ #1 ಡೈರೆಕ್ಟರಿಯಲ್ಲಿ ಉಚಿತವಾಗಿ ಲಿಸ್ಟ್ ಮಾಡಿ", "Get listed free on Tumkur's #1 directory")}</p>
      </div>

      {/* Stepper */}
      <div className="bg-white dark:bg-[#0c1220] border-b border-slate-100 dark:border-slate-800 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          {STEPS.map((s, i) => {
            const icons = [Building2, MapPin, Phone, ImageIcon];
            const Icon = icons[i];
            return (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center gap-1 flex-1">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${i < step ? "bg-emerald-500 text-white" : i === step ? "bg-red-600 dark:bg-sky-500 text-white ring-4 ring-red-600/20 dark:ring-sky-500/20" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}>
                    {i < step ? <CheckCircle2 size={16} /> : <Icon size={16} />}
                  </div>
                  <span className={`text-[10px] font-bold hidden sm:block ${i === step ? "text-red-600 dark:text-sky-400" : i < step ? "text-emerald-500" : "text-slate-400"}`}>{s}</span>
                </div>
                {i < 3 && <div className={`h-[2px] flex-1 mx-1 rounded-full transition-all ${i < step ? "bg-emerald-400" : "bg-slate-200 dark:bg-slate-700"}`} />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-6 pb-32 md:pb-10">
        <div className="bg-white dark:bg-[#0c1220] rounded-2xl border border-red-100 dark:border-slate-800 shadow-sm p-5 md:p-8">

          {/* Step 1 */}
          {step === 0 && (
            <div className="space-y-5">
              <div><label className={LABEL}>{t("ಬ್ಯುಸಿನೆಸ್ ಹೆಸರು", "Business Name")} <span className="text-red-500">*</span></label>{inp("business_name", t("ಉದಾ: ಶ್ರೀ ಸಾಯಿ ಹೋಟೆಲ್", "e.g. Sri Sai Hotel"))}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>{t("ಕ್ಯಾಟಗರಿ", "Category")} <span className="text-red-500">*</span></label>
                  <select value={form.category} onChange={e => set("category", e.target.value)} className={INPUT}>
                    <option value="">{t("ಆಯ್ಕೆಮಾಡಿ", "Select Category")}</option>
                    {["Hotel","Restaurant","Hospital","PG / Hostel","Education","Real Estate","Beauty Salon","Gym","Shop","Plumber","Electrician","Other"].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div><label className={LABEL}>{t("ಸಬ್-ಕ್ಯಾಟಗರಿ", "Sub-Category")}</label>{inp("subcategory", t("ಐಚ್ಛಿಕ", "Optional"))}</div>
              </div>
              <div className="bg-red-50 dark:bg-red-600/5 border border-red-100 dark:border-red-500/20 p-4 rounded-xl">
                <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-1">{t("ಸಲ್ಲಿಸುವವರ ವಿವರ", "Submitter Details")}</h3>
                <p className="text-xs text-slate-500 mb-3">{t("ನಿಮ್ಮ ವಿವರ (ಸ್ಟೆಪ್ 1 ರಲ್ಲಿ ಭರ್ತಿ ಮಾಡಿ)", "Your contact info for our team to reach you")}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className={LABEL}>{t("ನಿಮ್ಮ ಹೆಸರು", "Your Name")} <span className="text-red-500">*</span></label>{inp("submitter_name", t("ನಿಮ್ಮ ಹೆಸರು", "Your full name"))}</div>
                  <div><label className={LABEL}>{t("ನಿಮ್ಮ ಫೋನ್", "Your Phone")} <span className="text-red-500">*</span></label>{inp("submitter_phone", "+91 ", "tel")}</div>
                </div>
                <div className="mt-3"><label className={LABEL}>{t("ನಿಮ್ಮ ಇಮೇಲ್", "Your Email")}</label>{inp("submitter_email", "you@example.com", "email")}</div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className={LABEL}>{t("ಏರಿಯಾ", "Area / Locality")} <span className="text-red-500">*</span></label>{inp("area", t("ಉದಾ: ಬಿ.ಹೆಚ್. ರಸ್ತೆ", "e.g. B.H. Road"))}</div>
                <div><label className={LABEL}>{t("ಪಿನ್‌ಕೋಡ್", "Pincode")}</label>{inp("pincode", "572101")}</div>
              </div>
              <div><label className={LABEL}>{t("ಪೂರ್ಣ ವಿಳಾಸ", "Full Address")} <span className="text-red-500">*</span></label><textarea value={form.full_address} onChange={e => set("full_address", e.target.value)} rows={3} placeholder={t("ಶಾಪ್ ನಂ, ರಸ್ತೆ, ಏರಿಯಾ, ಲ್ಯಾಂಡ್‌ಮಾರ್ಕ್", "Shop no, Street, Area, Landmark")} className={INPUT + " resize-none"} /></div>
              <div><label className={LABEL}>{t("ಲ್ಯಾಂಡ್‌ಮಾರ್ಕ್", "Landmark")}</label>{inp("landmark", t("ಹತ್ತಿರದ ಪ್ರಸಿದ್ಧ ಸ್ಥಳ", "Near famous landmark"))}</div>
              <div><label className={LABEL}>{t("ಗೂಗಲ್ ಮ್ಯಾಪ್ ಲಿಂಕ್", "Google Maps Link")}</label>{inp("map_link", "https://maps.google.com/...", "url")}</div>
            </div>
          )}

          {/* Step 3 */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className={LABEL}>{t("ಫೋನ್ ನಂಬರ್", "Phone Number")} <span className="text-red-500">*</span></label>{inp("phone", "+91 ", "tel")}</div>
                <div><label className={LABEL}>{t("ವಾಟ್ಸಾಪ್", "WhatsApp")}</label>{inp("whatsapp", "+91 ", "tel")}</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className={LABEL}>{t("ಬ್ಯುಸಿನೆಸ್ ಇಮೇಲ್", "Business Email")}</label>{inp("email", "business@email.com", "email")}</div>
                <div><label className={LABEL}>{t("ವೆಬ್‌ಸೈಟ್", "Website")}</label>{inp("website", "https://yoursite.com", "url")}</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className={LABEL}>Instagram</label>{inp("instagram", "@handle or URL")}</div>
                <div><label className={LABEL}>Facebook</label>{inp("facebook", "Page URL")}</div>
              </div>
              <div><label className={LABEL}>{t("ಕೆಲಸದ ಸಮಯ", "Working Hours")}</label>{inp("working_hours", t("ಉದಾ: Mon-Sat 9AM-9PM, Sun Closed", "e.g. Mon-Sat 9AM-9PM, Sun Closed"))}</div>
              <div><label className={LABEL}>{t("ಸ್ಥಾಪಿಸಿದ ವರ್ಷ", "Established Year")}</label>{inp("established_year", "e.g. 2010")}</div>
            </div>
          )}

          {/* Step 4 */}
          {step === 3 && (
            <div className="space-y-5">
              <div><label className={LABEL}>{t("ಬ್ಯುಸಿನೆಸ್ ವಿವರಣೆ", "Business Description")}</label><textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3} placeholder={t("ನಿಮ್ಮ ಬ್ಯುಸಿನೆಸ್ ಬಗ್ಗೆ ಹೇಳಿ...", "Tell us about your business...")} className={INPUT + " resize-none"} /></div>
              <div><label className={LABEL}>{t("ಸೇವೆಗಳು", "Services Offered")}</label><textarea value={form.services_offered} onChange={e => set("services_offered", e.target.value)} rows={2} placeholder={t("ಉದಾ: ಕ್ಯಾಟರಿಂಗ್, ಡೆಲಿವರಿ, ಪಾರ್ಸೆಲ್", "e.g. Catering, Delivery, Parcel")} className={INPUT + " resize-none"} /></div>
              <div><label className={LABEL}>{t("ಸೌಲಭ್ಯಗಳು", "Amenities / Features")}</label><textarea value={form.amenities} onChange={e => set("amenities", e.target.value)} rows={2} placeholder={t("ಉದಾ: WiFi, Parking, AC, CCTV", "e.g. WiFi, Parking, AC, CCTV")} className={INPUT + " resize-none"} /></div>

              <div>
                <label className={LABEL}>{t("ಫೋಟೋಗಳು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ", "Upload Photos")} <span className="text-slate-400 font-normal text-xs">({t("ಗರಿಷ್ಠ 5", "Max 5")})</span></label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
                  {[0,1,2,3,4].map(i => (
                    <div key={i} className="relative">
                      {previews[i] ? (
                        <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-red-400 dark:border-sky-500">
                          <img src={previews[i]} className="w-full h-full object-cover" alt="" />
                          <button type="button" onClick={() => { const np=[...previews]; np[i]=""; setPreviews(np); const nf=[...files]; nf[i]=null; setFiles(nf); }} className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                            <X size={10} />
                          </button>
                        </div>
                      ) : (
                        <button type="button" onClick={() => fileRefs[i].current?.click()} className="w-full aspect-square rounded-xl border-2 border-dashed border-red-200 dark:border-slate-700 flex flex-col items-center justify-center gap-1 hover:border-red-400 dark:hover:border-sky-500 transition-colors bg-red-50/50 dark:bg-slate-800/50">
                          <Upload size={16} className="text-red-400 dark:text-slate-500" />
                          <span className="text-[9px] text-slate-400">{i === 0 ? t("ಮುಖ್ಯ", "Main") : `${t("ಫೋಟೋ", "Photo")} ${i+1}`}</span>
                        </button>
                      )}
                      <input ref={fileRefs[i]} type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(i, e.target.files?.[0] || null)} />
                    </div>
                  ))}
                </div>
              </div>

              {error && <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 p-4 rounded-xl text-sm font-medium">{error}</div>}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            {step > 0 && (
              <button type="button" onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                <ChevronLeft size={16} /> {t("ಹಿಂದೆ", "Back")}
              </button>
            )}
            <button
              type="button"
              disabled={!canNext() || loading}
              onClick={() => step < 3 ? setStep(s => s + 1) : handleSubmit()}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm transition-all shadow-lg ${canNext() && !loading ? "bg-red-600 hover:bg-red-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white shadow-red-600/25 dark:shadow-sky-500/25" : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none"}`}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : step < 3 ? <>{t("ಮುಂದೆ", "Next")} <ChevronRight size={16} /></> : t("ಸಲ್ಲಿಸಿ", "Submit")}
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
          <ShieldCheck size={14} className="text-emerald-500" />
          {t("ಲೈವ್ ಆಗುವ ಮೊದಲು ನಮ್ಮ ತಂಡ ಪರಿಶೀಲಿಸುತ್ತದೆ", "Our team reviews all submissions before going live")}
        </div>
      </div>
    </div>
  );
}

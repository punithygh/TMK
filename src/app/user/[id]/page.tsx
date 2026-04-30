"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getUserPublicProfile } from "@/services/legacyStubs";
import { useLanguage } from "@/context/LanguageContext";
import { 
  Star, 
  MapPin, 
  Calendar, 
  MessageSquare, 
  Camera, 
  User as UserIcon,
  ChevronRight,
  Loader2,
  Award,
  Users
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getSupabaseImageUrl } from "@/utils/imageUtils";

export default function UserProfilePage() {
  const { id } = useParams();
  const { t } = useLanguage();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const fetchProfile = async () => {
      try {
        const data = await getUserPublicProfile(Number(id));
        if (!data) {
          router.push("/404");
          return;
        }
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a1120]">
        <Loader2 className="w-10 h-10 text-red-600 dark:text-sky-500 animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  const fullName = profile.first_name ? `${profile.first_name} ${profile.last_name || ''}` : profile.username || 'User';
  const initial = fullName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a1120] pb-20 font-poppins">
      
      {/* 🌟 PREMIUM HEADER SECTION (Yelp Style) */}
      <div className="w-full bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 pt-10 pb-12">
        <div className="max-w-[1000px] mx-auto px-4 flex flex-col md:flex-row items-center md:items-end gap-8">
          
          {/* Profile Photo */}
          <div className="relative group">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 dark:from-sky-500 dark:to-blue-600 flex items-center justify-center text-5xl md:text-7xl font-black text-white shadow-2xl border-4 border-white dark:border-slate-800 relative z-10">
              {initial}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-amber-400 text-white p-2 rounded-xl shadow-lg border-2 border-white dark:border-slate-800 z-20">
              <Award size={20} />
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left mb-2">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-3 tracking-tight flex items-center gap-3">
              {fullName}
              {profile.is_elite && (
                <div className="bg-amber-500 text-white p-1.5 rounded-lg shadow-lg border-2 border-white dark:border-slate-800" title="Elite Member">
                  <Award size={24} className="fill-white" />
                </div>
              )}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-slate-600 dark:text-slate-400 font-semibold text-sm">
              <span className="flex items-center gap-1.5"><MapPin size={16} className="text-red-600 dark:text-sky-500" /> Tumakuru, KA</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 hidden md:block"></span>
              <span className="flex items-center gap-1.5"><Star size={16} className="text-amber-500" /> {profile.review_count} {t("ವಿಮರ್ಶೆಗಳು", "Reviews")}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 hidden md:block"></span>
              <span className="flex items-center gap-1.5"><Camera size={16} className="text-blue-500" /> {profile.photo_count} {t("ಫೋಟೋಗಳು", "Photos")}</span>
            </div>
            
            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
              <button className="px-6 py-2.5 bg-red-600 hover:bg-red-700 dark:bg-sky-600 dark:hover:bg-sky-700 text-white rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2">
                <Users size={18} /> {t("ಸ್ನೇಹಿತರಾಗಿ", "Add Friend")}
              </button>
              <button className="px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2">
                <MessageSquare size={18} /> {t("ಸಂದೇಶ ಕಳುಹಿಸಿ", "Message")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 📊 CONTENT SECTION */}
      <div className="max-w-[1000px] mx-auto px-4 pt-12 flex flex-col lg:flex-row gap-12">
        
        {/* Sidebar Stats */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm sticky top-24">
            <h3 className="font-black text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-xs">{t("ಬಗ್ಗೆ", "About")} {profile.first_name}</h3>
            
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">{t("ಸೇರಿದ ದಿನಾಂಕ", "Yelping Since")}</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    {new Date(profile.date_joined).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                  <Award size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">{t("ಸ್ಥಾನ", "Status")}</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    {profile.is_elite ? "Elite Member" : "Active Member"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white mb-4 text-sm">{t("ಸಾಧನೆಗಳು", "Stats")}</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <p className="text-xl font-black text-red-600 dark:text-sky-500">{profile.review_count}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">{t("ವಿಮರ್ಶೆ", "Reviews")}</p>
                </div>
                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <p className="text-xl font-black text-blue-500">{profile.photo_count}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">{t("ಫೋಟೋ", "Photos")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Area: Reviews */}
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
            <Star className="text-red-600 dark:text-sky-500" size={28} /> {t("ಇತ್ತೀಚಿನ ವಿಮರ್ಶೆಗಳು", "Recent Reviews")}
          </h2>

          {profile.reviews.length > 0 ? (
            <div className="space-y-10">
              {profile.reviews.map((review: any) => (
                <div key={review.id} className="group animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex gap-4 mb-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 relative">
                      {review.business?.main_image_upload || review.business?.image_url ? (
                        <Image 
                          src={getSupabaseImageUrl(review.business.main_image_upload || review.business.image_url) || ''} 
                          alt={review.business.name} 
                          fill 
                          className="object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                          <UserIcon size={24} />
                        </div>
                      )}
                    </div>
                    <div>
                      <Link href={`/business/${review.business.id}`} className="text-lg font-black text-slate-900 dark:text-white hover:text-red-600 dark:hover:text-sky-400 transition-colors flex items-center gap-1">
                        {t(review.business.name_kn, review.business.name)} <ChevronRight size={18} />
                      </Link>
                      <div className="flex items-center gap-3 mt-1 text-sm text-slate-500 dark:text-slate-400 font-semibold">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={14} fill={s <= review.rating ? "#f15c4f" : "none"} className={s <= review.rating ? "text-[#f15c4f]" : "text-slate-200 dark:text-slate-700"} />
                          ))}
                        </div>
                        <span>•</span>
                        <span>{new Date(review.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium pl-2 border-l-4 border-slate-100 dark:border-slate-800 py-1">
                    "{review.comment}"
                  </p>
                  
                  <div className="mt-6 flex items-center gap-4">
                    <button className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-600 dark:hover:text-sky-500 transition-colors">Helpful</button>
                    <button className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-amber-500 transition-colors">Funny</button>
                    <button className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors">Cool</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800">
              <Star className="w-16 h-16 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
              <h3 className="text-xl font-black text-slate-400">{t("ಇನ್ನೂ ಯಾವುದೇ ವಿಮರ್ಶೆಗಳಿಲ್ಲ", "No reviews yet")}</h3>
              <p className="text-slate-400 mt-2 text-sm">{profile.first_name} hasn't shared any experiences yet.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

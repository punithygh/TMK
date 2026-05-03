"use client";
export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getSupabaseUserDashboard } from "@/services/legacyStubs";
import ProductCard from "@/components/features/listing/ProductCard";
import { Loader2, LayoutDashboard, Bookmark, Star, LogOut, MessageCircle, Settings, ChevronRight, Award, Edit, Trash2, Camera, User, X, Check, Upload } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { getSupabaseImageUrl } from "@/utils/imageUtils";
import { 
  updateSupabaseReview, 
  deleteSupabaseReview, 
  updateSupabaseUserProfile, 
  uploadSupabaseFile 
} from "@/services/legacyStubs";

export default function DashboardPage() {
  const { user, isAuthenticated, logout, updateUser } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"bookmarks" | "reviews">("bookmarks");
  const [isMounted, setIsMounted] = useState(false);

  // Review Edit State
  const [editingReview, setEditingReview] = useState<any>(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile Upload State
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const fetchData = async (isManual = false) => {
    if (!user?.id) return;
    if (isManual) setRefreshing(true);
    try {
      const dashboardData = await getSupabaseUserDashboard(user.id);
      setData(dashboardData as any);
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    fetchData();
  }, [isAuthenticated, router, user?.id]);

  const handleEditReview = (review: any) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleUpdateReview = async () => {
    if (!editingReview) return;
    setIsSubmitting(true);
    try {
      await updateSupabaseReview(editingReview.id, editRating, editComment);
      setEditingReview(null);
      fetchData(true);
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (id: number) => {
    if (!confirm(t("ನೀವು ಖಚಿತವಾಗಿ ಈ ವಿಮರ್ಶೆಯನ್ನು ಅಳಿಸಲು ಬಯಸುವಿರಾ?", "Are you sure you want to delete this review?"))) return;
    try {
      await deleteSupabaseReview(id);
      fetchData(true);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    
    setIsUploadingPhoto(true);
    try {
      const filePath = await uploadSupabaseFile(file);
      await updateSupabaseUserProfile(user.id, { profile_image: filePath });
      updateUser({ profile_image: filePath }); // 🚀 Global state update
      fetchData(true);
    } catch (err) {
      console.error("Photo upload failed", err);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-red-600 dark:text-sky-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] bg-[#050b14] pt-8 pb-20 px-4 md:px-[5%] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 dark:bg-sky-500/5 rounded-full blur-[150px] -z-10"></div>
      
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-[#0c1220] border border-slate-800 rounded-2xl p-6 sticky top-24 shadow-2xl">
            <div className="flex flex-col items-center mb-8">
              <div className="relative group mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-red-600 dark:from-sky-500 dark:to-blue-600 flex items-center justify-center text-4xl font-bold text-white shadow-xl shadow-red-600/20 dark:shadow-sky-500/20 ring-4 ring-[#050b14] overflow-hidden">
                  {data?.profile?.profile_image ? (
                    <img src={getSupabaseImageUrl(data.profile.profile_image) || ''} className="w-full h-full object-cover" alt="Profile" />
                  ) : (
                    user?.first_name?.charAt(0) || "U"
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
                  {isUploadingPhoto ? <Loader2 className="text-white animate-spin" /> : <Camera className="text-white" size={24} />}
                  <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} disabled={isUploadingPhoto} />
                </label>
              </div>
              
              <h2 className="text-xl font-black text-white">{data?.profile?.first_name || user?.first_name} {data?.profile?.last_name || user?.last_name || ''}</h2>
              <p className="text-slate-400 text-xs font-bold mt-1">@{data?.profile?.username || user?.username || 'user'}</p>
              
              <div className="mt-3 flex flex-col items-center gap-2">
                <div className={`flex items-center gap-1.5 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-widest border border-white/20 ${data?.gamification?.badge === 'Local Legend' ? 'bg-gradient-to-r from-purple-500 to-fuchsia-600 shadow-purple-500/30' : data?.gamification?.badge === 'Top Reviewer' ? 'bg-gradient-to-r from-amber-400 to-orange-600 shadow-amber-500/30' : data?.gamification?.badge === 'Active Member' ? 'bg-gradient-to-r from-sky-500 to-blue-600 shadow-sky-500/30' : 'bg-gradient-to-r from-slate-500 to-slate-700 shadow-slate-500/30'}`}>
                  <Award size={12} className="fill-white" />
                  {data?.gamification?.badge || "Newbie"}
                </div>
                <div className="text-xs font-bold text-slate-400">
                  <span className="text-amber-400 font-black">{data?.gamification?.points || 0}</span> Points
                </div>
              </div>
              
              <div className="flex items-center gap-4 mt-6 w-full border-t border-slate-800 pt-6">
                <div className="flex flex-col items-center flex-1">
                  <span className="text-white font-black text-lg">{data?.my_reviews?.length || 0}</span>
                  <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">{t("ವಿಮರ್ಶೆಗಳು", "Reviews")}</span>
                </div>
                <div className="w-px h-8 bg-slate-800"></div>
                <div className="flex flex-col items-center flex-1">
                  <span className="text-white font-black text-lg">{data?.photo_count || 0}</span>
                  <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">{t("ಫೋಟೋಗಳು", "Photos")}</span>
                </div>
              </div>
            </div>

            <nav className="flex flex-col gap-2">
              <button 
                onClick={() => setActiveTab("bookmarks")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === "bookmarks" ? "bg-red-50 dark:bg-sky-500/10 text-red-600 dark:text-sky-400 border border-red-200 dark:border-sky-500/20" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"}`}
              >
                <Bookmark size={18} /> {t("ಉಳಿಸಿದ ಬ್ಯುಸಿನೆಸ್", "Saved Businesses")}
              </button>
              <button 
                onClick={() => setActiveTab("reviews")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === "reviews" ? "bg-red-50 dark:bg-sky-500/10 text-red-600 dark:text-sky-400 border border-red-200 dark:border-sky-500/20" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"}`}
              >
                <Star size={18} /> {t("ನನ್ನ ವಿಮರ್ಶೆಗಳು", "My Reviews")}
              </button>
              <div className="h-px bg-slate-800 my-2"></div>
              <button 
                onClick={logout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-400 hover:bg-red-500/10 transition-colors text-left"
              >
                <LogOut size={18} /> {t("ಲಾಗ್ ಔಟ್", "Logout")}
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{t("ಹಲೋ", "Hello")}, {user?.first_name}! 👋</h1>
              <p className="text-slate-400">{t("ನಿಮ್ಮ ಆಕ್ಟಿವಿಟಿ ಮತ್ತು ಅಚ್ಚುಮೆಚ್ಚಿನ ಸ್ಥಳಗಳು ಇಲ್ಲಿವೆ.", "Here's your latest activity and favorite places.")}</p>
            </div>
            <button 
              onClick={() => fetchData(true)} 
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm font-bold border border-slate-700 hover:bg-slate-700 transition-all active:scale-95 disabled:opacity-50"
            >
              <Loader2 size={16} className={refreshing ? "animate-spin" : ""} />
              {refreshing ? t("ಅಪ್ಡೇಟ್ ಆಗುತ್ತಿದೆ...", "Refreshing...") : t("ರಿಫ್ರೆಶ್", "Refresh")}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
             <div className="bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 p-6 rounded-2xl">
                <Star className="text-red-500 mb-3" size={24} />
                <div className="text-2xl font-black text-white">{data?.my_reviews?.length || 0}</div>
                <div className="text-slate-400 text-sm font-medium">{t("ನೀವು ನೀಡಿದ ವಿಮರ್ಶೆಗಳು", "Reviews contributed")}</div>
             </div>
             <div className="bg-gradient-to-br from-sky-500/10 to-transparent border border-sky-500/20 p-6 rounded-2xl">
                <Bookmark className="text-sky-500 mb-3" size={24} />
                <div className="text-2xl font-black text-white">{data?.my_bookmarks?.length || 0}</div>
                <div className="text-slate-400 text-sm font-medium">{t("ಉಳಿಸಿದ ಬ್ಯುಸಿನೆಸ್", "Businesses saved")}</div>
             </div>
             <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 p-6 rounded-2xl">
                <Camera className="text-emerald-500 mb-3" size={24} />
                <div className="text-2xl font-black text-white">{data?.photo_count || 0}</div>
                <div className="text-slate-400 text-sm font-medium">{t("ನೀವು ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ಫೋಟೋಗಳು", "Photos uploaded")}</div>
             </div>
          </div>

          {activeTab === "bookmarks" && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Bookmark className="text-red-600 dark:text-sky-400" size={20} /> {t("ಉಳಿಸಿದ ಬ್ಯುಸಿನೆಸ್", "Saved Businesses")} ({data?.my_bookmarks?.length || 0})
              </h3>
              
              {data?.my_bookmarks && data.my_bookmarks.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {data.my_bookmarks.map((bookmark) => (
                    <ProductCard key={bookmark.bookmark_id} product={bookmark.business} />
                  ))}
                </div>
              ) : (
                <div className="bg-[#0c1220] border border-slate-800 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center">
                  <Bookmark className="w-12 h-12 text-slate-600 mb-4" />
                  <p className="text-slate-300 font-medium mb-2">No saved businesses yet.</p>
                  <p className="text-slate-500 text-sm">Explore Tumkur and save your favorite places here.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Star className="text-amber-400" size={20} /> {t("ನನ್ನ ವಿಮರ್ಶೆಗಳು", "My Reviews")} ({data?.my_reviews?.length || 0})
              </h3>
              
              {data?.my_reviews && data.my_reviews.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {data.my_reviews.map((review: any) => (
                    <div key={review.id} className="bg-[#0c1220] border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all group">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-16 h-16 rounded-xl bg-slate-800 overflow-hidden shrink-0 border border-slate-700 relative">
                          <img 
                            src={getSupabaseImageUrl(review.business?.main_image_upload || review.business?.image_url) || ''} 
                            alt={review.business?.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <Link 
                              href={`/business/${review.business?.slug || review.business?.id}#review-${review.id}`} 
                              className="text-lg font-bold text-white hover:text-red-500 dark:hover:text-sky-400 transition-colors"
                            >
                              {t(review.business?.name_kn, review.business?.name)}
                            </Link>
                            <span className="text-slate-500 text-xs font-medium">
                              {isMounted ? new Date(review.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '...'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex gap-0.5 text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-slate-700" : ""} />
                              ))}
                            </div>
                            <span className="text-slate-500 text-xs uppercase font-bold tracking-tighter ml-2 bg-slate-800 px-2 py-0.5 rounded">Verified Review</span>
                          </div>
                          <p className="text-slate-300 text-sm leading-relaxed italic">"{review.comment}"</p>
                          
                          <div className="flex items-center gap-3 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleEditReview(review)}
                              className="text-xs font-bold text-sky-400 flex items-center gap-1 hover:text-sky-300"
                            >
                              <Edit size={14} /> {t("ತಿದ್ದುಪಡಿ", "Edit")}
                            </button>
                            <button 
                              onClick={() => handleDeleteReview(review.id)}
                              className="text-xs font-bold text-red-400 flex items-center gap-1 hover:text-red-300"
                            >
                              <Trash2 size={14} /> {t("ಅಳಿಸು", "Delete")}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#0c1220] border border-slate-800 border-dashed rounded-2xl p-16 flex flex-col items-center justify-center text-center">
                  <Star className="w-16 h-16 text-slate-700 mb-4" />
                  <p className="text-white font-bold text-lg mb-2">{t("ನೀವು ಇನ್ನೂ ಯಾವುದೇ ವಿಮರ್ಶೆಗಳನ್ನು ನೀಡಿಲ್ಲ", "No reviews yet")}</p>
                  <p className="text-slate-500 text-sm max-w-xs">{t("ನಿಮ್ಮ ನೆಚ್ಚಿನ ಸ್ಥಳಗಳ ಬಗ್ಗೆ ವಿಮರ್ಶೆ ಬರೆಯುವ ಮೂಲಕ ಸಮುದಾಯಕ್ಕೆ ಸಹಾಯ ಮಾಡಿ.", "Share your experiences to help the community.")}</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* 🚀 EDIT MODAL */}
      {editingReview && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setEditingReview(null)}></div>
          <div className="bg-[#0c1220] border border-slate-800 rounded-3xl p-6 w-full max-w-md relative z-10 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white">{t("ವಿಮರ್ಶೆ ತಿದ್ದುಪಡಿ", "Edit Review")}</h3>
              <button onClick={() => setEditingReview(null)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-slate-400 text-sm font-bold block mb-3 uppercase tracking-wider">{t("ರೇಟಿಂಗ್", "Rating")}</label>
                <div className="flex gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} onClick={() => setEditRating(s)} className="p-1">
                      <Star size={24} fill={s <= editRating ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-slate-400 text-sm font-bold block mb-3 uppercase tracking-wider">{t("ಕಾಮೆಂಟ್", "Comment")}</label>
                <textarea 
                  value={editComment} 
                  onChange={(e) => setEditComment(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white text-sm outline-none focus:border-sky-500 transition-colors h-32 resize-none"
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setEditingReview(null)}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-800 text-slate-400 font-bold text-sm hover:bg-slate-800 transition-colors"
                >
                  {t("ರದ್ದು", "Cancel")}
                </button>
                <button 
                  onClick={handleUpdateReview}
                  disabled={isSubmitting}
                  className="flex-[2] px-4 py-3 rounded-xl bg-sky-500 text-white font-bold text-sm hover:bg-sky-600 transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  {t("ಅಪ್ಡೇಟ್ ಮಾಡಿ", "Save Changes")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

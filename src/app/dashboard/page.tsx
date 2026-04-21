"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getUserDashboard, UserDashboardData } from "@/services/user";
import ProductCard from "@/components/product-card";
import { Loader2, LayoutDashboard, Bookmark, Star, LogOut } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  const [data, setData] = useState<UserDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"bookmarks" | "reviews">("bookmarks");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const dashboardData = await getUserDashboard();
        setData(dashboardData);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, router]);

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] bg-[#050b14] pt-8 pb-20 px-4 md:px-[5%] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[150px] -z-10"></div>
      
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-[#0c1220] border border-slate-800 rounded-2xl p-6 sticky top-24 shadow-2xl">
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-lg shadow-sky-500/20">
                {user?.first_name?.charAt(0) || "U"}
              </div>
              <h2 className="text-lg font-bold text-white">{user?.first_name}</h2>
              <p className="text-slate-400 text-sm">{user?.mobile}</p>
            </div>

            <nav className="flex flex-col gap-2">
              <button 
                onClick={() => setActiveTab("bookmarks")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === "bookmarks" ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
              >
                <Bookmark size={18} /> {t("ಉಳಿಸಿದ ಬ್ಯುಸಿನೆಸ್", "Saved Businesses")}
              </button>
              <button 
                onClick={() => setActiveTab("reviews")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === "reviews" ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
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
          <div className="mb-6 flex items-center gap-3">
            <LayoutDashboard className="text-sky-500" size={28} />
            <h1 className="text-2xl md:text-3xl font-black text-white">{t("ಡ್ಯಾಶ್ಬೋರ್ಡ್", "Dashboard")}</h1>
          </div>

          {activeTab === "bookmarks" && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Bookmark className="text-sky-400" size={20} /> {t("ಉಳಿಸಿದ ಬ್ಯುಸಿನೆಸ್", "Saved Businesses")} ({data?.my_bookmarks?.length || 0})
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
                <div className="grid grid-cols-1 gap-4">
                  {data.my_reviews.map((review) => (
                    <div key={review.id} className="bg-[#0c1220] border border-slate-800 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex gap-1 text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-slate-600" : ""} />
                          ))}
                        </div>
                        <span className="text-slate-500 text-xs">{new Date(review.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#0c1220] border border-slate-800 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center">
                  <Star className="w-12 h-12 text-slate-600 mb-4" />
                  <p className="text-slate-300 font-medium mb-2">You haven't reviewed any businesses.</p>
                  <p className="text-slate-500 text-sm">Share your experiences to help the community.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

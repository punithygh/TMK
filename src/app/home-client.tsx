"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Flame, Film, Newspaper, Clock, Hash, BadgeCheck, Youtube, Instagram, Facebook, ArrowRight } from "lucide-react";

import Hero from '@/components/hero';
import CategoryGrid from "@/components/category-grid";
import ProductCard from "@/components/product-card";
import RecentReviewsSwiper from "@/components/recent-reviews-swiper";

const getValidImageUrl = (url?: string | null) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  
  if (typeof window !== 'undefined') {
    const host = window.location.hostname === 'localhost' ? '127.0.0.1' : window.location.hostname;
    return `http://${host}:8000${url.startsWith('/') ? '' : '/'}${url}`;
  }
  
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  return `${backendUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

export default function HomeClient({
  trendingBusinesses,
  movieReviews,
  newsArticles,
  socialPosts,
  categories,
  recentReviews
}: any) {
  const { lang, t } = useLanguage();

  const SectionHeader = ({ title, icon: Icon, colorClass, gradient }: { title: string, icon: any, colorClass: string, gradient: string }) => (
    <div className="flex items-center justify-between mb-6 md:mb-8 border-b border-slate-200 dark:border-slate-800/80 pb-4 px-2">
      <h2 className="text-xl md:text-2xl font-extrabold flex items-center gap-3 text-slate-900 dark:text-white tracking-wide">
        <div className={`p-2 rounded-xl ${gradient} shadow-lg shadow-black/10 dark:shadow-black/40`}>
          <Icon className={colorClass} size={22} />
        </div>
        {title}
      </h2>
    </div>
  );

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="flex flex-col gap-12 md:gap-16 pb-24 overflow-x-hidden bg-slate-50 dark:bg-[#050b14] min-h-screen transition-colors duration-300">
      
      {/* 1. HERO SECTION (Ultra Premium) */}
      <Hero />

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="flex flex-col gap-16 md:gap-20 w-full max-w-[1300px] mx-auto px-4 sm:px-6"
      >
        
        {/* 2. EXPLORE SERVICES */}
        <motion.section variants={itemVariants}>
          <CategoryGrid initialCategories={categories} />
        </motion.section>

        {/* 3. TRENDING SEARCHES (Premium Dark Cards) */}
        <motion.section variants={itemVariants}>
          <SectionHeader 
            title={t("ಟ್ರೆಂಡಿಂಗ್ ಸರ್ಚ್ಸ್", "Trending Searches")} 
            icon={Flame} 
            colorClass="text-orange-100" 
            gradient="bg-gradient-to-br from-orange-500 to-red-600"
          />
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory px-2">
            {trendingBusinesses?.length > 0 ? (
              trendingBusinesses.slice(0, 8).map((biz: any) => (
                <div key={`biz-${biz.id}`} className="shrink-0 snap-start">
                   <ProductCard product={biz} />
                </div>
              ))
            ) : (
              <div className="w-full p-8 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl text-slate-500 text-sm font-medium bg-white dark:bg-slate-900/30">
                {t("ಬ್ಯುಸಿನೆಸ್ ಲಿಸ್ಟಿಂಗ್ಸ್ ಲಭ್ಯವಿಲ್ಲ!", "No business listings available!")}
              </div>
            )}
          </div>
        </motion.section>

        {/* 4. RECENT ACTIVITY (USER REVIEWS) */}
        <motion.section variants={itemVariants}>
          <RecentReviewsSwiper initialReviews={recentReviews} />
        </motion.section>

        {/* 5. MOVIE REVIEWS (Glassmorphism Cards) */}
        <motion.section variants={itemVariants}>
          <SectionHeader 
            title={t("ಚಲನಚಿತ್ರ ವಿಮರ್ಶೆಗಳು", "Movie Reviews")} 
            icon={Film} 
            colorClass="text-amber-100" 
            gradient="bg-gradient-to-br from-amber-400 to-orange-500"
          />
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory px-2">
            {movieReviews?.length > 0 ? movieReviews.map((article: any) => {
              const imgSrc = getValidImageUrl(article.image_upload || article.image_url);
              const title = lang === 'kn' ? (article.title_kn || article.title) : article.title;
              return (
              <Link key={`movie-${article.id}`} href={`/article/${article.slug}`} className="group min-w-[280px] w-[280px] md:min-w-[320px] md:w-[320px] shrink-0 snap-start bg-white dark:bg-[#0a1120] border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(245,158,11,0.15)] hover:border-amber-500/30 flex flex-col relative">
                <div className="h-[180px] bg-slate-100 dark:bg-slate-900 relative flex items-center justify-center overflow-hidden shrink-0">
                   {imgSrc ? (
                     <Image src={imgSrc} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                   ) : (
                     <Film size={40} className="text-slate-300 dark:text-slate-700" />
                   )}
                   {/* Gradient overlay for text readability */}
                   <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0a1120] to-transparent opacity-80" />
                   
                   <span className="absolute top-3 left-3 bg-white/90 dark:bg-black/60 backdrop-blur-md text-amber-500 dark:text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-500/20 z-10 uppercase tracking-wider">
                     {article.type_display || "MOVIE"}
                   </span>
                </div>
                <div className="p-5 flex flex-col flex-grow relative z-20 -mt-8">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-[15px] md:text-[16px] line-clamp-2 mb-4 leading-snug drop-shadow-md" title={title}>{title}</h3>
                  <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 font-medium mt-auto border-t border-slate-200 dark:border-slate-800/80 pt-3">
                    <span className="flex items-center gap-1.5"><Clock size={12} className="text-slate-400 dark:text-slate-500"/> {t("ಲೇಟೆಸ್ಟ್", "Latest")}</span>
                    <span className="text-amber-600 dark:text-amber-500 flex items-center gap-1.5 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                      {t("ಹೆಚ್ಚು ಓದಿ", "Read More")} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            )}) : (
              <div className="w-full p-4 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-xl text-slate-500 text-sm bg-white dark:bg-slate-900/30">
                {t("ವಿಮರ್ಶೆಗಳು ಲಭ್ಯವಿಲ್ಲ", "No reviews available")}
              </div>
            )}
          </div>
        </motion.section>

        {/* 6. TRENDING NEWS */}
        <motion.section variants={itemVariants}>
          <SectionHeader 
            title={t("ಟ್ರೆಂಡಿಂಗ್ ನ್ಯೂಸ್", "Trending News")} 
            icon={Newspaper} 
            colorClass="text-sky-100" 
            gradient="bg-gradient-to-br from-sky-400 to-blue-600"
          />
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory px-2">
            {newsArticles?.length > 0 ? newsArticles.map((article: any) => {
              const imgSrc = getValidImageUrl(article.image_upload || article.image_url);
              const title = lang === 'kn' ? (article.title_kn || article.title) : article.title;
              return (
              <Link key={`news-${article.id}`} href={`/article/${article.slug}`} className="group min-w-[280px] w-[280px] md:min-w-[320px] md:w-[320px] shrink-0 snap-start bg-white dark:bg-[#0a1120] border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(14,165,233,0.15)] hover:border-sky-500/30 flex flex-col relative">
                <div className="h-[180px] bg-slate-100 dark:bg-slate-900 relative flex items-center justify-center overflow-hidden shrink-0">
                   {imgSrc ? (
                     <Image src={imgSrc} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                   ) : (
                     <Newspaper size={40} className="text-slate-300 dark:text-slate-700" />
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0a1120] to-transparent opacity-80" />
                   
                   <span className="absolute top-3 left-3 bg-white/90 dark:bg-black/60 backdrop-blur-md text-sky-500 dark:text-sky-400 text-[10px] font-bold px-2.5 py-1 rounded-md border border-sky-200 dark:border-sky-500/20 z-10 uppercase tracking-wider">
                     {article.type_display || "NEWS"}
                   </span>
                </div>
                <div className="p-5 flex flex-col flex-grow relative z-20 -mt-8">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-[15px] md:text-[16px] line-clamp-2 mb-4 leading-snug drop-shadow-md" title={title}>{title}</h3>
                  <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 font-medium mt-auto border-t border-slate-200 dark:border-slate-800/80 pt-3">
                    <span className="flex items-center gap-1.5"><Clock size={12} className="text-slate-400 dark:text-slate-500"/> {t("ಇತ್ತೀಚಿನದು", "Recent")}</span>
                    <span className="text-sky-500 dark:text-sky-400 flex items-center gap-1.5 group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors">
                      {t("ಹೆಚ್ಚು ಓದಿ", "Read More")} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            )}) : (
              <div className="w-full p-4 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-xl text-slate-500 text-sm bg-white dark:bg-slate-900/30">
                {t("ಸುದ್ದಿಗಳು ಲಭ್ಯವಿಲ್ಲ", "No news available")}
              </div>
            )}
          </div>
        </motion.section>

        {/* 7. TRENDING MEDIA */}
        <motion.section variants={itemVariants}>
          <SectionHeader 
            title={t("ಟ್ರೆಂಡಿಂಗ್ ಮೀಡಿಯಾ", "Trending Media")} 
            icon={Hash} 
            colorClass="text-purple-100" 
            gradient="bg-gradient-to-br from-purple-500 to-indigo-600"
          />
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory px-2">
            {socialPosts?.length > 0 ? socialPosts.map((post: any) => {
              const imgSrc = getValidImageUrl(post.thumbnail);
              return (
              <Link key={`social-${post.id}`} href={post.link || "#"} target="_blank" className="min-w-[250px] w-[250px] md:min-w-[280px] md:w-[280px] shrink-0 snap-start bg-white dark:bg-[#0a1120] border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(99,102,241,0.15)] hover:border-indigo-500/30 group cursor-pointer flex flex-col">
                <div className="h-[160px] bg-slate-100 dark:bg-slate-900 relative flex items-center justify-center overflow-hidden">
                   {imgSrc && <Image src={imgSrc} alt={post.title} fill className="object-cover opacity-80 dark:opacity-60 group-hover:opacity-100 dark:group-hover:opacity-40 transition-opacity duration-500" />}
                   <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0a1120] via-white/40 dark:via-[#0a1120]/40 to-transparent opacity-90" />
                   
                   {post.platform === "YOUTUBE" && <Youtube size={56} className="text-red-500 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.3)] z-10" />}
                   {post.platform === "INSTAGRAM" && <Instagram size={48} className="text-pink-500 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.3)] z-10" />}
                   {post.platform === "FACEBOOK" && <Facebook size={48} className="text-blue-500 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)] z-10" />}
                </div>
                <div className="p-4 relative z-20 flex-grow flex flex-col">
                  <h4 className="font-bold text-slate-900 dark:text-white text-[14px] line-clamp-2 mb-3 leading-snug drop-shadow-sm" title={post.title}>{post.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between font-medium mt-auto border-t border-slate-200 dark:border-slate-800/80 pt-3">
                    <span className="flex items-center gap-1.5">
                      <BadgeCheck size={14} className={post.platform === 'YOUTUBE' ? 'text-red-500' : 'text-blue-500'} />
                      {post.channel_name}
                    </span>
                    <span>{post.time_ago}</span>
                  </p>
                </div>
              </Link>
            )}) : (
              <div className="w-full p-4 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-xl text-slate-500 text-sm bg-white dark:bg-slate-900/30">
                {t("ಪೋಸ್ಟ್‌ಗಳು ಲಭ್ಯವಿಲ್ಲ", "No posts available")}
              </div>
            )}
          </div>
        </motion.section>

      </motion.main>
    </div>
  );
}

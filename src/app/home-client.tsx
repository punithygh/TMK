"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Flame, Film, Newspaper, Clock, Hash, BadgeCheck, Youtube, Instagram, Facebook, ArrowRight, Star, Store, MessageCircle } from "lucide-react";

import Hero from '@/components/hero';
import CategoryGrid from "@/components/category-grid";

import { getSupabaseImageUrl } from "@/utils/imageUtils";

export default function HomeClient({
  trendingBusinesses,
  banners,
  movieReviews,
  newsArticles,
  socialPosts,
  categories,
  recentReviews
}: any) {
  const { lang, t } = useLanguage();

  const SectionHeader = ({ title, icon: Icon, colorClass, gradient }: { title: string, icon: any, colorClass: string, gradient: string }) => (
    <header className="flex items-center justify-between mb-8 md:mb-10 border-b border-slate-200 dark:border-slate-800/80 pb-5">
      <h2 className="text-xl md:text-2xl font-extrabold flex items-center gap-3 text-slate-900 dark:text-white tracking-wide">
        <div className={`p-2 rounded-xl ${gradient} shadow-lg shadow-black/10 dark:shadow-black/40`}>
          <Icon className={colorClass} size={22} />
        </div>
        {title}
      </h2>
    </header>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  // ✅ PERFECT SMOOTH SCROLL CONTAINER (Fixes "Stuck" issue on mobile)
  const scrollContainerClass = "flex gap-4 md:gap-6 overflow-x-auto pb-8 pt-2 scrollbar-hide snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 scroll-pl-4 sm:scroll-pl-0 after:content-[''] after:w-1 after:shrink-0";
  
  // ✅ UNIFORM CARD SIZE (Movie Review Size for all cards)
  const unifiedCardClass = "group min-w-[280px] w-[280px] md:min-w-[320px] md:w-[320px] shrink-0 snap-start bg-white dark:bg-[#0a1120] border border-red-200 dark:border-slate-800/80 rounded-xl overflow-hidden transition-all duration-300 flex flex-col relative hover:shadow-md hover:border-red-300 dark:hover:border-slate-700";
  
  // ✅ UNIFORM IMAGE HEIGHT
  const unifiedImageClass = "h-[160px] md:h-[180px] bg-slate-100 dark:bg-slate-900 relative flex items-center justify-center overflow-hidden shrink-0";

  return (
    <div className="flex flex-col gap-4 md:gap-16 pb-24 overflow-x-hidden bg-white dark:bg-[#050b14] min-h-screen transition-colors duration-300">
      
      {/* 1. HERO SECTION */}
      <Hero banners={banners} />

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="flex flex-col gap-20 md:gap-32 w-full max-w-[1300px] mx-auto px-4 sm:px-6 mt-6 md:mt-10"
      >
        
        {/* 2. EXPLORE SERVICES */}
        <motion.section variants={itemVariants} id="categories" className="scroll-mt-24">
          <CategoryGrid initialCategories={categories} />
        </motion.section>

        {/* 3. TRENDING SEARCHES (YELP STYLE STARS + UNIFORM SIZE) */}
        <motion.section variants={itemVariants}>
          <SectionHeader 
            title={t("ಟ್ರೆಂಡಿಂಗ್ ಸರ್ಚ್ಸ್", "Popular Searches")} 
            icon={Flame} 
            colorClass="text-orange-100" 
            gradient="bg-gradient-to-br from-orange-500 to-red-600"
          />
          <div className={scrollContainerClass}>
            {trendingBusinesses?.length > 0 ? trendingBusinesses.slice(0, 8).map((biz: any) => {
              const title = t(biz.name_kn, biz.name);
              const imgSrc = getSupabaseImageUrl(biz.main_image_upload || biz.image_url, { fallbackCategory: biz.category_name });
              const slug = biz.business_area_slug || biz.slug || biz.id;
              const rating = Number(biz.rating) || 5;

              return (
                <Link href={`/business/${slug}`} key={`trending-${biz.id}`} className={`${unifiedCardClass}`}>
                  <div className={unifiedImageClass}>
                    {imgSrc ? (
                      <Image src={imgSrc} alt={title} fill priority={true} sizes="(max-width: 768px) 280px, 320px" className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out premium-img" />
                    ) : (
                      <Store size={40} className="text-slate-300 dark:text-slate-700" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0a1120] to-transparent opacity-80" />
                    
                    {/* 🔥 YELP STYLE 5-STARS ON TOP LEFT OF IMAGE */}
                    <div className="absolute top-3 left-3 bg-white/95 dark:bg-black/70 backdrop-blur-md px-2 py-1.5 rounded-lg border border-amber-200 dark:border-amber-500/30 z-10 flex items-center gap-0.5 shadow-md">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={12} className={star <= rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"} />
                      ))}
                    </div>
                  </div>
                  <div className="p-4 md:p-5 flex flex-col justify-center relative z-20 -mt-8">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-[16px] md:text-[18px] line-clamp-1 text-center drop-shadow-md" title={title}>
                      {title}
                    </h3>
                  </div>
                </Link>
              );
            }) : (
              <div className="w-full p-4 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-xl text-slate-500 text-sm bg-white dark:bg-slate-900/30">
                {t("ಬ್ಯುಸಿನೆಸ್ ಲಿಸ್ಟಿಂಗ್ಸ್ ಲಭ್ಯವಿಲ್ಲ!", "No trending searches available")}
              </div>
            )}
          </div>
        </motion.section>

        {/* 4. MOVIE REVIEWS */}
        <motion.section variants={itemVariants}>
          <SectionHeader 
            title={t("ಚಲನಚಿತ್ರ ವಿಮರ್ಶೆಗಳು", "Movie Reviews")} 
            icon={Film} 
            colorClass="text-amber-100" 
            gradient="bg-gradient-to-br from-amber-400 to-orange-500"
          />
          <div className={scrollContainerClass}>
            {movieReviews?.length > 0 ? movieReviews.map((article: any) => {
              const imgSrc = getSupabaseImageUrl(article.image_upload || article.image_url);
              const title = lang === 'kn' ? (article.title_kn || article.title) : article.title;
              return (
              <Link key={`movie-${article.id}`} href={`/article/${article.slug}`} className={`${unifiedCardClass}`}>
                <div className={unifiedImageClass}>
                   {imgSrc ? (
                     <Image src={imgSrc} alt={title} fill sizes="(max-width: 768px) 280px, 320px" className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                   ) : (
                     <Film size={40} className="text-slate-300 dark:text-slate-700" />
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0a1120] to-transparent opacity-80" />
                   <span className="absolute top-3 left-3 bg-white/90 dark:bg-black/60 backdrop-blur-md text-amber-500 dark:text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-500/20 z-10 uppercase tracking-wider shadow-md">
                     {article.type_display || "MOVIE"}
                   </span>
                </div>
                <div className="p-4 md:p-5 flex flex-col flex-grow relative z-20 -mt-8">
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

        {/* 5. TRENDING NEWS */}
        <motion.section variants={itemVariants}>
          <SectionHeader 
            title={t("ಟ್ರೆಂಡಿಂಗ್ ನ್ಯೂಸ್", "Trending News")} 
            icon={Newspaper} 
            colorClass="text-sky-100" 
            gradient="bg-gradient-to-br from-sky-400 to-blue-600"
          />
          <div className={scrollContainerClass}>
            {newsArticles?.length > 0 ? newsArticles.map((article: any) => {
              const title = t(article.title_kn, article.title);
              const imgSrc = getSupabaseImageUrl(article.main_image_upload || article.image_url, { fallbackCategory: 'news' });
              return (
              <Link key={`news-${article.id}`} href={`/article/${article.slug}`} className={`${unifiedCardClass}`}>
                <div className={unifiedImageClass}>
                   {imgSrc ? (
                     <Image src={imgSrc} alt={title} fill sizes="(max-width: 768px) 280px, 320px" className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                   ) : (
                     <Newspaper size={40} className="text-slate-300 dark:text-slate-700" />
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0a1120] to-transparent opacity-80" />
                   <span className="absolute top-3 left-3 bg-white/90 dark:bg-black/60 backdrop-blur-md text-red-600 dark:text-sky-400 text-[10px] font-bold px-2.5 py-1 rounded-md border border-red-200 dark:border-sky-500/20 z-10 uppercase tracking-wider shadow-md">
                     {article.type_display || "NEWS"}
                   </span>
                </div>
                <div className="p-4 md:p-5 flex flex-col flex-grow relative z-20 -mt-8">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-[15px] md:text-[16px] line-clamp-2 mb-4 leading-snug drop-shadow-md" title={title}>{title}</h3>
                  <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 font-medium mt-auto border-t border-slate-200 dark:border-slate-800/80 pt-3">
                    <span className="flex items-center gap-1.5"><Clock size={12} className="text-slate-400 dark:text-slate-500"/> {t("ಇತ್ತೀಚಿನದು", "Recent")}</span>
                    <span className="text-red-600 dark:text-sky-400 flex items-center gap-1.5 group-hover:text-red-700 dark:group-hover:text-sky-300 transition-colors">
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

        {/* 6. TRENDING MEDIA */}
        <motion.section variants={itemVariants}>
          <SectionHeader 
            title={t("ಟ್ರೆಂಡಿಂಗ್ ಮೀಡಿಯಾ", "Trending Media")} 
            icon={Hash} 
            colorClass="text-purple-100" 
            gradient="bg-gradient-to-br from-purple-500 to-indigo-600"
          />
          <div className={scrollContainerClass}>
            {socialPosts?.length > 0 ? socialPosts.map((post: any) => {
              const imgSrc = getSupabaseImageUrl(post.thumbnail);
              return (
              <Link key={`social-${post.id}`} href={post.link || "#"} target="_blank" className={`${unifiedCardClass}`}>
                <div className={unifiedImageClass}>
                   {imgSrc && <Image src={imgSrc} alt={post.title} fill sizes="(max-width: 768px) 280px, 320px" className="object-cover opacity-80 dark:opacity-60 group-hover:opacity-100 dark:group-hover:opacity-40 transition-opacity duration-500" />}
                   <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0a1120] via-white/40 dark:via-[#0a1120]/40 to-transparent opacity-90" />
                   
                   {post.platform === "YOUTUBE" && <Youtube size={56} className="text-red-500 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.3)] z-10" />}
                   {post.platform === "INSTAGRAM" && <Instagram size={48} className="text-pink-500 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.3)] z-10" />}
                   {post.platform === "FACEBOOK" && <Facebook size={48} className="text-blue-500 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)] z-10" />}
                </div>
                <div className="p-4 md:p-5 flex flex-col flex-grow relative z-20 -mt-8">
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

        {/* 7. RECENT ACTIVITY (REAL DATA) */}
        <motion.section variants={itemVariants}>
          <SectionHeader 
            title={t("ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆಗಳು", "Recent Activity")} 
            icon={MessageCircle} 
            colorClass="text-emerald-100" 
            gradient="bg-gradient-to-br from-emerald-400 to-green-600"
          />
          <div className={scrollContainerClass}>
            {recentReviews?.length > 0 ? recentReviews.map((review: any) => {
              const bizImgSrc = getSupabaseImageUrl(review.business?.main_image_upload || review.business?.image_url);
              const bizName = lang === 'kn' ? (review.business?.name_kn || review.business?.name) : review.business?.name;
              const userAvatar = getSupabaseImageUrl(review.user?.profile_picture); 
              const userName = review.user?.first_name || review.customer_name || "User";
              const rating = Number(review.rating) || 5;

              return (
                <Link 
                  key={`review-${review.id}`} 
                  href={`/business/${review.business?.slug || '#'}`} 
                  className={`${unifiedCardClass}`}
                >
                  <div className={unifiedImageClass}>
                     {bizImgSrc ? (
                       <img src={bizImgSrc} alt={bizName || "Business"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90" loading="lazy" />
                     ) : (
                       <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                         <Store size={40} className="text-slate-400" />
                       </div>
                     )}
                     <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0a1120] via-transparent to-transparent opacity-100" />
                     
                     <div className="absolute top-3 left-3 bg-white/95 dark:bg-black/70 backdrop-blur-md px-2 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-500/30 z-10 flex items-center gap-0.5 shadow-md">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={12} className={star <= rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"} />
                        ))}
                     </div>
                  </div>
                  
                  <div className="p-4 md:p-5 flex flex-col flex-grow relative z-20 -mt-10">
                    <div className="flex items-end gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full border-2 border-white dark:border-[#0a1120] bg-slate-200 dark:bg-slate-800 overflow-hidden shadow-md shrink-0 flex items-center justify-center">
                        {userAvatar ? (
                          <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-slate-500 dark:text-slate-400 font-extrabold text-lg">{userName.charAt(0)}</span>
                        )}
                      </div>
                      <div className="flex flex-col pb-1 overflow-hidden">
                        <span className="text-[14px] font-bold text-slate-900 dark:text-white leading-tight drop-shadow-md truncate">{userName}</span>
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded inline-block mt-0.5 truncate">
                          {t("ವಿಮರ್ಶೆ", "Reviewed")} {bizName}
                        </span>
                      </div>
                    </div>

                    <p className="text-[13px] md:text-[14px] text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed italic font-medium">
                      "{review.comment}"
                    </p>
                  </div>
                </Link>
              );
            }) : (
              <div className="w-full p-4 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-xl text-slate-500 text-sm bg-white dark:bg-slate-900/30">
                {t("ವಿಮರ್ಶೆಗಳು ಲಭ್ಯವಿಲ್ಲ", "No reviews available")}
              </div>
            )}
          </div>
        </motion.section>

      </motion.main>
    </div>
  );
}

import Link from "next/link";
import { Layers, Flame, Film, Newspaper, Clock, Hash, Store, MapPin, Star, BadgeCheck, Youtube, Instagram, Facebook, UserCircle } from "lucide-react";
import Hero from '@/components/hero';
import CategoryGrid from "@/components/category-grid";
import ProductCard from "@/components/product-card";
// 🚨 100% Backend API Functions Imported
import { getAllCourses, getArticles, getSocialPosts } from '@/services/courses';
import Image from "next/image";

const SectionHeader = ({ title, icon: Icon, colorClass }: { title: string, icon: any, colorClass: string }) => (
  <div className="flex items-center justify-between mb-6 border-b border-slate-100/10 pb-3 px-2">
    <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
      <Icon className={colorClass} size={22} />
      {title}
    </h2>
  </div>
);

// 🚀 Premium Helper: To fix Article and Social Media Image URLs just like ProductCard
const getValidImageUrl = (url?: string | null) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  return `${backendUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

export default async function Home() {
  // 🚨 ಡಮ್ಮಿ ಡೇಟಾ ತೆಗೆದು, ಸಂಪೂರ್ಣವಾಗಿ Django API ಇಂದ ಡೇಟಾ ಪಡೆಯಲಾಗುತ್ತಿದೆ
  const trendingBusinesses = await getAllCourses(); 
  const movieReviews = await getArticles('MOVIE'); // ಕೇವಲ Movie ರಿವ್ಯೂಗಳು
  const newsArticles = await getArticles('NEWS');   // ಕೇವಲ News ಸುದ್ದಿಗಳು
  const socialPosts = await getSocialPosts();       // ಸೋಷಿಯಲ್ ಮೀಡಿಯಾ ಪೋಸ್ಟ್‌ಗಳು

  return (
    <div className="flex flex-col gap-10 pb-20 overflow-x-hidden bg-slate-50 min-h-screen">
      
      {/* 1. HERO SECTION */}
      <Hero />

      <main className="flex flex-col gap-12 w-full max-w-[1200px] mx-auto px-4 sm:px-6">
        
        {/* 2. EXPLORE SERVICES */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <CategoryGrid />
        </section>

        {/* 3. TRENDING SEARCHES (API Integrated) */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <SectionHeader title="ಟ್ರೆಂಡಿಂಗ್ ಸರ್ಚ್ಸ್" icon={Flame} colorClass="text-red-500" />
          <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory px-2">
            {trendingBusinesses?.length > 0 ? (
              trendingBusinesses.slice(0, 8).map((biz: any) => (
                <div key={`biz-${biz.id}`} className="min-w-[260px] w-[260px] md:min-w-[280px] shrink-0 snap-start">
                   <ProductCard product={biz} />
                </div>
              ))
            ) : (
              <div className="w-full p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm font-medium">
                ಬ್ಯುಸಿನೆಸ್ ಲಿಸ್ಟಿಂಗ್ಸ್ ಲಭ್ಯವಿಲ್ಲ!
              </div>
            )}
          </div>
        </section>

        {/* 4. MOVIE REVIEWS (API Integrated) */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <SectionHeader title="ಚಲನಚಿತ್ರ ವಿಮರ್ಶೆಗಳು" icon={Film} colorClass="text-amber-500" />
          <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory px-2">
            {movieReviews?.length > 0 ? movieReviews.map((article: any) => {
              const imgSrc = getValidImageUrl(article.image_upload || article.image_url);
              const title = article.title_kn || article.title;
              return (
              <Link key={`movie-${article.id}`} href={`/article/${article.slug}`} className="group min-w-[280px] w-[280px] shrink-0 snap-start bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all flex flex-col">
                <div className="h-[160px] bg-slate-100 relative flex items-center justify-center overflow-hidden shrink-0">
                   {imgSrc ? (
                     <Image src={imgSrc} alt={title} fill className="object-cover group-hover:scale-110 transition-transform" />
                   ) : (
                     <Film size={40} className="text-slate-300 group-hover:scale-110 transition-transform" />
                   )}
                   <span className="absolute top-3 left-3 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded border border-amber-200 z-10">{article.type_display || "MOVIE"}</span>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-slate-800 text-sm line-clamp-2 mb-3" title={title}>{title}</h3>
                  <div className="flex justify-between items-center text-xs text-slate-500 font-medium mt-auto">
                    <span className="flex items-center gap-1"><Clock size={12}/> ಲೇಟೆಸ್ಟ್</span>
                    <span className="text-amber-600 flex items-center gap-1">ಹೆಚ್ಚು ಓದಿ &rarr;</span>
                  </div>
                </div>
              </Link>
            )}) : (
              <div className="w-full p-4 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">ವಿಮರ್ಶೆಗಳು ಲಭ್ಯವಿಲ್ಲ</div>
            )}
          </div>
        </section>

        {/* 5. TRENDING NEWS (API Integrated) */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          <SectionHeader title="ಟ್ರೆಂಡಿಂಗ್ ನ್ಯೂಸ್" icon={Newspaper} colorClass="text-blue-400" />
          <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory px-2">
            {newsArticles?.length > 0 ? newsArticles.map((article: any) => {
              const imgSrc = getValidImageUrl(article.image_upload || article.image_url);
              const title = article.title_kn || article.title;
              return (
              <Link key={`news-${article.id}`} href={`/article/${article.slug}`} className="group min-w-[280px] w-[280px] shrink-0 snap-start bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all flex flex-col">
                <div className="h-[160px] bg-slate-100 relative flex items-center justify-center overflow-hidden shrink-0">
                   {imgSrc ? (
                     <Image src={imgSrc} alt={title} fill className="object-cover group-hover:scale-110 transition-transform" />
                   ) : (
                     <Newspaper size={40} className="text-slate-300 group-hover:scale-110 transition-transform" />
                   )}
                   <span className="absolute top-3 left-3 bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded border border-blue-200 z-10">{article.type_display || "NEWS"}</span>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-slate-800 text-sm line-clamp-2 mb-3" title={title}>{title}</h3>
                  <div className="flex justify-between items-center text-xs text-slate-500 font-medium mt-auto">
                    <span className="flex items-center gap-1"><Clock size={12}/> ಇತ್ತೀಚಿನದು</span>
                    <span className="text-blue-500 flex items-center gap-1">ಹೆಚ್ಚು ಓದಿ &rarr;</span>
                  </div>
                </div>
              </Link>
            )}) : (
              <div className="w-full p-4 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">ಸುದ್ದಿಗಳು ಲಭ್ಯವಿಲ್ಲ</div>
            )}
          </div>
        </section>

        {/* 6. TRENDING MEDIA (API Integrated) */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          <SectionHeader title="ಟ್ರೆಂಡಿಂಗ್ ಮೀಡಿಯಾ" icon={Hash} colorClass="text-blue-500" />
          <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory px-2">
            {socialPosts?.length > 0 ? socialPosts.map((post: any) => {
              const imgSrc = getValidImageUrl(post.thumbnail);
              return (
              <Link key={`social-${post.id}`} href={post.link || "#"} target="_blank" className="min-w-[250px] w-[250px] shrink-0 snap-start bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all group cursor-pointer">
                <div className="h-[140px] bg-slate-900 relative flex items-center justify-center overflow-hidden">
                   {imgSrc && <Image src={imgSrc} alt={post.title} fill className="object-cover opacity-60 group-hover:opacity-40 transition-opacity" />}
                   
                   {post.platform === "YOUTUBE" && <Youtube size={48} className="text-red-500 group-hover:scale-110 transition-transform drop-shadow-lg z-10" />}
                   {post.platform === "INSTAGRAM" && <Instagram size={40} className="text-pink-500 group-hover:scale-110 transition-transform drop-shadow-lg z-10" />}
                   {post.platform === "FACEBOOK" && <Facebook size={40} className="text-blue-500 group-hover:scale-110 transition-transform drop-shadow-lg z-10" />}
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-slate-800 text-sm line-clamp-2 mb-2" title={post.title}>{post.title}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                    <BadgeCheck size={14} className={post.platform === 'YOUTUBE' ? 'text-red-500' : 'text-blue-500'} />
                    {post.channel_name} • {post.time_ago}
                  </p>
                </div>
              </Link>
            )}) : (
              <div className="w-full p-4 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">ಪೋಸ್ಟ್‌ಗಳು ಲಭ್ಯವಿಲ್ಲ</div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
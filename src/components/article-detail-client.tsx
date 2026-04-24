"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, Clock, Tag, ArrowRight, Image as ImageIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { ArticleListing } from "@/services/courses";

interface ArticleDetailClientProps {
  article: ArticleListing;
  relatedArticles: ArticleListing[];
}

const getValidImageUrl = (url?: string | null) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "";
  return `${backendUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

export default function ArticleDetailClient({ article, relatedArticles }: ArticleDetailClientProps) {
  const { lang, t } = useLanguage();
  const [imgError, setImgError] = useState(false);

  const title = lang === 'kn' && article.title_kn ? article.title_kn : article.title;
  const content = lang === 'kn' && article.content_kn ? article.content_kn : article.content;
  
  // Tag processing
  const rawTags = lang === 'kn' && article.tags ? article.tags : article.tags; // Assuming backend has only one tags field or tags_kn isn't in API yet
  const tags = rawTags ? rawTags.split(',').slice(0, 5) : [];

  const mainImageSrc = getValidImageUrl(article.image_upload || article.image_url);
  const hasImage = mainImageSrc && !imgError;

  return (
    <div className="min-h-screen bg-[#050b14] pt-8 pb-20 px-4 md:px-[5%] relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-sky-500/5 rounded-full blur-[150px] -z-10 pointer-events-none"></div>

      <article className="max-w-[1000px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Header Section */}
        <header className="text-center mb-8 md:mb-12">
          <span className="inline-block bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            {article.type_display || article.type}
          </span>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
            {title}
          </h1>
          <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap text-slate-400 text-xs md:text-sm font-medium">
            <span className="flex items-center gap-1.5"><Calendar size={16} /> {new Date(article.created_at).toLocaleDateString(lang === 'kn' ? 'kn-IN' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span className="flex items-center gap-1.5"><User size={16} /> {t("ಅಡ್ಮಿನ್", "Admin")}</span>
            <span className="flex items-center gap-1.5"><Clock size={16} /> 5 {t("ನಿಮಿಷಗಳ ಓದು", "Min Read")}</span>
          </div>
        </header>

        {/* Main Image */}
        <div className="relative w-full h-[250px] md:h-[500px] rounded-2xl overflow-hidden mb-10 bg-slate-900 border border-slate-800 shadow-2xl flex items-center justify-center group">
          {hasImage ? (
            <Image 
              src={mainImageSrc} 
              alt={title} 
              fill 
              sizes="(max-width: 1000px) 100vw, 1000px"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              onError={() => setImgError(true)}
              unoptimized={mainImageSrc.includes('googleusercontent')}
            />
          ) : (
            <ImageIcon size={64} className="text-slate-700" />
          )}
        </div>

        {/* Content Body (Tailwind Typography Plugin is optimal here) */}
        <div className="bg-[#0c1220] p-6 md:p-10 rounded-2xl border border-slate-800 shadow-xl mb-12">
          <div 
            className="prose prose-invert prose-sky max-w-none prose-headings:font-bold prose-a:text-sky-400 prose-img:rounded-xl prose-img:mx-auto"
            dangerouslySetInnerHTML={{ __html: content || `<p class="text-slate-400 italic">${t("ವಿವರಣೆ ಲಭ್ಯವಿಲ್ಲ", "Content not available")}</p>` }}
          />
          
          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-slate-800">
              <span className="text-white font-bold text-sm mr-2 flex items-center gap-2">
                <Tag size={16} className="text-sky-500" /> {t("ಟ್ಯಾಗ್‌ಗಳು:", "Tags:")}
              </span>
              {tags.map((tag, idx) => (
                <span key={idx} className="bg-transparent border border-slate-700 text-slate-400 px-4 py-1.5 rounded-full text-xs font-medium hover:bg-slate-800 hover:text-slate-300 transition-colors">
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Related Articles */}
        {relatedArticles && relatedArticles.length > 0 && (
          <section className="mt-16 pt-10 border-t border-slate-800/50">
            <h2 className="text-2xl font-bold text-white mb-8">{t("ಇನ್ನಷ್ಟು ಓದಿ", "Read More")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relArt) => {
                const relImgSrc = getValidImageUrl(relArt.image_upload || relArt.image_url);
                const relTitle = lang === 'kn' && relArt.title_kn ? relArt.title_kn : relArt.title;
                return (
                  <Link key={relArt.id} href={`/article/${relArt.slug}`} className="group bg-[#0c1220] rounded-xl overflow-hidden border border-slate-800 hover:border-sky-500/50 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-500/10 flex flex-row md:flex-col h-28 md:h-auto">
                    <div className="relative w-[100px] md:w-full h-full md:h-48 shrink-0 bg-slate-900 border-r md:border-r-0 md:border-b border-slate-800 flex items-center justify-center overflow-hidden">
                      {relImgSrc ? (
                        <Image src={relImgSrc} alt={relTitle} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <ImageIcon className="text-slate-700" size={32} />
                      )}
                    </div>
                    <div className="p-4 flex flex-col justify-center md:justify-start flex-1">
                      <h3 className="text-white font-bold text-sm leading-snug line-clamp-2 group-hover:text-sky-400 transition-colors mb-2">
                        {relTitle}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-auto md:mt-2">
                        <Calendar size={12} /> {new Date(relArt.created_at).toLocaleDateString(lang === 'kn' ? 'kn-IN' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

      </article>
    </div>
  );
}

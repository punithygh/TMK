import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowRight, LucideIcon } from "lucide-react";

interface Article {
  id: number;
  title: string;
  slug: string;
  image: string;
  type: string;
  created_at: string;
}

interface ArticleScrollProps {
  title: string;
  icon: LucideIcon;
  articles: Article[];
  accentColor: string; // e.g., "text-blue-500" or "text-red-500"
}

const ArticleScroll = ({ title, icon: Icon, articles, accentColor }: ArticleScrollProps) => {
  return (
    <section className="mobile-container py-10">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <Icon className={accentColor} size={24} />
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">{title}</h2>
        </div>
        <Link href="/articles" className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
          View All <ArrowRight size={14} />
        </Link>
      </div>

      {/* 🚀 Premium Horizontal Snap Scroll */}
      <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.slug}`}
            className="min-w-[280px] md:min-w-[320px] snap-start group"
          >
            <div className="relative h-48 rounded-2xl overflow-hidden mb-4 shadow-lg group-hover:shadow-blue-500/20 transition-all">
              <Image
                src={article.image || "/placeholder.jpg"}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3">
                <span className="bg-white/90 backdrop-blur-md text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider text-slate-900 border border-white/20">
                  {article.type}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-md font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                {article.title}
              </h3>
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Clock size={14} />
                <span>{article.created_at} ago</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ArticleScroll;

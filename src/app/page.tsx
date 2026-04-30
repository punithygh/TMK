import { getSupabaseBusinesses } from '@/services/legacyStubs';
import { 
  getBanners, 
  getArticles, 
  getSocialPosts, 
  getCategories, 
  getRecentReviews 
} from '@/services/courses';
import HomeClient from './home-client';

// 🚀 TOP-LEVEL TRICK 1: Aggressive Page Caching (Yelp Grade Speed)
// This makes the homepage load in under 50ms in production and 
// completely eliminates database load. Updates once every hour.
export const revalidate = 3600;

export default async function Home() {
  // 🚀 TOP-LEVEL TRICK 2: Staggered Fetching
  // Instead of blasting Supabase with 7 parallel connections (which causes the 
  // UND_ERR_CONNECT_TIMEOUT on the Free Tier), we batch them to avoid network choking.
  
  // Batch 1: Critical UI Data
  const [trendingBusinesses, banners, categories] = await Promise.all([
    getSupabaseBusinesses({ is_top_search: 'true', sort_by: 'popular', limit: 12 }).catch(() => []),
    getBanners().catch(() => []),
    getCategories().catch(() => [])
  ]);

  // Batch 2: Secondary Content
  const [movieReviews, newsArticles, socialPosts, recentReviews] = await Promise.all([
    getArticles('MOVIE').catch(() => []),
    getArticles('NEWS').catch(() => []),
    getSocialPosts().catch(() => []),
    getRecentReviews().catch(() => [])
  ]);

  return (
    <HomeClient 
      trendingBusinesses={trendingBusinesses}
      banners={banners}
      movieReviews={movieReviews}
      newsArticles={newsArticles}
      socialPosts={socialPosts}
      categories={categories}
      recentReviews={recentReviews}
    />
  );
}

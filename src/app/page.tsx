import { 
  getSupabaseBusinesses, 
  getSupabaseBanners,
  getSupabaseArticles,
  getSupabaseSocialPosts,
  getSupabaseCategories,
  getSupabaseRecentReviews
} from '@/services/supabaseData';
import HomeClient from './home-client';

export default async function Home() {
  const [
    trendingBusinesses,
    banners,
    movieReviews,
    newsArticles,
    socialPosts,
    categories,
    recentReviews
  ] = await Promise.all([
    getSupabaseBusinesses({ is_top_search: 'true', sort_by: 'popular', limit: 12 }),
    getSupabaseBanners(),
    getSupabaseArticles('MOVIE'),
    getSupabaseArticles('NEWS'),
    getSupabaseSocialPosts(),
    getSupabaseCategories(),
    getSupabaseRecentReviews()
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
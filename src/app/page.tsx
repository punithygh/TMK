import { getAllCourses, getArticles, getSocialPosts, getCategories, getRecentReviews } from '@/services/courses';
import HomeClient from './home-client';

export default async function Home() {
  // 🚨 ಡಮ್ಮಿ ಡೇಟಾ ತೆಗೆದು, ಸಂಪೂರ್ಣವಾಗಿ Django API ಇಂದ ಡೇಟಾ ಪಡೆಯಲಾಗುತ್ತಿದೆ
  // 🚨 High Speed Server-Side Fetching with cache: 'no-store'
  // 🚀 PARALLEL FETCHING: Promise.all ಅನ್ನು ಬಳಸಿ 6 API ಕಾಲ್‌ಗಳನ್ನು ಏಕಕಾಲದಲ್ಲಿ (Parallel) ಫೆಚ್ ಮಾಡಲಾಗುತ್ತಿದೆ.
  const [
    trendingBusinesses,
    movieReviews,
    newsArticles,
    socialPosts,
    categories,
    recentReviews
  ] = await Promise.all([
    getAllCourses(),
    getArticles('MOVIE'),
    getArticles('NEWS'),
    getSocialPosts(),
    getCategories(),
    getRecentReviews()
  ]);

  return (
    <HomeClient 
      trendingBusinesses={trendingBusinesses}
      movieReviews={movieReviews}
      newsArticles={newsArticles}
      socialPosts={socialPosts}
      categories={categories}
      recentReviews={recentReviews}
    />
  );
}
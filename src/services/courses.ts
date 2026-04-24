import api from './api';

// 🚨 100% ACCURATE DJANGO MAPPING

export interface BusinessListing {
  id: number;
  name: string;
  name_kn?: string | null;
  slug: string;
  slug_kn?: string | null;
  business_area_slug: string;
  category_name: string;
  category_name_kn?: string | null;
  area: string;
  area_kn?: string | null;
  main_image_upload?: string | null;
  image_url?: string | null;   // Google images
  image_url_2?: string | null; // Extra image slot 2
  image_url_3?: string | null; // Extra image slot 3
  gallery_images?: string[] | null; // Real backend: ["http...", "http..."]
  rating: number;
  review_count?: number | null;
  is_verified: boolean;
  is_open?: boolean | null;
  pure_veg?: boolean;
  emergency_24x7?: boolean;
  working_hours?: string | null; // Backend sends plain string e.g. "9:00 AM - 9:00 PM"
  // Detail page extra fields
  description?: string;
  description_kn?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  pincode?: string;
  amenities?: string | null;
  amenities_kn?: string | null;
  services_offered?: string | null;
  services_offered_kn?: string | null;
  landmark_info?: string | null;
  landmark_info_kn?: string | null;
  subtitle?: string | null;
  subtitle_kn?: string | null;
  map_link?: string | null;
  // Flags
  top_search?: boolean;
  hot_deal?: boolean;
  dynamic_badges?: string[];
}

// Legacy interface kept for backward compat — no longer used for working hours
export interface WorkingHoursEntry {
  open: string;
  close: string;
  closed: boolean;
}
export interface WorkingHours {
  mon?: WorkingHoursEntry;
  tue?: WorkingHoursEntry;
  wed?: WorkingHoursEntry;
  thu?: WorkingHoursEntry;
  fri?: WorkingHoursEntry;
  sat?: WorkingHoursEntry;
  sun?: WorkingHoursEntry;
}

export interface ArticleListing {
  id: number;
  title: string;
  title_kn?: string | null;
  slug: string;
  type: 'MOVIE' | 'TOURIST' | 'NEWS' | 'FOOD' | 'BLOG';
  type_display: string;
  image_upload?: string | null;
  image_url?: string | null;
  content?: string | null;
  content_kn?: string | null;
  tags?: string | null;
  created_at: string;
}

export interface SocialPost {
  id: number;
  title: string;
  platform: 'YOUTUBE' | 'INSTAGRAM' | 'FACEBOOK';
  link: string;
  thumbnail?: string | null;
  channel_name: string;
  time_ago: string;
}

export interface RecentReview {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
  business_name: string;
  business_name_kn?: string | null;
  business_area_slug: string;
  category_slug: string;
  category_slug_en: string;
}

export interface CategoryListing {
  id: number;
  name: string;
  name_kn: string;
  slug: string;
  icon_url?: string;
}

export interface Banner {
  id: number;
  title: string;
  image_url: string | null;
  link_url?: string | null;
  order: number;
}

// 🚀 NATIVE FETCH WRAPPER FOR SERVER COMPONENTS (HIGH SPEED + NO CACHE STALENESS)
const serverFetch = async (endpoint: string) => {
  // Use centralized environment variable for API
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1` : "";
  const url = `${API_BASE_URL}${endpoint}`;
  
  const res = await fetch(url, {
    next: { revalidate: 3600 }, // 🚨 ISR Caching: Revalidate every 1 hour
    headers: { 'Content-Type': 'application/json' }
  });

  if (!res.ok) {
    throw new Error(`API fetch failed for ${url}: ${res.status}`);
  }

  const data = await res.json();
  return data.results || data;
};

// 🚀 1. ಎಲ್ಲಾ ಬ್ಯುಸಿನೆಸ್ ಲಿಸ್ಟ್ ಫೆಚ್ ಮಾಡುವುದು (ಹೋಮ್ / ಲಿಸ್ಟಿಂಗ್ ಪೇಜ್)
export const getAllCourses = async (): Promise<BusinessListing[]> => {
  try {
    const data = await serverFetch('/businesses/');
    return data as BusinessListing[];
  } catch (error) {
    console.error('🚨 API Error (Businesses):', error);
    return [];
  }
};

// 🚀 2. ಸಿಂಗಲ್ ಬ್ಯುಸಿನೆಸ್ ಫೆಚ್ ಮಾಡುವುದು (Business Detail Page ಗಾಗಿ) 🚨 ಹೊಸದು 🚨
export const getOneCourse = async (slug: string): Promise<BusinessListing | null> => {
  try {
    const data = await serverFetch(`/businesses/${encodeURIComponent(slug)}/`);
    return data as BusinessListing;
  } catch (error: any) {
    console.error(`🚨 API Error (getOneCourse - ${slug}):`, error);
    return null;
  }
};

// 🚀 3. ಆರ್ಟಿಕಲ್ಸ್ ಫೆಚ್ ಮಾಡುವುದು (News/Reviews)
export const getArticles = async (type?: string): Promise<ArticleListing[]> => {
  try {
    const url = type ? `/articles/?type=${type}` : '/articles/';
    const data = await serverFetch(url);
    return data as ArticleListing[];
  } catch (error) {
    console.error('🚨 API Error (Articles):', error);
    return [];
  }
};

// 🚀 3.5 ಸಿಂಗಲ್ ಆರ್ಟಿಕಲ್ ಫೆಚ್ ಮಾಡುವುದು 🚨 ಹೊಸದು 🚨
export const getOneArticle = async (slug: string): Promise<ArticleListing | null> => {
  try {
    // 🚨 Workaround: API doesn't have a direct /articles/<slug> endpoint, so we fetch and filter
    const articles = await getArticles();
    return articles.find(article => article.slug === slug) || null;
  } catch (error) {
    console.error(`🚨 API Error (getOneArticle - ${slug}):`, error);
    return null;
  }
};

// 🚀 4. ಸೋಷಿಯಲ್ ಮೀಡಿಯಾ ಪೋಸ್ಟ್ ಫೆಚ್ ಮಾಡುವುದು
export const getSocialPosts = async (): Promise<SocialPost[]> => {
  try {
    const data = await serverFetch('/social-posts/'); 
    return data as SocialPost[];
  } catch (error) {
    console.error('🚨 API Error (Social):', error);
    return [];
  }
};

// 🚀 5. ಇತ್ತೀಚಿನ ರಿವ್ಯೂಗಳನ್ನು ಫೆಚ್ ಮಾಡುವುದು (Home Page - Recent Activity)
export const getRecentReviews = async (): Promise<RecentReview[]> => {
  try {
    const data = await serverFetch('/recent-reviews/');
    return data as RecentReview[];
  } catch (error) {
    console.error('🚨 API Error (Recent Reviews):', error);
    return [];
  }
};

// 🚀 6. ಕ್ಯಾಟಗರಿ ಫೆಚ್ ಮಾಡುವುದು (Home Page)
export const getCategories = async (): Promise<CategoryListing[]> => {
  try {
    const data = await serverFetch('/categories/');
    return data as CategoryListing[];
  } catch (error) {
    console.error('🚨 API Error (Categories):', error);
    return [];
  }
};

// 🚀 7. Banner Slider Fetch (Homepage - /api/v1/banners/)
export const getBanners = async (): Promise<Banner[]> => {
  try {
    const data = await serverFetch('/banners/');
    return data as Banner[];
  } catch (error) {
    console.error('🚨 API Error (Banners):', error);
    return [];
  }
};
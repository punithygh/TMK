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
  image_url?: string | null; // Google images ಗಾಗಿ
  rating: number;
  is_verified: boolean;
  pure_veg?: boolean;
  emergency_24x7?: boolean;
  // ಡೀಟೇಲ್ ಪೇಜ್‌ಗೆ ಬೇಕಾಗುವ ಹೆಚ್ಚುವರಿ ಫೀಲ್ಡ್‌ಗಳು (ಭವಿಷ್ಯಕ್ಕಾಗಿ)
  description?: string;
  description_kn?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  pincode?: string;
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

// 🚀 1. ಎಲ್ಲಾ ಬ್ಯುಸಿನೆಸ್ ಲಿಸ್ಟ್ ಫೆಚ್ ಮಾಡುವುದು (ಹೋಮ್ / ಲಿಸ್ಟಿಂಗ್ ಪೇಜ್)
export const getAllCourses = async (): Promise<BusinessListing[]> => {
  try {
    const response = await api.get('/businesses/');
    const data = response.data?.results || response.data || [];
    return data as BusinessListing[];
  } catch (error) {
    console.error('🚨 API Error (Businesses):', error);
    return [];
  }
};

// 🚀 2. ಸಿಂಗಲ್ ಬ್ಯುಸಿನೆಸ್ ಫೆಚ್ ಮಾಡುವುದು (Business Detail Page ಗಾಗಿ) 🚨 ಹೊಸದು 🚨
export const getOneCourse = async (slug: string): Promise<BusinessListing | null> => {
  try {
    // 🚨 CRITICAL FIX: Use the exact dynamic path variable expected by Django BusinessDetailAPIView
    // Do NOT use ?business_area_slug= query parameters
    const response = await api.get(`/businesses/${encodeURIComponent(slug)}/`);
    
    // Django's DetailView returns a single object, not an array of results
    const business = response.data;
    
    if (!business) {
      console.warn(`⚠️ Business not found for slug: ${slug}`);
      return null;
    }
    
    return business as BusinessListing;
  } catch (error: any) {
    // 404 ಬಂದರೆ null ರಿಟರ್ನ್ ಮಾಡುತ್ತದೆ (Next.js notFound() ಟ್ರಿಗರ್ ಮಾಡಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ)
    if (error.response && error.response.status === 404) {
      console.warn(`⚠️ Business not found for business_area_slug: ${slug}`);
      return null;
    }
    console.error(`🚨 API Error (getOneCourse - ${slug}):`, error);
    return null;
  }
};

// 🚀 3. ಆರ್ಟಿಕಲ್ಸ್ ಫೆಚ್ ಮಾಡುವುದು (News/Reviews)
export const getArticles = async (type?: string): Promise<ArticleListing[]> => {
  try {
    const url = type ? `/articles/?type=${type}` : '/articles/';
    const response = await api.get(url);
    const data = response.data?.results || response.data || [];
    return data as ArticleListing[];
  } catch (error) {
    console.error('🚨 API Error (Articles):', error);
    return [];
  }
};

// 🚀 4. ಸೋಷಿಯಲ್ ಮೀಡಿಯಾ ಪೋಸ್ಟ್ ಫೆಚ್ ಮಾಡುವುದು
export const getSocialPosts = async (): Promise<SocialPost[]> => {
  try {
    const response = await api.get('/social-posts/'); 
    const data = response.data?.results || response.data || [];
    return data as SocialPost[];
  } catch (error) {
    console.error('🚨 API Error (Social):', error);
    return [];
  }
};
import api from './api';

// 🚨 100% ACCURATE DJANGO MAPPING (Based on your models.py)
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

// 🚀 1. ಬ್ಯುಸಿನೆಸ್ ಲಿಸ್ಟ್ ಫೆಚ್ ಮಾಡುವುದು
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

// 🚀 2. ಆರ್ಟಿಕಲ್ಸ್ ಫೆಚ್ ಮಾಡುವುದು (News/Reviews)
export const getArticles = async (type?: string): Promise<ArticleListing[]> => {
  try {
    // ಒಂದು ವೇಳೆ type ಕೊಟ್ಟರೆ ಫಿಲ್ಟರ್ ಮಾಡುತ್ತದೆ (ಉದಾ: ?type=MOVIE)
    const url = type ? `/articles/?type=${type}` : '/articles/';
    const response = await api.get(url);
    const data = response.data?.results || response.data || [];
    return data as ArticleListing[];
  } catch (error) {
    console.error('🚨 API Error (Articles):', error);
    return [];
  }
};

// 🚀 3. ಸೋಷಿಯಲ್ ಮೀಡಿಯಾ ಪೋಸ್ಟ್ ಫೆಚ್ ಮಾಡುವುದು
export const getSocialPosts = async (): Promise<SocialPost[]> => {
  try {
    const response = await api.get('/social-posts/'); // ನಿಮ್ಮ URLs ಚೆಕ್ ಮಾಡಿ
    const data = response.data?.results || response.data || [];
    return data as SocialPost[];
  } catch (error) {
    console.error('🚨 API Error (Social):', error);
    return [];
  }
};
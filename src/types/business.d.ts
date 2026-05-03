/**
 * types/business.d.ts
 * TypeScript interfaces for business-related data
 */

export interface BusinessListing {
  id: number | string;
  name: string;
  name_kn?: string;
  slug?: string;
  business_area_slug?: string;
  category_name?: string;
  category_name_kn?: string;
  area?: string;
  address?: string;
  pincode?: string;
  phone?: string;
  description?: string;
  rating?: number | string;
  review_count?: number;
  image_url?: string;
  main_image_upload?: string;
  lat?: number | string;
  lng?: number | string;
  is_verified?: boolean;
  is_top_search?: boolean;
  is_featured?: boolean;
}

export interface Review {
  id: number;
  business_id: number | string;
  user_name?: string;
  user_first_name?: string;
  rating: number;
  comment?: string;
  created_at: string;
  business_image?: string;
  business_name?: string;
  business_name_kn?: string;
  business_area_slug?: string;
  user_profile_picture?: string;
}

export interface Category {
  id: number;
  name: string;
  name_kn?: string;
  slug?: string;
  icon?: string;
  count?: number;
  is_active?: boolean;
}

export interface Banner {
  id: number;
  title?: string;
  image_url?: string;
  link?: string;
  is_active?: boolean;
}

export interface Article {
  id: number;
  title: string;
  title_kn?: string;
  slug: string;
  type: string;
  type_display?: string;
  image_url?: string;
  image_upload?: string;
  created_at?: string;
}

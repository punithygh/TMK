import { supabase } from '@/utils/supabase';
import { BusinessListing } from './courses';

// 🚀 1. FETCH ALL BUSINESSES
export const getSupabaseBusinesses = async (options: {
  category?: string;
  search?: string;
  star_rating?: string;
  is_verified?: string;
  is_featured?: string;
  is_top_search?: string;
  is_trusted?: string;
  limit?: number;
  offset?: number;
  sort_by?: string;
} = {}): Promise<BusinessListing[]> => {
  console.log(`🔍 Fetching businesses with filters:`, options);
  
  // 🚨 Use !inner join if we are filtering by category to ensure results are restricted
  const categoryJoin = options.category 
    ? 'category:directory_category!inner(name, name_kn, slug)' 
    : 'category:directory_category(name, name_kn, slug)';

  let query = supabase
    .from('directory_business')
    .select(`*, ${categoryJoin}, gallery:directory_businessgallery(image)`);

  if (options.category) {
    // When using !inner, we can filter directly on the joined columns
    // We use .or to check both name and slug for the category
    query = query.or(`name.ilike.%${options.category}%,slug.ilike.%${options.category}%`, { foreignTable: 'directory_category' });
  }

  if (options.search) {
    query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`);
  }

  if (options.star_rating) {
    query = query.gte('rating', parseFloat(options.star_rating));
  }

  if (options.is_verified === "true") query = query.eq('is_verified', true);
  if (options.is_featured === "true") query = query.eq('is_featured', true);
  if (options.is_top_search === "true") query = query.eq('is_top_search', true);
  if (options.is_trusted === "true") query = query.eq('is_trusted', true);

  // Sorting
  if (options.sort_by === 'rating') {
    query = query.order('rating', { ascending: false });
  } else if (options.sort_by === 'popular') {
    query = query.order('page_views', { ascending: false });
  } else {
    query = query.order('id', { ascending: true });
  }

  // Pagination
  const limit = options.limit || 50;
  const offset = options.offset || 0;
  query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;

  if (error) {
    console.error('🚨 Supabase Error (Businesses):', JSON.stringify(error, null, 2));
    return [];
  }

  // Parse locations, flatten category, and handle image fallbacks
  const parsedData = (data || []).map((biz: any) => {
    // 1. Flatten category
    if (biz.category) {
      biz.category_name = biz.category.name;
      biz.category_name_kn = biz.category.name_kn;
      biz.category_slug = biz.category.slug;
    }

    // 2. Handle Image Fallback (Gallery -> Main Image)
    if (biz.gallery && biz.gallery.length > 0) {
      biz.gallery_images = biz.gallery.map((g: any) => g.image);
      if (!biz.main_image_upload) {
        biz.main_image_upload = biz.gallery_images[0];
      }
    }

    // 3. Parse PostGIS Point
    if (typeof biz.location === 'string' && biz.location.startsWith('POINT')) {
      const parts = biz.location.replace('POINT(', '').replace(')', '').split(' ');
      biz.lng = parseFloat(parts[0]);
      biz.lat = parseFloat(parts[1]);
    }
    return biz;
  });

  return parsedData as BusinessListing[];
};

// 🚀 2. FETCH SINGLE BUSINESS BY SLUG
export const getSupabaseBusinessBySlug = async (slug: string): Promise<BusinessListing | null> => {
  console.log(`🔍 Fetching business by slug: ${slug}`);
  const { data, error } = await supabase
    .from('directory_business')
    .select('*, category:directory_category(name, name_kn, slug), gallery:directory_businessgallery(image)')
    .or(`slug.eq.${slug},area_slug.eq.${slug}`)
    .single();

  // 🚀 SMART FALLBACK: If slug fails, try fetching by first 2 words of the name
  if (error && error.code === 'PGRST116') {
    console.log(`🔄 Slug not found. Attempting smart fallback...`);
    
    // Try matching the first 2 words (e.g. "star-convention" from "star-convention-hall-ring-road")
    const slugParts = slug.split('-');
    const partialMatch = slugParts.length > 1 ? `${slugParts[0]} ${slugParts[1]}` : slugParts[0];
    
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('directory_business')
      .select('*, category:directory_category(name, name_kn, slug), gallery:directory_businessgallery(image)')
      .ilike('name', `%${partialMatch}%`) // "star convention" matches "Star Convention Hall"
      .limit(1)
      .single();
    
    if (!fallbackError && fallbackData) {
      console.log(`✅ Smart Fallback Success: Found "${fallbackData.name}" using keywords "${partialMatch}"`);
      return fallbackData as BusinessListing;
    }
  }

  if (error) {
    if (error.code === 'PGRST116') {
      console.warn(`⚠️ Business not found for slug: ${slug}`);
    } else {
      console.error(`🚨 Supabase Error (Single Business - ${slug}):`, JSON.stringify(error, null, 2));
    }
    return null;
  }

  const business = data as any;
  
  // Flatten category
  if (business.category) {
    business.category_name = business.category.name;
    business.category_name_kn = business.category.name_kn;
    business.category_slug = business.category.slug;
  }

  // Handle Image Fallback & Gallery Mapping
  if (business.gallery && business.gallery.length > 0) {
    business.gallery_images = business.gallery.map((g: any) => g.image);
    if (!business.main_image_upload) {
      business.main_image_upload = business.gallery_images[0];
    }
  }

  // 🚀 Parse PostGIS Point: POINT(long lat)
  if (typeof business.location === 'string' && business.location.startsWith('POINT')) {
    const parts = business.location.replace('POINT(', '').replace(')', '').split(' ');
    business.lng = parseFloat(parts[0]);
    business.lat = parseFloat(parts[1]);
  }

  console.log('✅ Success: Business found:', business.name);
  return business;
};

// 🚀 3. GIS RADIUS SEARCH (RPC)
export const getNearbySupabaseBusinesses = async (lat: number, lng: number, radius: number = 5000) => {
  console.log(`🔍 Searching for businesses within ${radius}m of [${lat}, ${lng}]`);
  const { data, error } = await supabase.rpc('get_nearby_businesses', {
    user_lat: lat,
    user_long: lng,
    radius_meters: radius
  });

  if (error) {
    console.error('🚨 Supabase RPC Error (Nearby):', JSON.stringify(error, null, 2));
    return [];
  }

  // Parse locations for all results
  const parsedData = (data || []).map((biz: any) => {
    if (typeof biz.location === 'string' && biz.location.startsWith('POINT')) {
      const parts = biz.location.replace('POINT(', '').replace(')', '').split(' ');
      biz.lng = parseFloat(parts[0]);
      biz.lat = parseFloat(parts[1]);
    }
    return biz;
  });

  console.log(`✅ Success: Found ${parsedData.length} nearby businesses.`);
  return parsedData;
};

// 🚀 4. FETCH BANNERS
export const getSupabaseBanners = async () => {
  const { data, error } = await supabase
    .from('directory_banner')
    .select('*')
    .eq('is_active', true)
    .order('order', { ascending: true });

  if (error) {
    console.error('🚨 Supabase Error (Banners):', JSON.stringify(error, null, 2));
    return [];
  }

  const banners = (data || []).map((b: any) => {
    const imgPath = b.image || b.image_url;
    return {
      ...b,
      image_url: imgPath
    };
  });

  console.log(`✅ Success: Fetched ${banners.length} banners.`);
  return banners;
};

// 🚀 5. FETCH CATEGORIES
export const getSupabaseCategories = async () => {
  const { data, error } = await supabase
    .from('directory_category')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('🚨 Supabase Error (Categories):', error);
    return [];
  }
  return data;
};

// 🚀 6. FETCH ARTICLES (NEWS/MOVIES)
export const getSupabaseArticles = async (type?: string) => {
  let query = supabase.from('directory_article').select('*').eq('status', 'PUBLISHED');
  if (type) query = query.eq('type', type);
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    console.error('🚨 Supabase Error (Articles):', error);
    return [];
  }

  const articles = (data || []).map((a: any) => ({
    ...a,
    image_url: a.image_upload || a.image_url,
    type_display: a.type // Map type to type_display if needed
  }));

  console.log(`✅ Success: Fetched ${articles.length} articles.`);
  return articles;
};

// 🚀 7. FETCH SOCIAL POSTS
export const getSupabaseSocialPosts = async () => {
  const { data, error } = await supabase
    .from('directory_socialmediapost')
    .select('*')
    .eq('status', 'PUBLISHED')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('🚨 Supabase Error (Social):', error);
    return [];
  }
  return data;
};

// 🚀 8. FETCH RECENT REVIEWS
export const getSupabaseRecentReviews = async () => {
  const { data, error } = await supabase
    .from('directory_review')
    .select(`
      *,
      business:directory_business(name, name_kn, slug, area_slug, main_image_upload, category:directory_category(slug))
    `)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('🚨 Supabase Error (Reviews):', error);
    return [];
  }
  return data;
};

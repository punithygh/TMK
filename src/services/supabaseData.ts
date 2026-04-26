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
  const isId = /^\d+$/.test(slug);
  let query = supabase
    .from('directory_business')
    .select('*, category:directory_category(name, name_kn, slug), gallery:directory_businessgallery(image)');
  
  if (isId) {
    query = query.or(`slug.eq.${slug},id.eq.${slug}`);
  } else {
    query = query.or(`slug.eq.${slug},area_slug.eq.${slug}`);
  }

  const { data, error } = await query.single();

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
    radius_meters: Number(radius)   // explicit Number cast — avoids INT vs FLOAT overload conflict
  });

  if (error) {
    console.error('🚨 Supabase RPC Error (Nearby):', JSON.stringify(error, null, 2));
    return [];
  }

  // 🚀 RPC now returns extracted_lat / extracted_lng directly via ST_Y / ST_X
  // No more manual POINT string parsing needed
  const parsedData = (data || []).map((biz: any) => ({
    ...biz,
    lat: biz.extracted_lat ?? biz.lat,
    lng: biz.extracted_lng ?? biz.lng,
  }));

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
      user:auth_user(id, first_name, last_name, username, profile_image),
      business:directory_business(name, name_kn, slug, area_slug, main_image_upload, category:directory_category(slug))
    `)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('🚨 Supabase Error (Reviews):', error);
    return [];
  }

  return (data || []).map((r: any) => ({
    id: r.id,
    user_name: `${r.user?.first_name || ''} ${r.user?.last_name || ''}`.trim() || 'Anonymous',
    user_id: r.user?.id,
    profile_image: r.user?.profile_image,
    rating: r.rating,
    comment: r.comment,
    created_at: r.created_at,
    business_name: r.business?.name,
    business_name_kn: r.business?.name_kn,
    business_area_slug: r.business?.area_slug,
    category_slug: r.business?.category?.slug,
    category_slug_en: r.business?.category?.slug
  }));
};
// 🚀 9. FETCH REVIEWS FOR A BUSINESS
export const getSupabaseReviewsForBusiness = async (businessId: number, currentUserId?: number): Promise<any[]> => {
  console.log(`🔍 Fetching reviews for business ID: ${businessId}`);
  const { data, error } = await supabase
    .from('directory_review')
    .select(`
      *,
      user:auth_user(id, first_name, last_name, username, profile_image),
      reactions:directory_review_reaction(reaction_type, user_id)
    `)
    .eq('business_id', businessId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('🚨 Supabase Error (Reviews for Business):', error);
    return [];
  }

  // Process reactions to get counts and current user's state
  return (data || []).map((review: any) => {
    const reactions = review.reactions || [];
    const counts = {
      HELPFUL: reactions.filter((r: any) => r.reaction_type === 'HELPFUL').length,
      FUNNY: reactions.filter((r: any) => r.reaction_type === 'FUNNY').length,
      COOL: reactions.filter((r: any) => r.reaction_type === 'COOL').length,
    };

    const userReacted = {
      HELPFUL: reactions.some((r: any) => r.user_id === currentUserId && r.reaction_type === 'HELPFUL'),
      FUNNY: reactions.some((r: any) => r.user_id === currentUserId && r.reaction_type === 'FUNNY'),
      COOL: reactions.some((r: any) => r.user_id === currentUserId && r.reaction_type === 'COOL'),
    };

    return {
      ...review,
      reaction_counts: counts,
      user_reacted: userReacted
    };
  });
};

// 🚀 10. TOGGLE REVIEW REACTION
export const toggleSupabaseReviewReaction = async (
  reviewId: number, 
  userId: number, 
  reactionType: 'HELPFUL' | 'FUNNY' | 'COOL'
): Promise<{ status: 'added' | 'removed' }> => {
  console.log(`🔘 Toggling ${reactionType} for review ${reviewId} by user ${userId}`);
  
  // 1. Check if reaction exists
  const { data: existing, error: fetchError } = await supabase
    .from('directory_review_reaction')
    .select('id')
    .eq('review_id', reviewId)
    .eq('user_id', userId)
    .eq('reaction_type', reactionType)
    .maybeSingle();

  if (fetchError) throw fetchError;

  if (existing) {
    // 2. Remove if exists
    const { error: deleteError } = await supabase
      .from('directory_review_reaction')
      .delete()
      .eq('id', existing.id);
    
    if (deleteError) throw deleteError;
    return { status: 'removed' };
  } else {
    // 3. Add if doesn't exist
    const { error: insertError } = await supabase
      .from('directory_review_reaction')
      .insert({
        review_id: reviewId,
        user_id: userId,
        reaction_type: reactionType
      });

    if (insertError) throw insertError;
    return { status: 'added' };
  }
};

// 🚀 11. FETCH USER PUBLIC PROFILE
export const getUserPublicProfile = async (userId: number) => {
  console.log(`👤 Fetching public profile for user ID: ${userId}`);
  
  // 1. Get basic user info
  const { data: user, error: userError } = await supabase
    .from('auth_user')
    .select('id, first_name, last_name, username, date_joined')
    .eq('id', userId)
    .single();

  if (userError) {
    console.error('🚨 Error fetching user info:', userError);
    return null;
  }

  // 2. Get user reviews with business names
  const { data: reviews, error: reviewsError } = await supabase
    .from('directory_review')
    .select(`
      *,
      business:directory_business(id, name, name_kn, main_image_upload)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (reviewsError) {
    console.error('🚨 Error fetching user reviews:', reviewsError);
  }

  const reviewCount = reviews?.length || 0;
  const isElite = reviewCount >= 5;

  return {
    ...user,
    reviews: reviews || [],
    review_count: reviewCount,
    photo_count: 0,
    is_elite: isElite,
    status_label: isElite ? "Elite Member" : "Active Member"
  };
};

// 🚀 12. FETCH USER DASHBOARD (REVIEWS & BOOKMARKS)
export const getSupabaseUserDashboard = async (userId: number) => {
  console.log(`📊 Fetching dashboard for user ID: ${userId}`);

  // 1. Fetch user reviews with business details
  const { data: reviews, error: reviewsError } = await supabase
    .from('directory_review')
    .select(`
      *,
      business:directory_business(id, name, name_kn, slug, area_slug, main_image_upload, area, rating, is_verified)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (reviewsError) console.error('🚨 Dashboard Reviews Error:', reviewsError);

  // Map business field names to match frontend DTOs
  const mappedReviews = (reviews || []).map(r => ({
    ...r,
    business: r.business ? {
      ...r.business,
      business_area_slug: r.business.area_slug // Map area_slug to business_area_slug
    } : null
  }));

  // 2. Fetch bookmarks (joining with business and category)
  const { data: bookmarks, error: bookmarksError } = await supabase
    .from('directory_bookmark')
    .select(`
      id,
      business:directory_business(*, category:directory_category(name, name_kn, slug))
    `)
    .eq('user_id', userId);

  if (bookmarksError) console.error('🚨 Dashboard Bookmarks Error:', bookmarksError);

  const mappedBookmarks = (bookmarks || [])
    .filter(b => b.business)
    .map(b => ({
      bookmark_id: b.id,
      business: {
        ...b.business,
        category_name: b.business.category?.name, // Flatten category name
        category_name_kn: b.business.category?.name_kn,
        business_area_slug: b.business.area_slug
      }
    }));

  // 3. Fetch user profile
  const { data: profile, error: profileError } = await supabase
    .from('auth_user')
    .select('first_name, last_name, profile_image, username')
    .eq('id', userId)
    .single();

  if (profileError) console.error('🚨 Dashboard Profile Error:', profileError);

  // 4. Fetch photo count
  const { count: photoCount, error: photoError } = await supabase
    .from('directory_businessgallery')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (photoError) console.error('🚨 Dashboard Photo Error:', photoError);

  const reviewCount = reviews?.length || 0;
  
  // 🏆 YELP-GRADE GAMIFICATION LOGIC
  const points = (reviewCount * 10) + ((photoCount || 0) * 20);
  const isElite = points >= 500;
  
  let badgeName = "Newbie";
  if (points >= 500) badgeName = "Local Legend";
  else if (points >= 200) badgeName = "Top Reviewer";
  else if (points >= 50) badgeName = "Active Member";

  return {
    my_reviews: mappedReviews,
    my_bookmarks: mappedBookmarks,
    is_elite: isElite,
    review_count: reviewCount,
    photo_count: photoCount || 0,
    gamification: {
      points,
      badge: badgeName
    },
    profile: profile || null
  };
};

// 🚀 13. SUBMIT A REVIEW DIRECTLY TO SUPABASE
export const submitSupabaseReview = async (
  businessId: number, 
  userId: number, 
  rating: number, 
  comment: string
) => {
  console.log(`✍️ Submitting review for business ${businessId} by user ${userId}`);
  
  const { data, error } = await supabase
    .from('directory_review')
    .insert([{
      business_id: businessId,
      user_id: userId,
      rating: rating,
      comment: comment,
      created_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error('🚨 Supabase Review Submission Error:', error);
    throw error;
  }

  return data;
};

// 🚀 14. TOGGLE BOOKMARK IN SUPABASE
export const toggleSupabaseBookmark = async (businessId: number, userId: number) => {
  console.log(`🔖 Toggling bookmark for business ${businessId} by user ${userId}`);
  
  const { data: existing, error: fetchError } = await supabase
    .from('directory_bookmark')
    .select('id')
    .eq('business_id', businessId)
    .eq('user_id', userId)
    .maybeSingle();

  if (fetchError) throw fetchError;

  if (existing) {
    const { error: deleteError } = await supabase
      .from('directory_bookmark')
      .delete()
      .eq('id', existing.id);
    if (deleteError) throw deleteError;
    return { status: 'removed' };
  } else {
    const { error: insertError } = await supabase
      .from('directory_bookmark')
      .insert([{ 
        business_id: businessId, 
        user_id: userId,
        created_at: new Date().toISOString() 
      }]);
    if (insertError) throw insertError;
    return { status: 'added' };
  }
};

// 🚀 15. SUBMIT ENQUIRY TO SUPABASE
export const submitSupabaseEnquiry = async (
  businessId: number, 
  data: { customer_name: string, phone_number: string }
) => {
  console.log(`📩 Submitting enquiry for business ${businessId}`);
  const { data: result, error } = await supabase
    .from('directory_enquiry')
    .insert([{
      business_id: businessId,
      customer_name: data.customer_name,
      phone_number: data.phone_number,
      created_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return result;
};

// 🚀 16. SUBMIT EDIT SUGGESTION TO SUPABASE
export const submitSupabaseSuggestion = async (
  businessId: number, 
  userId: number,
  suggestion: string
) => {
  console.log(`💡 Submitting suggestion for business ${businessId}`);
  const { data: result, error } = await supabase
    .from('directory_businesseditsuggestion')
    .insert([{
      business_id: businessId,
      user_id: userId,
      suggested_changes: suggestion, // ✅ Fixed: was 'suggestion', correct column is 'suggested_changes'
      relationship: 'customer',
      status: 'pending',
      created_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return result;
};

// 🚀 17. SUBMIT BUSINESS CLAIM TO SUPABASE
export const submitSupabaseClaim = async (
  businessId: number, 
  userId: number,
  data: { contact_info: string, details: string }
) => {
  console.log(`🛡️ Submitting claim for business ${businessId}`);
  const { data: result, error } = await supabase
    .from('directory_claimrequest') // ✅ Fixed: was 'directory_businessclaim'
    .insert([{
      business_id: businessId,
      user_id: userId,
      contact_info: data.contact_info,
      message: data.details,        // ✅ Fixed: column is 'message' not 'details'
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return result;
};

// 🚀 18. UPLOAD FILE TO SUPABASE STORAGE
export const uploadSupabaseFile = async (file: File, bucket: string = 'media') => {
  // Compress image before upload if it's an image
  let finalFile = file;
  if (file.type.startsWith('image/')) {
    try {
      const { compressImage } = await import("@/utils/imageCompression");
      // Top Level Clarity: 1600px max width, 85% quality WebP
      finalFile = await compressImage(file, 1600, 0.85); 
      console.log(`📉 Compressed: ${(file.size / 1024).toFixed(1)}KB -> ${(finalFile.size / 1024).toFixed(1)}KB`);
    } catch (err) {
      console.error("Compression failed, uploading original", err);
    }
  }

  const fileName = `${Date.now()}_${finalFile.name.replace(/\s+/g, '_')}`;
  const filePath = `uploads/${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, finalFile);

  if (error) throw error;
  
  return filePath;
};

// 🚀 19. SUBMIT NEW BUSINESS TO SUPABASE (goes to pending review table)
export const submitSupabaseNewBusiness = async (formData: any, filePaths: string[]) => {
  console.log(`🏢 Submitting new business: ${formData.business_name}`);
  
  // ✅ Fixed: Submit to review queue (directory_businesssubmissionrequest), NOT directly to live table
  const { data, error } = await supabase
    .from('directory_businesssubmissionrequest')
    .insert([{
      business_name: formData.business_name,
      category: formData.category,
      subcategory: formData.subcategory || null,
      area: formData.area,
      full_address: formData.full_address,
      landmark: formData.landmark || null,
      pincode: formData.pincode || null,
      map_link: formData.map_link || null,
      phone: formData.phone,
      whatsapp: formData.whatsapp || null,
      email: formData.email || null,
      website: formData.website || null,
      instagram: formData.instagram || null,
      facebook: formData.facebook || null,
      working_hours: formData.working_hours || null,
      established_year: formData.established_year || null,
      description: formData.description || null,
      amenities: formData.amenities || null,
      services_offered: formData.services_offered || null,
      image_1: filePaths[0] || null,
      image_2: filePaths[1] || null,
      image_3: filePaths[2] || null,
      image_4: filePaths[3] || null,
      image_5: filePaths[4] || null,
      submitter_name: formData.submitter_name,
      submitter_phone: formData.submitter_phone,
      submitter_email: formData.submitter_email || null,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// 🚀 20. UPDATE A REVIEW
export const updateSupabaseReview = async (reviewId: number, rating: number, comment: string) => {
  console.log(`📝 Updating review ${reviewId}`);
  const { data, error } = await supabase
    .from('directory_review')
    .update({ 
      rating, 
      comment,
      created_at: new Date().toISOString() 
    })
    .eq('id', reviewId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// 🚀 21. DELETE A REVIEW
export const deleteSupabaseReview = async (reviewId: number) => {
  console.log(`🗑️ Deleting review ${reviewId}`);
  const { error } = await supabase
    .from('directory_review')
    .delete()
    .eq('id', reviewId);

  if (error) throw error;
  return true;
};

// 🚀 22. UPDATE USER PROFILE (Name & Photo)
export const updateSupabaseUserProfile = async (userId: number, updates: { first_name?: string, last_name?: string, profile_image?: string }) => {
  console.log(`👤 Updating profile for user ${userId}`);
  const { data, error } = await supabase
    .from('auth_user')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

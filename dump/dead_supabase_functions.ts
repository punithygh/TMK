export const getSupabaseBusinessBySlug = async (slug: string): Promise<BusinessListing | null> => {
  try {
    const res = await api.get(`/businesses/${slug}/`);
    const biz = res.data;
    if (biz) {
      biz.main_image_upload = getFullUrl(biz.main_image_upload);
      if (biz.gallery_images) {
        biz.gallery_images = biz.gallery_images.map((img: any) => getFullUrl(img.image || img));
      }
    }
    return biz;
  } catch (error) {
    return null;
  }
};

export const getSupabaseCategories = async () => {
  try {
    const res = await api.get('/categories/');
    return res.data?.results || res.data || [];
  } catch (error) {
    return [];
  }
};

export const getSupabaseBanners = async () => {
  try {
    const res = await api.get('/banners/');
    const data = Array.isArray(res.data) ? res.data : res.data?.results || [];
    return data.map((b: any) => ({ ...b, image_url: getFullUrl(b.image_url) }));
  } catch (error) {
    return [];
  }
};

export const getSupabaseArticles = async (type?: string) => {
  try {
    const res = await api.get('/articles/', { params: { type } });
    const results = res.data?.results || res.data || [];
    return results.map((a: any) => ({ ...a, image_url: getFullUrl(a.image_upload || a.image_url) }));
  } catch (error) {
    return [];
  }
};

// 🚀 ಫಿಕ್ಸ್: ಈ ಫಂಕ್ಷನ್ ಮಿಸ್ ಆಗಿದ್ದಕ್ಕೆ "Not a function" ಎರ್‍ರರ್ ಬರುತ್ತಿತ್ತು
export const getSupabaseSocialPosts = async () => {
  try {
    const res = await api.get('/social-posts/');
    const results = res.data?.results || res.data || [];
    return results.map((post: any) => ({
      ...post,
      image_url: getFullUrl(post.image_upload || post.image_url || post.thumbnail_url)
    }));
  } catch (error) {
    return [];
  }
};

export const getSupabaseRecentReviews = async () => {
  try {
    const res = await api.get('/recent-reviews/');
    return res.data?.results || res.data || [];
  } catch (error) {
    return [];
  }
};

import { MetadataRoute } from 'next';
import { getAllCourses, getCategories, getArticles } from '@/services/courses';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.tumakuruconnect.com';
  
  // Standard core pages
  const routes = ['', '/about', '/contact', '/privacy', '/terms', '/listings'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  try {
    // Dynamic fetches
    const businesses = await getAllCourses();
    const categories = await getCategories();
    const articles = await getArticles();

    const businessUrls = businesses.map((b) => ({
      url: `${baseUrl}/business/${b.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));

    const categoryUrls = categories.map((c) => ({
      url: `${baseUrl}/${c.name.toLowerCase().replace(/\s+/g, '-')}-in-tumkur`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    const articleUrls = articles.map((a) => ({
      url: `${baseUrl}/article/${a.slug}`,
      lastModified: new Date(a.created_at || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [...routes, ...categoryUrls, ...businessUrls, ...articleUrls];
  } catch (err) {
    console.error("Sitemap dynamic fetch failed:", err);
    return routes;
  }
}

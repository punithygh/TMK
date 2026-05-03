import { Metadata, ResolvingMetadata } from "next";
import ListingsClient from "@/components/features/listing/ListingsClient";
import { getBusinesses } from "@/services/businessService";
import Script from "next/script";
import { notFound, redirect } from "next/navigation";

export const revalidate = 3600; // 🚨 ISR: Revalidate every 1 hour (Top-Level Free Tier Speed Optimization)

type Props = {
  params: Promise<{ seoSlug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// 🚨 SERVER-SIDE SEO GENERATION FOR CATEGORIES & SEARCH
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const seoSlug = resolvedParams.seoSlug;
  const resolvedSearchParams = await searchParams;

  let category = resolvedSearchParams.category as string || "";
  let area = resolvedSearchParams.area as string || "";
  const q = resolvedSearchParams.q as string || "";

  if (seoSlug !== 'listings') {
    const match = seoSlug.match(/^(.*?)-in-(?:(.*?)-)?tumkur$/);
    if (match) {
      category = match[1];
      if (match[2]) area = match[2];
    }
  }

  let titleText = "Tumkur Business Directory | Best Local Services & Contacts";
  let descriptionText = "Find top-rated businesses, services, doctors, and hotels in Tumkur (ತುಮಕೂರು). Get verified phone numbers, reviews, and addresses instantly.";
  let keywords = ["Tumkur businesses", "Tumkur local directory", "Tumkur services", "ತುಮಕೂರು ಬ್ಯುಸಿನೆಸ್", "Top places in Tumkur"];

  let canonicalUrl = 'https://tumakuruconnect.com';

  if (category) {
    const displayCat = category.replace(/-/g, ' ');
    const displayArea = area ? area.replace(/-/g, ' ') : '';
    
    const catFormatted = displayCat.charAt(0).toUpperCase() + displayCat.slice(1);
    const areaFormatted = displayArea ? ` in ${displayArea.charAt(0).toUpperCase() + displayArea.slice(1)}` : '';
    titleText = `Best ${catFormatted}${areaFormatted}, Tumkur | ಟಾಪ್ ${catFormatted} ತುಮಕೂರಿನಲ್ಲಿ`;
    descriptionText = `Looking for the best ${catFormatted}${areaFormatted} in Tumkur? Browse top-rated options, verified phone numbers, user reviews, and precise locations in ತುಮಕೂರು.`;
    keywords = [`${catFormatted} in Tumkur`, `Best ${catFormatted} Tumkur`, `Tumkur ${catFormatted} contact`, `ತುಮಕೂರು ${catFormatted}`, `Top ${catFormatted} nearby`];
    
    // Hard Canonical to the clean SEO URL
    canonicalUrl += `/${category.toLowerCase().replace(/\s+/g, '-')}-in-${area ? area.toLowerCase().replace(/\s+/g, '-') + '-' : ''}tumkur`;
  } else if (q) {
    titleText = `Results for "${q}" in Tumkur | Tumakuru Connect`;
    descriptionText = `Explore local businesses matching "${q}" in Tumkur. View detailed addresses, contact info, and ratings.`;
    keywords = [`${q} Tumkur`, `Find ${q} in Tumkur`, `Tumkur directory ${q}`, `${q} ತುಮಕೂರು`];
    canonicalUrl += `/listings?q=${encodeURIComponent(q)}`;
  } else {
    canonicalUrl += '/listings';
  }

  return {
    title: titleText,
    description: descriptionText,
    keywords: keywords.join(', '),
    openGraph: {
      title: titleText,
      description: descriptionText,
      url: canonicalUrl, 
      siteName: 'Tumakuru Connect',
      type: "website",
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title: titleText,
      description: descriptionText,
    },
    alternates: {
      canonical: canonicalUrl,
    }
  };
}

// 🚨 NEXT.JS 15 SERVER COMPONENT
export default async function ListingsPageServer({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const seoSlug = resolvedParams.seoSlug;
  const resolvedSearchParams = await searchParams;
  
  let initialCategory = resolvedSearchParams.category as string || "";
  let initialArea = resolvedSearchParams.area as string || "";
  const initialQ = resolvedSearchParams.q as string || "";
  
  // 1. If it's the old legacy URL format with a category, HARD 301 REDIRECT to new SEO URL!
  if (seoSlug === 'listings' && initialCategory) {
    const formattedCat = initialCategory.toLowerCase().replace(/\s+/g, '-');
    const formattedArea = initialArea.toLowerCase().replace(/\s+/g, '-');
    let seoUrl = `/${formattedCat}-in-${formattedArea ? formattedArea + '-' : ''}tumkur`;
    
    // Retain other important search params during redirect
    const paramsObj = new URLSearchParams();
    if (initialQ) paramsObj.set('q', initialQ);
    if (resolvedSearchParams.sort_by) paramsObj.set('sort_by', resolvedSearchParams.sort_by as string);
    
    const query = paramsObj.toString();
    redirect(`${seoUrl}${query ? `?${query}` : ''}`);
  }

  // 2. Parse the Programmatic SEO Slug
  if (seoSlug !== 'listings') {
    const match = seoSlug.match(/^(.*?)-in-(?:(.*?)-)?tumkur$/);
    if (match) {
      initialCategory = match[1];
      if (match[2]) initialArea = match[2];
    } else {
      // If it doesn't match the SEO pattern and isn't 'listings', it's a 404
      notFound();
    }
  }

  const initialSortBy = resolvedSearchParams.sort_by as string || "";
  const initialStarRating = resolvedSearchParams.star_rating as string || "";
  const initialBudget = resolvedSearchParams.budget as string || "";

  const displayInitialCat = initialCategory ? initialCategory.replace(/-/g, ' ') : '';
  const catFormatted = displayInitialCat ? displayInitialCat.charAt(0).toUpperCase() + displayInitialCat.slice(1) : 'Businesses';

  let canonicalUrl = 'https://tumakuruconnect.com';
  if (initialCategory) {
    const catUrlPart = initialCategory.toLowerCase().replace(/\s+/g, '-');
    const areaUrlPart = initialArea ? initialArea.toLowerCase().replace(/\s+/g, '-') + '-' : '';
    canonicalUrl += `/${catUrlPart}-in-${areaUrlPart}tumkur`;
  } else if (initialQ) {
    canonicalUrl += `/listings?q=${encodeURIComponent(initialQ)}`;
  } else {
    canonicalUrl += '/listings';
  }

  // Fetch initial data for SEO Schema
  const initialData = await getBusinesses({
    search: initialQ,
    category: initialCategory,
    area: initialArea,
    limit: 10
  });

  // CollectionPage Schema for rich snippets in Google
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Best ${catFormatted} in Tumkur | Tumakuru Connect`,
    "description": `Find top ${catFormatted} in Tumkur. Verified contacts, addresses, and user ratings.`,
    "url": canonicalUrl,
    "mainEntity": {
      "@type": "ItemList",
      "name": `${catFormatted} Directory`,
      "itemListElement": initialData.map((biz, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "LocalBusiness",
          "name": biz.name,
          "url": `https://tumakuruconnect.com/business/${biz.slug || biz.id}`,
          "image": biz.main_image_upload || biz.image_url || "",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": biz.area || "Tumkur",
            "addressRegion": "Karnataka",
            "addressCountry": "IN"
          },
          ...(biz.rating ? {
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": biz.rating,
              "reviewCount": biz.review_count || 1
            }
          } : {})
        }
      }))
    }
  };

  // Pass the initial server-read parameters to the Client UI Component
  return (
    <>
      <Script
        id="listing-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <ListingsClient 
        initialQ={initialQ}
        initialCategory={initialCategory}
        displayCategory={displayInitialCat}
        initialSortBy={initialSortBy}
        initialStarRating={initialStarRating}
        initialBudget={initialBudget}
        initialArea={initialArea}
        seoMode={seoSlug !== 'listings'}
      />
    </>
  );
}

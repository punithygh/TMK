import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import BusinessDetailClient from "@/components/features/business/BusinessDetailClient";
import { getBusinesses, getReviewsForBusiness } from "@/services/businessService";
import { BusinessListing, getOneCourse, getAllCourses } from "@/services/courses";
import { getSupabaseImageUrl } from "@/utils/imageUtils";

export const revalidate = 60; // 🚨 ISR: Revalidate every 60 seconds (Top-Level Free Tier Speed Optimization)

type Props = {
  params: Promise<{ slug: string }>;
};

// 🚨 1. SERVER-SIDE SEO GENERATION (Dynamically reads from Supabase)
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const business = await getOneCourse(slug);

  if (!business) {
    return {
      title: "Business Not Found - Tumkurconnect",
      description: "The requested business profile could not be found.",
    };
  }

  // Generate an SEO Title
  const titleText = `${business.name} | ${business.category_name} in ${business.area} | Tumkurconnect`;
  const descriptionText = business.description || `Find the best ${business.category_name} at ${business.name} located in ${business.area}, Tumakuru. Get contact details, reviews, and directions.`;

  // 🚨 Dynamic SEO Keywords for Local Search (Bilingual)
  const seoKeywords = [
    `${business.category_name} in Tumkur`,
    `${business.category_name} in ${business.area}`,
    `best ${business.category_name} near ${business.area}`,
    `ತುಮಕೂರಿನಲ್ಲಿ ${business.category_name_kn || business.category_name}`,
    `${business.name} Tumkur`,
    `Tumkurconnect`
  ];

  const canonicalUrl = `https://tumakuruconnect.com/business/${slug}`;

  return {
    title: titleText,
    description: descriptionText,
    keywords: seoKeywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en-IN': `${canonicalUrl}?lang=en`,
        'kn-IN': `${canonicalUrl}?lang=kn`,
      },
    },
    openGraph: {
      title: titleText,
      description: descriptionText,
      images: getSupabaseImageUrl((business as any).main_image_upload || business.image_url) ? [
        getSupabaseImageUrl((business as any).main_image_upload || business.image_url) as string
      ] : [],
      type: "website",
      url: canonicalUrl,
    },
  };
}

// 🚨 2. NEXT.JS 15 SERVER COMPONENT
export default async function BusinessDetailPageServer({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // 🚀 Fetch data securely on the SERVER from SUPABASE
  const business = await getOneCourse(slug);

  // If 404, trigger Next.js built-in notFound page
  if (!business) {
    notFound();
  }

  // 🚀 3. Fetch similar businesses (same category, different ID) from SUPABASE
  let similarBusinesses: BusinessListing[] = [];
  try {
    const allBiz = await getAllCourses();
    similarBusinesses = allBiz
      .filter(b => b.category_name === business.category_name && b.id !== business.id)
      .slice(0, 6);
  } catch (error) { 
    console.error("Failed to fetch similar businesses from Supabase:", error); 
  }

  // 🚀 Fetch Top Reviews for Schema
  let schemaReviews: any[] = [];
  try {
    const rawReviews = await getReviewsForBusiness(slug);
    schemaReviews = rawReviews.filter((r: any) => r.rating >= 4).slice(0, 3);
  } catch (error) {
    console.error("Failed to fetch reviews for schema:", error);
  }

  const canonicalUrl = `https://tumakuruconnect.com/business/${slug}`;

  // 🚀 4. YELP-GRADE JSON-LD Structured Data for Google SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": business.name,
    "alternateName": business.name_kn || undefined,
    "description": business.description || `${business.category_name} in ${business.area}, Tumakuru`,
    "url": canonicalUrl,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": business.address || "",
      "addressLocality": business.area || "Tumakuru",
      "addressRegion": "Karnataka",
      "addressCountry": "IN",
      "postalCode": business.pincode || ""
    },
    ...(business.lat && business.lng && {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": business.lat,
        "longitude": business.lng
      }
    }),
    ...(business.phone && { "telephone": business.phone }),
    ...(business.category_name && { "additionalType": business.category_name }),
    ...(((business as any).main_image_upload || business.image_url) && {
      "image": getSupabaseImageUrl((business as any).main_image_upload || business.image_url)
    }),
    ...(business.rating && Number(business.rating) > 0 && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": Number(business.rating).toFixed(1),
        "bestRating": "5",
        "ratingCount": business.review_count || 1
      }
    }),
    ...(schemaReviews.length > 0 && {
      "review": schemaReviews.map((r: any) => ({
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": r.rating,
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": r.user_name || "Tumkurconnect User"
        },
        "reviewBody": r.comment || ""
      }))
    })
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BusinessDetailClient business={business} similarBusinesses={similarBusinesses} />
    </>
  );
}

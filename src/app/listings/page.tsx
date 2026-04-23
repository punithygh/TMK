import { Metadata, ResolvingMetadata } from "next";
import ListingsClient from "@/components/listings-client";
import Script from "next/script";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// 🚨 SERVER-SIDE SEO GENERATION FOR CATEGORIES & SEARCH
export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q as string || "";
  const category = resolvedParams.category as string || "";

  let titleText = "Tumkur Business Directory | Best Local Services & Contacts";
  let descriptionText = "Find top-rated businesses, services, doctors, and hotels in Tumkur (ತುಮಕೂರು). Get verified phone numbers, reviews, and addresses instantly.";
  let keywords = ["Tumkur businesses", "Tumkur local directory", "Tumkur services", "ತುಮಕೂರು ಬ್ಯುಸಿನೆಸ್", "Top places in Tumkur"];

  if (category) {
    const catFormatted = category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
    titleText = `Best ${catFormatted} in Tumkur | ಟಾಪ್ ${catFormatted} ತುಮಕೂರಿನಲ್ಲಿ`;
    descriptionText = `Looking for the best ${catFormatted} in Tumkur? Browse top-rated options, verified phone numbers, user reviews, and precise locations in ತುಮಕೂರು.`;
    keywords = [`${catFormatted} in Tumkur`, `Best ${catFormatted} Tumkur`, `Tumkur ${catFormatted} contact`, `ತುಮಕೂರು ${catFormatted}`, `Top ${catFormatted} nearby`];
  } else if (q) {
    titleText = `Results for "${q}" in Tumkur | Tumakuru Connect`;
    descriptionText = `Explore local businesses matching "${q}" in Tumkur. View detailed addresses, contact info, and ratings.`;
    keywords = [`${q} Tumkur`, `Find ${q} in Tumkur`, `Tumkur directory ${q}`, `${q} ತುಮಕೂರು`];
  }

  return {
    title: titleText,
    description: descriptionText,
    keywords: keywords.join(', '),
    openGraph: {
      title: titleText,
      description: descriptionText,
      url: 'https://tumakuruconnect.com/listings', 
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
      canonical: 'https://tumakuruconnect.com/listings',
    }
  };
}

// 🚨 NEXT.JS 15 SERVER COMPONENT
export default async function ListingsPageServer({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  
  // Extract URL parameters securely on the server
  const initialQ = resolvedParams.q as string || "";
  const initialCategory = resolvedParams.category as string || "";
  const initialSortBy = resolvedParams.sort_by as string || "";
  const initialStarRating = resolvedParams.star_rating as string || "";
  const initialBudget = resolvedParams.budget as string || "";
  const initialArea = resolvedParams.area as string || "";

  const catFormatted = initialCategory ? initialCategory.charAt(0).toUpperCase() + initialCategory.slice(1).replace(/-/g, ' ') : 'Businesses';

  // CollectionPage Schema for rich snippets in Google
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Best ${catFormatted} in Tumkur | Tumakuru Connect`,
    "description": `Find top ${catFormatted} in Tumkur. Verified contacts, addresses, and user ratings.`,
    "url": "https://tumakuruconnect.com/listings",
    "mainEntity": {
      "@type": "ItemList",
      "name": `${catFormatted} Directory`
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
        initialSortBy={initialSortBy}
        initialStarRating={initialStarRating}
        initialBudget={initialBudget}
        initialArea={initialArea}
      />
    </>
  );
}
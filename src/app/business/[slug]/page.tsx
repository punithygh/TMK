import { Metadata, ResolvingMetadata } from "next";
import { getOneCourse, getAllCourses } from "@/services/courses";
import { notFound } from "next/navigation";
import BusinessDetailClient from "@/components/business-detail-client";

type Props = {
  params: Promise<{ slug: string }>;
};

// 🚨 1. SERVER-SIDE SEO GENERATION (Dynamically reads from Django Backend)
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const business = await getOneCourse(slug);

  if (!business) {
    return {
      title: "Business Not Found - Tumakuru Connect",
      description: "The requested business profile could not be found.",
    };
  }

  // Generate an SEO Title
  const titleText = `${business.name} | ${business.category_name} in ${business.area} | Tumakuru Connect`;
  const descriptionText = business.description || `Find the best ${business.category_name} at ${business.name} located in ${business.area}, Tumakuru. Get contact details, reviews, and directions.`;

  return {
    title: titleText,
    description: descriptionText,
    openGraph: {
      title: titleText,
      description: descriptionText,
      images: business.main_image_upload || business.image_url ? [
        business.main_image_upload || business.image_url as string
      ] : [],
      type: "website",
    },
  };
}

// 🚨 2. NEXT.JS 15 SERVER COMPONENT
export default async function BusinessDetailPageServer({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // 🚀 Fetch data securely on the SERVER
  const business = await getOneCourse(slug);

  // If 404, trigger Next.js built-in notFound page
  if (!business) {
    notFound();
  }

  // 🚀 3. Fetch similar businesses (same category, different ID)
  let similarBusinesses: Awaited<ReturnType<typeof getAllCourses>> = [];
  try {
    const allBiz = await getAllCourses();
    similarBusinesses = allBiz
      .filter(b => b.category_name === business.category_name && b.id !== business.id)
      .slice(0, 6);
  } catch { /* fail silently */ }

  // 🚀 4. JSON-LD Structured Data for Google SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": business.name,
    "description": business.description || `${business.category_name} in ${business.area}, Tumakuru`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": business.address || "",
      "addressLocality": business.area || "Tumakuru",
      "addressRegion": "Karnataka",
      "addressCountry": "IN",
      "postalCode": business.pincode || ""
    },
    ...(business.phone && { "telephone": business.phone }),
    ...(business.category_name && { "additionalType": business.category_name }),
    ...((business.main_image_upload || business.image_url) && {
      "image": business.main_image_upload || business.image_url
    }),
    ...(business.rating && Number(business.rating) > 0 && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": Number(business.rating).toFixed(1),
        "bestRating": "5",
        "ratingCount": business.review_count || 1
      }
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
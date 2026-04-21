import { Metadata, ResolvingMetadata } from "next";
import { getOneCourse } from "@/services/courses";
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

  // Pass data to the Client UI Component
  return <BusinessDetailClient business={business} />;
}
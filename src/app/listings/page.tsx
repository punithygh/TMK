import { Metadata, ResolvingMetadata } from "next";
import ListingsClient from "@/components/listings-client";

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

  let titleText = "Explore Top Local Businesses | Tumakuru Connect";
  let descriptionText = "Find the best local businesses, services, hospitals, and hotels in Tumkur with reviews and contact details.";

  if (category) {
    titleText = `Best ${category} in Tumkur - Top Ratings & Contact Details`;
    descriptionText = `Explore the top-rated ${category} in Tumkur. View phone numbers, addresses, ratings, and pure veg/24x7 availability.`;
  } else if (q) {
    titleText = `Search Results for "${q}" in Tumkur | Tumakuru Connect`;
    descriptionText = `Find top businesses matching "${q}" in Tumkur. Browse listings, ratings, and get immediate contact details.`;
  }

  return {
    title: titleText,
    description: descriptionText,
    openGraph: {
      title: titleText,
      description: descriptionText,
      type: "website",
    },
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

  // Pass the initial server-read parameters to the Client UI Component
  return (
    <ListingsClient 
      initialQ={initialQ}
      initialCategory={initialCategory}
      initialSortBy={initialSortBy}
      initialStarRating={initialStarRating}
      initialBudget={initialBudget}
      initialArea={initialArea}
    />
  );
}
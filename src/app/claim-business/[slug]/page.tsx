import { Metadata, ResolvingMetadata } from "next";
import { getOneCourse } from "@/services/courses";
import { notFound } from "next/navigation";
import ClaimBusinessClient from "@/components/features/business/ClaimBusinessClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const business = await getOneCourse(slug);

  if (!business) {
    return {
      title: "Business Not Found | Tumakuru Connect",
      description: "The requested business could not be found.",
    };
  }

  const titleText = `Claim Business - ${business.name} | Tumakuru Connect`;
  const descriptionText = `Verify your ownership of ${business.name} and get exclusive benefits on Tumakuru Connect.`;

  return {
    title: titleText,
    description: descriptionText,
  };
}

export default async function ClaimBusinessPageServer({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const business = await getOneCourse(slug);

  if (!business) {
    notFound();
  }

  return <ClaimBusinessClient business={business} />;
}

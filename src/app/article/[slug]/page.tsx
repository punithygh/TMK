import { Metadata, ResolvingMetadata } from "next";
import { getOneArticle, getArticles } from "@/services/courses";
import { notFound } from "next/navigation";
import ArticleDetailClient from "@/components/article-detail-client";

type Props = {
  params: Promise<{ slug: string }>;
};

// 🚨 1. SERVER-SIDE SEO GENERATION
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const article = await getOneArticle(slug);

  if (!article) {
    return {
      title: "Article Not Found - Tumakuru Connect",
      description: "The requested article could not be found.",
    };
  }

  const titleText = `${article.title} | Tumakuru Connect`;
  const descriptionText = `Read ${article.title} on Tumakuru Connect. Discover the latest news, movie reviews, and updates in Tumkur.`;

  return {
    title: titleText,
    description: descriptionText,
    openGraph: {
      title: titleText,
      description: descriptionText,
      images: article.image_upload || article.image_url ? [
        article.image_upload || article.image_url as string
      ] : [],
      type: "article",
    },
  };
}

// 🚨 2. NEXT.JS 15 SERVER COMPONENT
export default async function ArticleDetailPageServer({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const article = await getOneArticle(slug);

  if (!article) {
    notFound();
  }

  // Fetch some related articles (same type) for the "Read More" section
  const allArticles = await getArticles(article.type);
  const relatedArticles = allArticles.filter(a => a.id !== article.id).slice(0, 3);

  return <ArticleDetailClient article={article} relatedArticles={relatedArticles} />;
}

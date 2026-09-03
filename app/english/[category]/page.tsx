import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DetailPageLayout from "@/components/detail/DetailPageLayout";
import { DETAIL_CATEGORIES, getDetailPage } from "@/data/detailPages";
import { getLanguageBySlug } from "@/data/languages";

interface DetailParams {
  category: string;
}

const ACCENT = {
  solid: "bg-english text-white",
  text: "text-english",
  tint: "bg-english-tint text-english-dark",
};

export function generateStaticParams() {
  return DETAIL_CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<DetailParams> }): Promise<Metadata> {
  const { category } = await params;
  const content = getDetailPage("english", category);
  if (!content) return {};

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: { canonical: content.path },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: content.metaTitle,
      description: content.metaDescription,
    },
  };
}

export default async function EnglishDetailPage({ params }: { params: Promise<DetailParams> }) {
  const { category } = await params;
  const content = getDetailPage("english", category);
  if (!content) notFound();

  const language = getLanguageBySlug("english");

  return (
    <DetailPageLayout content={content} accent={ACCENT} languageNameKo={language.nameKo} languageHref={language.href} />
  );
}

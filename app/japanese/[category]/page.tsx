import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DetailPageLayout from "@/components/detail/DetailPageLayout";
import { DETAIL_CATEGORIES, getDetailPage } from "@/data/detailPages";
import { getLanguageBySlug } from "@/data/languages";

interface DetailParams {
  category: string;
}

const ACCENT = {
  solid: "bg-japanese text-white",
  text: "text-japanese",
  tint: "bg-japanese-tint text-japanese-dark",
};

export function generateStaticParams() {
  return DETAIL_CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<DetailParams> }): Promise<Metadata> {
  const { category } = await params;
  const content = getDetailPage("japanese", category);
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

export default async function JapaneseDetailPage({ params }: { params: Promise<DetailParams> }) {
  const { category } = await params;
  const content = getDetailPage("japanese", category);
  if (!content) notFound();

  const language = getLanguageBySlug("japanese");

  return (
    <DetailPageLayout content={content} accent={ACCENT} languageNameKo={language.nameKo} languageHref={language.href} />
  );
}

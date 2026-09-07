import { Fragment } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbListSchema, buildFaqPageSchema, buildArticleSchema } from "@/lib/seo/schema";
import DirectAnswer from "@/components/detail/DirectAnswer";
import DetailSection from "@/components/detail/DetailSection";
import DetailFAQ from "@/components/detail/DetailFAQ";
import RelatedLinks from "@/components/detail/RelatedLinks";
import DetailCTABand from "@/components/detail/DetailCTABand";
import {
  getMagazineArticle,
  getAllMagazineSlugs,
  getRelatedMagazineArticles,
  type MagazineLanguage,
} from "@/data/magazine";

// 실제 production 도메인. 다른 canonical 처리(app/local/.../page.tsx,
// lib/seo/schema.ts의 SITE_URL)와 동일한 값을 고정 상수로 관리한다.
const SITE_URL = "https://dorancoaching.com";

interface MagazineDetailParams {
  slug: string;
}

// 1차 배치 10개 전부 build 시 정적 생성한다(local SEO처럼 대규모가 아니라
// ISR/on-demand 전환이 필요 없는 규모).
export function generateStaticParams(): MagazineDetailParams[] {
  return getAllMagazineSlugs().map((slug) => ({ slug }));
}

// 화이트리스트(getAllMagazineSlugs) 밖 slug는 요청 시점에도 만들지 않고
// 즉시 404 처리한다.
export const dynamicParams = false;

const ACCENT_BY_LANGUAGE: Record<MagazineLanguage, { solid: string; text: string; tint: string }> = {
  english: { solid: "bg-english", text: "text-english", tint: "bg-english-tint text-english-dark" },
  japanese: { solid: "bg-japanese", text: "text-japanese", tint: "bg-japanese-tint text-japanese-dark" },
  chinese: { solid: "bg-chinese", text: "text-chinese", tint: "bg-chinese-tint text-chinese-dark" },
  common: { solid: "bg-brand", text: "text-brand", tint: "bg-brand-tint text-brand-dark" },
};

function consultationHref(language: MagazineLanguage): string {
  return language === "common" ? "/#consultation" : `/${language}#consultation`;
}

function loadArticle(slug: string) {
  const article = getMagazineArticle(slug);
  if (!article) notFound();
  return article;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<MagazineDetailParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = loadArticle(slug);

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    alternates: { canonical: `${SITE_URL}/magazine/${article.slug}` },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      type: "article",
    },
  };
}

export default async function MagazineArticlePage({
  params,
}: {
  params: Promise<MagazineDetailParams>;
}) {
  const { slug } = await params;
  const article = loadArticle(slug);
  const accent = ACCENT_BY_LANGUAGE[article.language];
  const relatedArticles = getRelatedMagazineArticles(article);

  const breadcrumbItems = [
    { label: "홈", href: "/" },
    { label: "매거진", href: "/magazine" },
    { label: article.h1 },
  ];

  return (
    <article className="bg-surface">
      <JsonLd data={buildBreadcrumbListSchema(breadcrumbItems)} />
      {article.faq.length > 0 && <JsonLd data={buildFaqPageSchema(article.faq)} />}
      <JsonLd
        data={buildArticleSchema({
          headline: article.h1,
          description: article.metaDescription,
          url: `/magazine/${article.slug}`,
          datePublished: article.publishedAt,
        })}
      />

      <div className="border-b border-ink/8 bg-surface-soft">
        <Breadcrumb items={breadcrumbItems} />
        <div className="section-shell max-w-2xl py-8 sm:py-10">
          <span className={`inline-flex rounded-full px-3 py-1 text-[12px] font-bold ${accent.tint}`}>
            {article.eyebrow}
          </span>
          <h1 className="text-balance mt-4 text-[28px] font-extrabold leading-[1.25] tracking-tight text-ink sm:text-[36px]">
            {article.h1}
          </h1>
          <p className="text-pretty mt-3 text-[15px] leading-relaxed text-ink-soft">{article.cardSummary}</p>
        </div>
      </div>

      <div className="bg-surface py-10 sm:py-12">
        <div className="section-shell max-w-2xl space-y-6">
          <Reveal>
            <DirectAnswer
              question={article.directAnswer.question}
              answer={article.directAnswer.answer}
              accentTintClass={accent.tint}
              accentBarClass={accent.solid}
            />
          </Reveal>

          {article.intro && article.intro.length > 0 && (
            <div className="space-y-3">
              {article.intro.map((paragraph) => (
                <p key={paragraph} className="text-pretty text-[15px] leading-relaxed text-ink-soft">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {article.sections.map((section, index) => (
        <Fragment key={section.heading}>
          <DetailSection {...section} index={index} accentTextClass={accent.text} />
        </Fragment>
      ))}

      <div className="bg-surface-soft py-14 sm:py-16">
        <div className="section-shell space-y-10">
          <Reveal>
            <RelatedLinks title="관련 DORAN 과정" links={article.relatedCourses} accentTextClass={accent.text} />
          </Reveal>

          {relatedArticles.length > 0 && (
            <Reveal delay={80}>
              <RelatedLinks
                title="관련 글"
                accentTextClass={accent.text}
                links={relatedArticles.map((related) => ({
                  label: related.h1,
                  href: `/magazine/${related.slug}`,
                  description: related.cardSummary,
                }))}
              />
            </Reveal>
          )}

          <Reveal delay={140}>
            <DetailFAQ items={article.faq} />
          </Reveal>
        </div>
      </div>

      <DetailCTABand
        lines={["궁금한 점이 더 있다면", "상담에서 확인해보세요"]}
        subtitle="현재 수준과 목표에 맞춰 학습 방향을 함께 정할 수 있습니다."
        href={consultationHref(article.language)}
      />
    </article>
  );
}

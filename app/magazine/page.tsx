import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, Globe2 } from "lucide-react";
import Reveal from "@/components/Reveal";
import StageCTABand from "@/components/StageCTABand";
import LanguageSelectSection from "@/components/LanguageSelectSection";
import ConsultationSection from "@/components/ConsultationSection";
import { type LanguageSlug } from "@/data/languages";
import {
  magazineArticles,
  getMagazineArticlesByLanguage,
  getMagazineArticle,
  type MagazineArticle,
  type MagazineLanguage,
} from "@/data/magazine";

export const metadata: Metadata = {
  title: "매거진 | 도란 DORAN",
  description:
    "회화·자격증·시험 준비를 하며 실제로 궁금한 질문에 답하는 도란 매거진. 영어·일본어·중국어 학습법과 시험 정보를 모았습니다.",
  alternates: { canonical: "/magazine" },
};

const LANGUAGE_ACCENT: Record<LanguageSlug, string> = {
  english: "bg-english-tint text-english",
  japanese: "bg-japanese-tint text-japanese",
  chinese: "bg-chinese-tint text-chinese",
};

const MAGAZINE_ACCENT: Record<MagazineLanguage, string> = {
  ...LANGUAGE_ACCENT,
  common: "bg-brand-tint text-brand",
};

const MAGAZINE_SECTION_TITLE: Record<LanguageSlug, string> = {
  english: "영어",
  japanese: "일본어",
  chinese: "중국어",
};

// 카테고리 탐색은 실제 데이터 구조(언어별 파일)를 그대로 따른다 — 별도 필터
// state 없이 anchor 이동만으로 처리(정적 렌더링 유지, Client Component 불필요).
const LANGUAGE_SECTIONS: LanguageSlug[] = ["english", "japanese", "chinese"];

// Editor's Pick: 25개 중 "처음 읽기 좋은" 대표 4개. 언어 오리엔테이션 글(common)
// 1개 + 언어별 회화 입문 성격의 글 1개씩. 존재하지 않는 slug는 조용히 걸러진다.
const FEATURED_SLUG = "who-fits-online-language-tutoring";
const FEATURED_LANGUAGE_SLUGS: Record<LanguageSlug, string> = {
  english: "why-english-speaking-not-improving",
  japanese: "japanese-speaking-study-order",
  chinese: "chinese-speaking-study-order",
};

function groupByCategory(articles: MagazineArticle[]): [string, MagazineArticle[]][] {
  const map = new Map<string, MagazineArticle[]>();
  for (const article of articles) {
    const list = map.get(article.categoryLabel) ?? [];
    list.push(article);
    map.set(article.categoryLabel, list);
  }
  return [...map.entries()];
}

function latestUpdateLabel(articles: MagazineArticle[]): string {
  const latest = articles.reduce((max, article) => (article.publishedAt > max ? article.publishedAt : max), "");
  const [year, month] = latest.split("-");
  return `${year}년 ${Number(month)}월`;
}

export default function MagazinePage() {
  const featuredBig = getMagazineArticle(FEATURED_SLUG);
  const featuredSmall = LANGUAGE_SECTIONS.map((lang) => getMagazineArticle(FEATURED_LANGUAGE_SLUGS[lang])).filter(
    (article): article is MagazineArticle => article !== null
  );

  return (
    <>
      <section className="section-pad bg-surface">
        <div className="section-shell max-w-2xl">
          <Reveal>
            <p className="eyebrow">DORAN MAGAZINE</p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-3 text-[34px] font-extrabold leading-[1.2] tracking-tight text-ink sm:text-[44px]">
              <span className="block">외국어 공부가 막힐 때,</span>
              <span className="block">필요한 답부터 찾아보세요</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-5 text-[16px] leading-relaxed text-ink-soft">
              영어·일본어·중국어 학습법부터 TOEIC·OPIc·JLPT·HSK 같은 시험 준비 순서까지, 실제로 많이 궁금해하는
              주제를 정리했습니다.
            </p>
          </Reveal>
        </div>
      </section>

      {featuredBig && (
        <section className="section-pad border-t border-ink/5 bg-surface-soft">
          <div className="section-shell">
            <Reveal className="max-w-lg">
              <p className="eyebrow">EDITOR&apos;S PICK</p>
              <h2 className="mt-3 text-[24px] font-bold text-ink md:text-[28px]">먼저 읽으면 좋은 글</h2>
            </Reveal>

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              <Reveal className="lg:col-span-2">
                <Link
                  href={`/magazine/${featuredBig.slug}`}
                  className="group flex h-full flex-col justify-between rounded-xl3 border border-ink/8 bg-white p-8 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-card sm:p-10"
                >
                  <div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-[12px] font-bold ${MAGAZINE_ACCENT[featuredBig.language]}`}
                    >
                      {featuredBig.categoryLabel}
                    </span>
                    <p className="mt-4 text-[22px] font-bold leading-snug text-ink sm:text-[26px]">
                      {featuredBig.h1}
                    </p>
                    <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-ink-soft">
                      {featuredBig.cardSummary}
                    </p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-ink-soft">
                    처음 읽기 좋은 글
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </Link>
              </Reveal>

              <Reveal
                delay={80}
                className="flex flex-col justify-center gap-5 rounded-xl3 border border-brand/15 bg-brand-tint/40 p-7"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-brand">
                    <BookOpen size={16} aria-hidden />
                  </span>
                  <div>
                    <p className="text-[18px] font-bold text-ink">{magazineArticles.length}개</p>
                    <p className="text-[12.5px] text-ink-soft">학습 가이드</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-brand">
                    <Globe2 size={16} aria-hidden />
                  </span>
                  <div>
                    <p className="text-[18px] font-bold text-ink">3개 언어</p>
                    <p className="text-[12.5px] text-ink-soft">영어 · 일본어 · 중국어</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-brand">
                    <CalendarDays size={16} aria-hidden />
                  </span>
                  <div>
                    <p className="text-[18px] font-bold text-ink">{latestUpdateLabel(magazineArticles)}</p>
                    <p className="text-[12.5px] text-ink-soft">최근 업데이트</p>
                  </div>
                </div>
              </Reveal>

              {featuredSmall.map((article, index) => (
                <Reveal key={article.slug} delay={160 + index * 60}>
                  <Link
                    href={`/magazine/${article.slug}`}
                    className="group flex h-full flex-col justify-between rounded-xl2 border border-ink/8 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-card"
                  >
                    <div>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${MAGAZINE_ACCENT[article.language]}`}
                      >
                        {article.categoryLabel}
                      </span>
                      <p className="mt-3 text-[15px] font-bold leading-snug text-ink">{article.h1}</p>
                      <p className="mt-2 text-[13px] leading-relaxed text-ink-faint">{article.cardSummary}</p>
                    </div>
                    <span className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-semibold text-ink-soft">
                      자세히 보기
                      <ArrowRight
                        size={14}
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="border-t border-ink/5 bg-surface py-6">
        <div className="section-shell flex flex-wrap items-center gap-2">
          <span className="text-[12.5px] font-semibold text-ink-faint">바로 가기</span>
          {LANGUAGE_SECTIONS.map((lang) => (
            <a
              key={lang}
              href={`#${lang}`}
              className="rounded-full bg-surface-soft px-4 py-1.5 text-[13.5px] font-semibold text-ink-soft transition-colors hover:bg-surface-softer"
            >
              {MAGAZINE_SECTION_TITLE[lang]}
            </a>
          ))}
        </div>
      </div>

      {LANGUAGE_SECTIONS.map((lang) => {
        const articles = getMagazineArticlesByLanguage(lang);
        if (articles.length === 0) return null;
        const groups = groupByCategory(articles);

        return (
          <section key={lang} id={lang} className="section-pad scroll-mt-24 border-t border-ink/5 bg-surface">
            <div className="section-shell">
              <Reveal className="flex max-w-lg items-baseline justify-between gap-3">
                <h2 className="text-[24px] font-bold text-ink md:text-[28px]">
                  {MAGAZINE_SECTION_TITLE[lang]} 콘텐츠
                </h2>
                <span className="text-[13px] font-medium text-ink-faint">{articles.length}개의 글</span>
              </Reveal>

              <div className="mt-8 space-y-10">
                {groups.map(([categoryLabel, groupArticles]) => (
                  <div key={categoryLabel}>
                    <p className="text-[13px] font-bold uppercase tracking-wide text-ink-faint">{categoryLabel}</p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {groupArticles.map((article, index) => (
                        <Reveal key={article.slug} delay={index * 60}>
                          <Link
                            href={`/magazine/${article.slug}`}
                            className="group flex h-full flex-col justify-between rounded-xl2 border border-ink/8 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-card"
                          >
                            <div>
                              <p className="text-[16px] font-bold leading-snug text-ink">{article.h1}</p>
                              <p className="mt-2 text-[13px] leading-relaxed text-ink-faint">
                                {article.cardSummary}
                              </p>
                            </div>
                            <span className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-semibold text-ink-soft">
                              자세히 보기
                              <ArrowRight
                                size={14}
                                className="transition-transform duration-200 group-hover:translate-x-0.5"
                                aria-hidden
                              />
                            </span>
                          </Link>
                        </Reveal>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <StageCTABand
        eyebrow="읽어도 방향이 안 잡힌다면"
        lines={["내 상황에 맞는", "학습 방향 확인하기"]}
        subtitle="지금 수준과 목표를 알려주시면 30초 만에 맞는 방향을 추천해드려요."
        primary={{ label: "SELF-CHECK 해보기", href: "/#self-check" }}
        secondary={{ label: "관련 과정 보기", href: "#courses" }}
      />

      <div id="courses" className="scroll-mt-20">
        <LanguageSelectSection />
      </div>

      <ConsultationSection />
    </>
  );
}

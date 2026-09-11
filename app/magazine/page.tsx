import type { Metadata } from "next";
import Image from "next/image";
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

// 카테고리 헤더의 좌측 accent bar 색상. 언어별 12개 상세페이지가 이미 쓰는
// accent 토큰(bg-{lang}/text-{lang})을 그대로 재사용한다 — 새 색상 없음.
const LANGUAGE_BORDER_ACCENT: Record<LanguageSlug, string> = {
  english: "border-english",
  japanese: "border-japanese",
  chinese: "border-chinese",
};

// 카테고리 한 줄 설명. 새로운 시험 사실을 만들지 않고(TOEIC/OPIc/JLPT/HSK/HSKK는
// data/curriculum/examFacts.ts가 SoT), 카테고리가 다루는 주제 범위만 짧게
// 안내한다. 실제 categoryLabel(6종)과 정확히 일치해야 한다.
const CATEGORY_DESCRIPTION: Record<string, string> = {
  "영어 학습법": "회화 감각을 키우는 공부법과 꾸준히 이어가는 루틴",
  "영어 자격증": "TOEIC · OPIc, 목표 점수까지 준비하는 방법",
  "일본어 학습법": "히라가나부터 회화까지, 시작하는 방법과 루틴",
  "일본어 자격증": "JLPT 급수별 준비 방법과 학습 순서",
  "중국어 학습법": "병음 · 성조부터 회화까지 이어가는 학습법",
  "중국어 자격증": "HSK · HSKK 준비 방법과 학습 순서",
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

// 카테고리별 대표글을 고를 때 위 EDITOR'S PICK과 같은 글을 다시 뽑지 않기
// 위한 제외 목록.
const topFeaturedSlugs = new Set<string>([FEATURED_SLUG, ...Object.values(FEATURED_LANGUAGE_SLUGS)]);

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
      <div className="border-b border-ink/8 bg-surface-soft">
        <div className="section-shell grid gap-8 py-12 sm:py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-14 lg:py-20">
          <div>
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
              <p className="mt-5 max-w-md text-[16px] leading-relaxed text-ink-soft">
                영어·일본어·중국어 학습법부터 TOEIC·OPIc·JLPT·HSK 같은 시험 준비 순서까지, 실제로 많이 궁금해하는
                주제를 정리했습니다.
              </p>
            </Reveal>
            <Reveal delay={220}>
              <div className="mt-6 flex flex-wrap gap-2">
                {LANGUAGE_SECTIONS.map((lang) => (
                  <a
                    key={lang}
                    href={`#${lang}`}
                    className={`rounded-full px-4 py-1.5 text-[13.5px] font-semibold transition-colors hover:opacity-80 ${MAGAZINE_ACCENT[lang]}`}
                  >
                    {MAGAZINE_SECTION_TITLE[lang]}
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={120} className="relative h-[200px] w-full overflow-hidden rounded-xl2 sm:h-[260px] lg:h-[320px]">
            <Image
              src="/images/magazine/hero.jpg"
              alt="낱말이 적힌 마그넷 타일 더미"
              fill
              priority
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-brand-dark/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
          </Reveal>
        </div>
      </div>

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
                      <p className="mt-3 text-[15px] font-bold leading-snug text-ink group-hover:underline group-hover:decoration-ink/30 group-hover:underline-offset-4">
                        {article.h1}
                      </p>
                      <p className="mt-2 text-[13px] leading-relaxed text-ink-faint">{article.cardSummary}</p>
                    </div>
                    <ArrowRight
                      size={15}
                      className="mt-4 text-ink-faint transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-ink"
                      aria-hidden
                    />
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

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

              <div className="mt-10 space-y-12">
                {groups.map(([categoryLabel, groupArticles]) => {
                  // 카테고리마다 대표글 1개를 크게 보여주고, 나머지는 동일한
                  // 흰 카드를 반복하는 대신 가벼운 목록으로 압축한다 — 40개
                  // 전부를 같은 카드로 나열하지 않기 위한 핵심 장치. 이미 위
                  // "EDITOR'S PICK"에 뽑힌 글(언어당 학습법 카테고리 첫 글과
                  // 대부분 겹침)은 대표글로 다시 뽑지 않아, 같은 글이 한
                  // 화면에 두 번 "대표"로 노출되지 않게 한다.
                  const featured = groupArticles.find((a) => !topFeaturedSlugs.has(a.slug)) ?? groupArticles[0];
                  const rest = groupArticles.filter((a) => a.slug !== featured.slug);
                  return (
                    <div key={categoryLabel}>
                      <div
                        className={`flex items-baseline justify-between gap-3 border-l-4 pl-4 ${LANGUAGE_BORDER_ACCENT[lang]}`}
                      >
                        <div>
                          <h3 className="text-[17px] font-bold text-ink">{categoryLabel}</h3>
                          {CATEGORY_DESCRIPTION[categoryLabel] && (
                            <p className="mt-0.5 text-[13px] text-ink-faint">{CATEGORY_DESCRIPTION[categoryLabel]}</p>
                          )}
                        </div>
                        <span className="shrink-0 text-[12.5px] font-medium text-ink-faint">
                          {groupArticles.length}개
                        </span>
                      </div>

                      <Reveal className="mt-5 grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:items-start">
                        <Link
                          href={`/magazine/${featured.slug}`}
                          className="group flex flex-col justify-between rounded-xl2 border border-ink/8 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-card sm:p-7"
                        >
                          <div>
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${MAGAZINE_ACCENT[lang]}`}
                            >
                              대표글
                            </span>
                            <p className="mt-3 text-[17px] font-bold leading-snug text-ink sm:text-[19px]">
                              {featured.h1}
                            </p>
                            <p className="mt-2.5 text-[14px] leading-relaxed text-ink-soft">{featured.cardSummary}</p>
                          </div>
                          <ArrowRight
                            size={16}
                            className="mt-5 text-ink-faint transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-ink"
                            aria-hidden
                          />
                        </Link>

                        <div className="flex min-w-0 flex-col">
                          {rest.map((article, index) => (
                            <Link
                              key={article.slug}
                              href={`/magazine/${article.slug}`}
                              className="group -mx-2 flex min-w-0 gap-3 rounded-lg border-b border-ink/6 px-2 py-3 transition-colors last:border-b-0 hover:bg-surface-soft"
                            >
                              <span className="shrink-0 pt-0.5 text-[12px] font-semibold tabular-nums text-ink-faint">
                                {String(index + 2).padStart(2, "0")}
                              </span>
                              <span className="min-w-0">
                                <span className="block text-[14.5px] font-semibold leading-snug text-ink group-hover:underline group-hover:decoration-ink/30 group-hover:underline-offset-4">
                                  {article.h1}
                                </span>
                                <span className="mt-0.5 block truncate text-[12.5px] text-ink-faint">
                                  {article.cardSummary}
                                </span>
                              </span>
                            </Link>
                          ))}
                        </div>
                      </Reveal>
                    </div>
                  );
                })}
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

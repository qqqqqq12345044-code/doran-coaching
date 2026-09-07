import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import Reveal from "@/components/Reveal";
import ConsultationSection from "@/components/ConsultationSection";
import { getMagazineTopicsForLanguage } from "@/data/navigation/languageNavigation";
import { languages, type LanguageSlug } from "@/data/languages";
import { magazineArticles, getMagazineArticlesByLanguage, type MagazineLanguage } from "@/data/magazine";

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

const MAGAZINE_SECTION_TITLE: Record<MagazineLanguage, string> = {
  english: "영어",
  japanese: "일본어",
  chinese: "중국어",
  common: "학습법",
};

// 실제 발행된 매거진 글(1차 배치, data/magazine). 카테고리 필터 UI 없이도
// 구분되도록 언어별 섹션으로 정적으로 나열한다(기존 Topic Prototype 섹션과
// 같은 패턴 — Client Component 없이 정적 렌더링 유지).
const MAGAZINE_SECTION_ORDER: MagazineLanguage[] = ["english", "japanese", "chinese", "common"];

export default function MagazinePage() {
  return (
    <>
      <section className="section-pad bg-surface">
        <div className="section-shell max-w-2xl">
          <p className="eyebrow">DORAN MAGAZINE</p>
          <h1 className="mt-3 text-[34px] font-extrabold leading-[1.2] tracking-tight text-ink sm:text-[44px]">
            <span className="block">궁금한 질문에</span>
            <span className="block">바로 답하는 학습 가이드</span>
          </h1>
          <p className="mt-5 text-[16px] leading-relaxed text-ink-soft">
            회화가 늘지 않는 이유부터 TOEIC·OPIc·JLPT·HSK 시험 준비 순서까지, 실제로 많이 궁금해하는 주제를
            정리했습니다.
          </p>
        </div>
      </section>

      {MAGAZINE_SECTION_ORDER.map((lang) => {
        const articles = getMagazineArticlesByLanguage(lang);
        if (articles.length === 0) return null;
        return (
          <section key={lang} className="section-pad border-t border-ink/5 bg-surface">
            <div className="section-shell">
              <Reveal className="max-w-lg">
                <h2 className="text-[24px] font-bold text-ink md:text-[28px]">
                  {MAGAZINE_SECTION_TITLE[lang]} 콘텐츠
                </h2>
              </Reveal>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((article, index) => (
                  <Reveal key={article.slug} delay={index * 60}>
                    <Link
                      href={`/magazine/${article.slug}`}
                      className="group flex h-full flex-col justify-between rounded-xl2 border border-ink/8 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-card"
                    >
                      <div>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${MAGAZINE_ACCENT[lang]}`}
                        >
                          {article.categoryLabel}
                        </span>
                        <p className="mt-3 text-[16px] font-bold leading-snug text-ink">{article.h1}</p>
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
        );
      })}

      <section className="section-pad border-t border-ink/5 bg-surface">
        <div className="section-shell max-w-2xl">
          <p className="eyebrow">COMING SOON</p>
          <h2 className="mt-3 text-[24px] font-bold text-ink md:text-[28px]">
            실전 소재로 배우는 외국어 이야기
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
            미드, 팝송, 뉴스, 애니메이션, 드라마 같은 실제 소재로 언어를 접하는 주제도 준비 중입니다. 위{" "}
            {magazineArticles.length}개 글처럼 하나씩 본문을 채워갈 예정입니다.
          </p>
        </div>
      </section>

      {languages.map((lang) => {
        const topics = getMagazineTopicsForLanguage(lang.slug);
        if (topics.length === 0) return null;
        return (
          <section key={lang.slug} className="section-pad border-t border-ink/5 bg-surface-soft">
            <div className="section-shell">
              <Reveal className="max-w-lg">
                <h2 className="text-[24px] font-bold text-ink md:text-[28px]">{lang.nameKo} 콘텐츠</h2>
              </Reveal>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {topics.map((topic, index) => (
                  <Reveal key={topic.id} delay={index * 60}>
                    <div className="flex h-full flex-col justify-between rounded-xl2 border border-ink/8 bg-white p-5 transition-shadow duration-200 hover:shadow-card">
                      <div>
                        <span
                          className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${LANGUAGE_ACCENT[lang.slug]}`}
                        >
                          <BookOpen size={16} aria-hidden />
                        </span>
                        <p className="mt-3 text-[15px] font-bold text-ink">{topic.displayLabel}</p>
                      </div>
                      <span className="mt-4 inline-block text-[12px] font-medium text-ink-faint">
                        콘텐츠 준비 중
                      </span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <ConsultationSection />
    </>
  );
}

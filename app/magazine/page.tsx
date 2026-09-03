import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import Reveal from "@/components/Reveal";
import ConsultationSection from "@/components/ConsultationSection";
import { getMagazineTopicsForLanguage } from "@/data/navigation/languageNavigation";
import { languages, type LanguageSlug } from "@/data/languages";

export const metadata: Metadata = {
  title: "매거진 | 도란 DORAN",
  description:
    "미드, 팝송, 뉴스, 애니메이션, 드라마 등 실제 소재로 배우는 도란 매거진. 회화 학습에 도움이 되는 주제를 모았습니다.",
};

const LANGUAGE_ACCENT: Record<LanguageSlug, string> = {
  english: "bg-english-tint text-english",
  japanese: "bg-japanese-tint text-japanese",
  chinese: "bg-chinese-tint text-chinese",
};

// data/curriculum/powerCurriculum.ts 에서 usage에 "content"가 포함된 항목만
// 언어별로 보여주는 Magazine Index Prototype. 아직 Article 상세페이지가 없으므로
// 카드는 클릭할 수 없는 Topic Preview로만 노출한다(가짜 링크를 만들지 않는다).
export default function MagazinePage() {
  return (
    <>
      <section className="section-pad bg-surface">
        <div className="section-shell max-w-2xl">
          <p className="eyebrow">DORAN MAGAZINE</p>
          <h1 className="mt-3 text-[34px] font-extrabold leading-[1.2] tracking-tight text-ink sm:text-[44px]">
            <span className="block">실전 소재로 배우는</span>
            <span className="block">외국어 이야기</span>
          </h1>
          <p className="mt-5 text-[16px] leading-relaxed text-ink-soft">
            미드, 팝송, 뉴스, 애니메이션, 드라마 같은 실제 소재로 언어를 접하는 주제를 모았습니다.
            아직 본문 콘텐츠는 준비 중이며, 앞으로 하나씩 채워갈 예정입니다.
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

"use client";

import { useState } from "react";
import Link from "next/link";
import AnchorLink from "@/components/AnchorLink";
import Reveal from "@/components/Reveal";
import { ArrowLeft, ArrowRight, Check, ChevronRight, MessageCircle, RotateCcw, Sparkles } from "lucide-react";
import { languages, type LanguageSlug } from "@/data/languages";
import {
  selfCheckGoals,
  selfCheckLevels,
  getGoalHint,
  getSelfCheckResult,
} from "@/data/selfCheck";
import { getRelatedCurriculumTopicsForGoal } from "@/data/selfCheckCurriculum";
import { getPublishedReviewsByLanguage } from "@/data/reviews";

type Step = 1 | 2 | 3 | 4;

const STEP_LABELS = ["언어 선택", "지금 고민", "현재 수준"];

const ACCENT: Record<
  LanguageSlug,
  { text: string; hoverBorder: string; solidBtn: string; chip: string; solidBg: string }
> = {
  english: {
    text: "text-english",
    hoverBorder: "hover:border-english/60",
    solidBtn: "bg-english hover:bg-english-dark",
    chip: "bg-english-tint text-english-dark",
    solidBg: "bg-english",
  },
  japanese: {
    text: "text-japanese",
    hoverBorder: "hover:border-japanese/60",
    solidBtn: "bg-japanese hover:bg-japanese-dark",
    chip: "bg-japanese-tint text-japanese-dark",
    solidBg: "bg-japanese",
  },
  chinese: {
    text: "text-chinese",
    hoverBorder: "hover:border-chinese/60",
    solidBtn: "bg-chinese hover:bg-chinese-dark",
    chip: "bg-chinese-tint text-chinese-dark",
    solidBg: "bg-chinese",
  },
};

const OPTION_CARD =
  "group w-full rounded-xl2 border border-ink/10 bg-surface-soft px-5 py-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:bg-white hover:shadow-card focus-visible:-translate-y-0.5";

export default function SelfCheck() {
  const [step, setStep] = useState<Step>(1);
  const [language, setLanguage] = useState<LanguageSlug | null>(null);
  const [goalId, setGoalId] = useState<string | null>(null);
  const [levelId, setLevelId] = useState<string | null>(null);

  const accent = language ? ACCENT[language] : null;
  const result =
    step === 4 && language && goalId && levelId
      ? getSelfCheckResult(language, goalId, levelId)
      : null;

  function selectLanguage(slug: LanguageSlug) {
    setLanguage(slug);
    setStep(2);
  }

  function selectGoal(id: string) {
    setGoalId(id);
    setStep(3);
  }

  function selectLevel(id: string) {
    setLevelId(id);
    setStep(4);
  }

  function goBack() {
    setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev));
  }

  function reset() {
    setLanguage(null);
    setGoalId(null);
    setLevelId(null);
    setStep(1);
  }

  const stepAccentBg = accent?.solidBg ?? "bg-brand";

  return (
    <section id="self-check" className="section-pad scroll-mt-20 relative overflow-hidden bg-surface-soft">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-brand/8 blur-3xl animate-float-slow" />
        <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-japanese/8 blur-3xl animate-float-slow-delayed" />
      </div>

      <div className="section-shell relative">
        <div className="mx-auto max-w-3xl rounded-xl3 border border-ink/8 bg-white p-7 shadow-card md:p-12">
          <Reveal className="text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-tint px-3.5 py-1.5">
              <Sparkles size={13} className="text-brand" aria-hidden />
              <p className="text-xs font-bold tracking-wide text-brand">SELF CHECK</p>
            </div>
            <h2 className="mt-4 text-[26px] font-bold leading-snug text-ink md:text-[32px]">
              요즘 외국어 공부, 뭐가 가장 답답하세요?
            </h2>
            <p className="mx-auto mt-3 max-w-sm whitespace-pre-line text-[15px] leading-relaxed text-ink-soft">
              {"30초면 나에게 맞는 수업 방향을\n바로 확인할 수 있어요."}
            </p>
          </Reveal>

          {step !== 4 && (
            <Reveal delay={100} className="mx-auto mt-9 flex max-w-md items-center justify-between">
              {STEP_LABELS.map((label, index) => {
                const n = index + 1;
                const isDone = n < step;
                const isCurrent = n === step;
                return (
                  <div key={label} className="flex flex-1 items-center last:flex-initial">
                    <div className="flex flex-col items-center gap-1.5">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-bold transition-all duration-300 ${
                          isDone
                            ? `${stepAccentBg} text-white`
                            : isCurrent
                              ? `${stepAccentBg} text-white ring-4 ring-brand/15`
                              : "bg-ink/8 text-ink-faint"
                        }`}
                      >
                        {isDone ? <Check size={15} aria-hidden /> : n}
                      </div>
                      <span
                        className={`whitespace-nowrap text-[11px] font-semibold ${
                          isCurrent ? "text-ink" : "text-ink-faint"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                    {n !== STEP_LABELS.length && (
                      <div
                        className={`mx-2 mb-4 h-[2px] flex-1 rounded-full transition-colors duration-300 ${
                          n < step ? stepAccentBg : "bg-ink/10"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </Reveal>
          )}

          <div key={step} className="mt-9 animate-fade-up">
            {step === 1 && (
              <div>
                <h3 className="text-center text-[18px] font-bold text-ink md:text-[20px]">
                  어떤 언어를 배우고 싶으세요?
                </h3>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {languages.map((lang) => {
                    const langAccent = ACCENT[lang.slug];
                    return (
                      <button
                        key={lang.slug}
                        type="button"
                        onClick={() => selectLanguage(lang.slug)}
                        className={`group flex flex-col items-center gap-3 rounded-xl2 border border-ink/10 bg-surface-soft px-6 py-8 transition-all duration-200 hover:-translate-y-1 hover:border-transparent hover:bg-white hover:shadow-card ${langAccent.hoverBorder}`}
                      >
                        <span
                          className={`flex h-16 w-16 items-center justify-center rounded-full px-1 ${langAccent.chip} transition-transform duration-200 group-hover:scale-105`}
                        >
                          <span className={`${lang.nativeFontClass} whitespace-nowrap text-[13px] font-bold tracking-tight`}>
                            {lang.nameNative}
                          </span>
                        </span>
                        <span className="text-[16px] font-bold text-ink">{lang.nameKo}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 2 && language && accent && (
              <div>
                <button type="button" onClick={goBack} className="btn-ghost gap-1 text-[13px]">
                  <ArrowLeft size={14} aria-hidden />
                  이전
                </button>
                <h3 className="mt-4 text-center text-[18px] font-bold text-ink md:text-[20px]">
                  요즘 가장 답답한 게 뭔가요?
                </h3>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {selfCheckGoals.map((goal) => {
                    const hint = getGoalHint(goal, language);
                    return (
                      <button
                        key={goal.id}
                        type="button"
                        onClick={() => selectGoal(goal.id)}
                        className={`${OPTION_CARD} ${accent.hoverBorder} flex items-center justify-between gap-3`}
                      >
                        <span>
                          <span className="block text-[15px] font-medium text-ink">
                            {goal.label}
                          </span>
                          {hint && (
                            <span className="mt-1 block text-[12px] font-medium text-ink-faint">
                              {hint}
                            </span>
                          )}
                        </span>
                        <ChevronRight
                          size={16}
                          className={`shrink-0 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 ${accent.text}`}
                          aria-hidden
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 3 && language && accent && (
              <div>
                <button type="button" onClick={goBack} className="btn-ghost gap-1 text-[13px]">
                  <ArrowLeft size={14} aria-hidden />
                  이전
                </button>
                <h3 className="mt-4 text-center text-[18px] font-bold text-ink md:text-[20px]">
                  지금 어느 정도 할 수 있나요?
                </h3>
                <div className="mx-auto mt-6 max-w-md space-y-3">
                  {selfCheckLevels.map((level) => (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => selectLevel(level.id)}
                      className={`${OPTION_CARD} ${accent.hoverBorder} flex items-center justify-between gap-3 text-[15px] font-medium text-ink`}
                    >
                      {level.label}
                      <ChevronRight
                        size={16}
                        className={`shrink-0 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 ${accent.text}`}
                        aria-hidden
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && result && accent && language && goalId && (
              <div className="text-center">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {[
                    languages.find((lang) => lang.slug === language)?.nameKo,
                    selfCheckGoals.find((goal) => goal.id === goalId)?.label,
                    levelId
                      ? selfCheckLevels.find((level) => level.id === levelId)?.label
                      : null,
                  ]
                    .filter((label): label is string => Boolean(label))
                    .map((label) => (
                      <span
                        key={label}
                        className="rounded-full border border-ink/10 bg-surface-soft px-3 py-1 text-xs font-semibold text-ink-soft"
                      >
                        {label}
                      </span>
                    ))}
                </div>

                {/* 1. 고민 요약 */}
                <p className="mx-auto mt-5 max-w-md text-[15px] font-medium leading-relaxed text-ink-faint">
                  &ldquo;{selfCheckGoals.find((goal) => goal.id === goalId)?.label}&rdquo;
                </p>

                {/* 2~3. 추천 방향 + 왜 잘 맞는지 — 결과의 핵심을 하나의 카드로 묶어
                    맥락 요약(위)/부가 정보(아래)와 시각적으로 구분한다. */}
                <div
                  className={`mx-auto mt-6 max-w-md rounded-xl3 border-2 p-6 md:p-8 ${accent.chip} border-current/15`}
                >
                  <p className="text-xs font-bold uppercase tracking-wide opacity-70">추천</p>
                  <h3 className="mt-2 text-[22px] font-bold leading-snug md:text-[26px]">
                    {result.title}
                  </h3>
                  <p className="mt-4 text-[15px] leading-relaxed opacity-90">{result.description}</p>

                  <p className="mt-6 text-xs font-bold uppercase tracking-wide opacity-70">추천 학습</p>
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    {result.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/70 px-4 py-2 text-[13px] font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className={`mx-auto mt-6 flex flex-col items-center gap-1 rounded-xl2 px-6 py-4 text-white ${accent.solidBg}`}>
                    <span className="text-xs font-semibold uppercase tracking-wide opacity-80">
                      추천 과정
                    </span>
                    <span className="text-[17px] font-bold">{result.course}</span>
                  </div>
                </div>

                {/* 4. 관련 과정(실제 Power Curriculum 연결) */}
                {(() => {
                  const relatedTopics = getRelatedCurriculumTopicsForGoal(language, goalId);
                  if (relatedTopics.length === 0) return null;
                  return (
                    <div className="mt-7">
                      <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                        이런 과정도 함께 볼 수 있어요
                      </p>
                      <div className="mt-3 flex flex-wrap justify-center gap-2">
                        {relatedTopics.map((topic) => (
                          <span
                            key={topic}
                            className="rounded-full border border-ink/10 bg-surface-soft px-3.5 py-1.5 text-[12px] font-semibold text-ink-soft"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* 비슷한 고민의 후기(같은 language만, 새 후기 생성 없음) */}
                {(() => {
                  const relatedReviews = getPublishedReviewsByLanguage(language).slice(0, 2);
                  if (relatedReviews.length === 0) return null;
                  return (
                    <div className="mx-auto mt-8 max-w-md rounded-xl2 border border-ink/8 bg-surface-soft p-5 text-left">
                      <p className="text-center text-xs font-semibold uppercase tracking-wide text-ink-faint">
                        비슷한 고민으로 시작했어요
                      </p>
                      <div className="mt-4 space-y-4">
                        {relatedReviews.map((review) => (
                          <div key={review.id}>
                            <p className="text-[14px] leading-relaxed text-ink">&ldquo;{review.quote}&rdquo;</p>
                            <p className="mt-1.5 text-[12px] font-medium text-ink-faint">{review.meta}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* 5. 상담 CTA */}
                <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <Link
                    href={`/${language}`}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-semibold text-white transition-colors duration-200 sm:w-auto ${accent.solidBtn}`}
                  >
                    추천 과정 알아보기
                    <ArrowRight size={16} aria-hidden />
                  </Link>
                  <AnchorLink href="#consultation" className="btn-secondary w-full sm:w-auto">
                    <MessageCircle size={16} aria-hidden />
                    무료 상담 신청
                  </AnchorLink>
                </div>

                <button type="button" onClick={reset} className="btn-ghost mx-auto mt-6 gap-1.5">
                  <RotateCcw size={14} aria-hidden />
                  다시 해보기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

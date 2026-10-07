"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import AnchorLink from "@/components/AnchorLink";
import Reveal from "@/components/Reveal";
import { languages, type LanguageSlug } from "@/data/languages";
import { selfCheckGoals, getGoalHint } from "@/data/selfCheck";
import type { CourseCategoryId } from "@/data/navigation/languageNavigation";

// 홈 "상황 선택 → 짧은 추천 → 기존 Curriculum Explorer / SELF-CHECK 이동" 진입 UI.
// 새 추천 엔진이 아니다: 상황 id는 SELF-CHECK goal id(data/selfCheck.ts)를 그대로
// 쓰고, 이동 대상은 언어 페이지 Curriculum Explorer의 기존 카테고리 섹션
// anchor(/english#conversation 등)다. 언어별 카테고리 배정은
// data/navigation/languageNavigation.ts(CATEGORY_BY_ITEM_ID) /
// data/courses.ts(coursesByLanguage)의 기존 분류를 따른다(예: 영어 비즈니스는
// other, 일본어·중국어 비즈니스는 conversation).
interface Situation {
  goalId: string;
  label: string;
  direction: string;
  category: CourseCategoryId | Record<LanguageSlug, CourseCategoryId>;
}

const SITUATIONS: Situation[] = [
  {
    goalId: "beginner",
    label: "처음 시작해요",
    direction: "문자와 발음부터 차근차근, 첫 문장을 소리 내어 말하는 데까지 함께 갑니다.",
    category: "conversation",
  },
  {
    goalId: "conversation",
    label: "대화하고 싶어요",
    direction: "여행·일상 대화에서 아는 표현을 바로 꺼내 쓰도록, 말하는 시간을 수업의 중심에 둡니다.",
    category: "conversation",
  },
  {
    goalId: "exam",
    label: "시험을 준비해요",
    direction: "목표 시험과 급수에 맞춰, 필요한 유형부터 전략적으로 준비합니다.",
    category: "certification",
  },
  {
    goalId: "school",
    label: "학교 내신을 준비해요",
    direction: "학교 진도와 시험 범위에 맞춰, 1:1로 내신을 준비합니다.",
    category: "school",
  },
  {
    goalId: "abroad",
    label: "유학·워홀 준비해요",
    direction: "현지 생활과 학업에서 실제로 마주칠 상황의 표현을 미리 연습합니다.",
    category: "other",
  },
  {
    goalId: "business",
    label: "업무에 필요해요",
    direction: "미팅·이메일 등 실제 업무 상황에서 쓰는 표현을 중심으로 준비합니다.",
    category: { english: "other", japanese: "conversation", chinese: "conversation" },
  },
];

const LESSON_FORMAT = "1:1 온라인 화상 수업 · 수준과 목표 확인 후 코치 매칭";

function getCategoryFor(situation: Situation, language: LanguageSlug): CourseCategoryId {
  return typeof situation.category === "string" ? situation.category : situation.category[language];
}

// COURSE_CATEGORIES의 "기타 수업 문의"는 메뉴용 문구라, 여기서는 Curriculum
// Explorer의 해당 섹션 제목("목적별 수업 안내")에 맞춘 짧은 라벨을 쓴다.
const CATEGORY_LABEL: Record<CourseCategoryId, string> = {
  conversation: "회화 과정",
  certification: "자격증 과정",
  school: "내신 대비",
  other: "목적별 수업",
};

export default function HomeSituationPicker() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = SITUATIONS.find((situation) => situation.goalId === selectedId) ?? null;
  const selectedGoal = selected ? selfCheckGoals.find((goal) => goal.id === selected.goalId) : null;

  return (
    <section id="course" className="scroll-mt-20 bg-surface py-16 md:py-28">
      <div className="section-shell">
        <Reveal className="max-w-xl">
          <p className="eyebrow">나에게 맞는 학습 방향</p>
          <h2 className="text-balance mt-3 text-[28px] font-bold leading-snug text-ink md:text-[34px]">
            <span className="block">목적이 다르면,</span>
            <span className="block">배우는 방법도 달라야 하니까.</span>
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-soft md:text-[16px]">
            지금 내 상황을 골라보세요. 어떤 과정부터 보면 되는지 바로 알려드려요.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-3">
          {SITUATIONS.map((situation) => {
            const isSelected = situation.goalId === selectedId;
            return (
              <button
                key={situation.goalId}
                type="button"
                aria-pressed={isSelected}
                aria-controls="situation-result"
                onClick={() => setSelectedId(situation.goalId)}
                className={`flex min-h-[3.5rem] items-center rounded-xl2 border px-4 py-3 text-left text-[14px] font-semibold transition-all duration-200 sm:px-5 sm:text-[15px] ${
                  isSelected
                    ? "border-brand bg-brand text-white shadow-card"
                    : "border-ink/10 bg-surface-soft text-ink hover:-translate-y-0.5 hover:border-ink/15 hover:bg-white hover:shadow-card"
                }`}
              >
                <span>{situation.label}</span>
              </button>
            );
          })}
        </div>

        <div id="situation-result" aria-live="polite" className="mt-5">
          {selected ? (
            <div key={selected.goalId} className="animate-fade-up rounded-xl3 border border-ink/8 bg-surface-soft p-6 md:p-8">
              <p className="text-xs font-bold uppercase tracking-wide text-brand">추천 학습 방향</p>
              <p className="mt-2 text-[17px] font-bold leading-snug text-ink md:text-[19px]">{selected.direction}</p>
              <p className="text-balance mt-3 text-[13px] font-medium text-ink-faint">{LESSON_FORMAT}</p>

              <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                언어별 과정 바로 보기
              </p>
              <ul className="mt-3 grid gap-2.5 sm:grid-cols-3">
                {languages.map((language) => {
                  const category = getCategoryFor(selected, language.slug);
                  const hint = selectedGoal ? getGoalHint(selectedGoal, language.slug) : null;
                  return (
                    <li key={language.slug}>
                      <Link
                        href={`/${language.slug}#${category}`}
                        className="group flex min-h-[3.5rem] items-center justify-between gap-3 rounded-xl2 border border-ink/8 bg-white px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card"
                      >
                        <span className="min-w-0">
                          <span className="block text-[15px] font-semibold text-ink">
                            {language.nameKo} {CATEGORY_LABEL[category]}
                          </span>
                          {hint && <span className="mt-0.5 block text-[12px] font-medium text-ink-faint">{hint}</span>}
                        </span>
                        <ArrowRight
                          size={15}
                          className="shrink-0 text-ink/30 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-ink/60"
                          aria-hidden
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-6 flex flex-col gap-2.5 border-t border-ink/8 pt-6 sm:flex-row sm:items-center">
                <AnchorLink href="#self-check" className="btn-primary w-full sm:w-auto">
                  <Sparkles size={16} aria-hidden />
                  SELF-CHECK로 수준 확인
                </AnchorLink>
                <AnchorLink href="#consultation" className="btn-secondary w-full sm:w-auto">
                  <MessageCircle size={16} aria-hidden />
                  무료 상담 신청
                </AnchorLink>
              </div>
            </div>
          ) : (
            <p className="rounded-xl2 border border-dashed border-ink/12 px-5 py-4 text-center text-[13.5px] text-ink-faint">
              상황을 선택하면 추천 학습 방향과 바로 볼 수 있는 과정을 보여드려요.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

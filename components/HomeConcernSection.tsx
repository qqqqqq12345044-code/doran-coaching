import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AnchorLink from "@/components/AnchorLink";
import Reveal from "@/components/Reveal";
import type { LanguageSlug } from "@/data/languages";

interface Concern {
  language: LanguageSlug;
  label: string;
  quote: string;
  solution: string;
  href: string;
  ctaLabel: string;
}

// 홈 Hero 직후 "이거 내 얘기인데?"를 만드는 언어별 대표 고민. 해결 한 줄은
// 각 회화 상세페이지(data/detailPages/*.ts의 directAnswer·대상 bullets)에 이미
// 있는 수업 방식만 짧게 옮겼고, 새 성과/수치는 넣지 않는다. 언어 색은 작은
// chip에만 쓰고 카드 자체는 공통 톤을 유지한다(ReviewStoryCard와 같은 chip 패턴).
const CONCERNS: Concern[] = [
  {
    language: "english",
    label: "영어",
    quote: "단어도 문법도 아는데, 막상 말하려면 문장이 안 나와요.",
    solution: "상황별로 소리 내어 말하는 연습을 반복해, 아는 표현을 바로 꺼내 쓰게 합니다.",
    href: "/english/conversation",
    ctaLabel: "영어 회화 과정 보기",
  },
  {
    language: "japanese",
    label: "일본어",
    quote: "JLPT 공부는 했는데, 일본인 앞에서는 말이 막혀요.",
    solution: "일상 대화부터 내 생각 말하기까지, 아는 일본어를 실제 대화로 옮기는 연습을 합니다.",
    href: "/japanese/conversation",
    ctaLabel: "일본어 회화 과정 보기",
  },
  {
    language: "chinese",
    label: "중국어",
    quote: "배운 표현은 많은데, 듣고 바로 대답하기가 어려워요.",
    solution: "짧은 문장을 성조까지 맞춰 따라 말하며, 듣고 바로 답하는 감각을 키웁니다.",
    href: "/chinese/conversation",
    ctaLabel: "중국어 회화 과정 보기",
  },
];

const LANGUAGE_TINT: Record<LanguageSlug, string> = {
  english: "bg-english-tint text-english-dark",
  japanese: "bg-japanese-tint text-japanese-dark",
  chinese: "bg-chinese-tint text-chinese-dark",
};

export default function HomeConcernSection() {
  return (
    <section id="concern" className="scroll-mt-20 bg-surface pb-12 pt-16 md:pb-24 md:pt-28">
      <div className="section-shell">
        <Reveal className="max-w-xl">
          <h2 className="text-[28px] font-bold leading-snug text-ink md:text-[34px]">
            <span className="block">외국어 공부,</span>
            <span className="block">이런 고민 있으셨나요?</span>
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-soft md:text-[16px]">
            아는 것과 말할 수 있는 것 사이의 거리, 도란은 그 간극을 1:1 대화로 좁혀요.
          </p>
        </Reveal>

        <ul className="mt-10 grid gap-4 md:mt-12 md:grid-cols-3 md:gap-5">
          {CONCERNS.map((concern, index) => (
            <li key={concern.language}>
              <Reveal delay={index * 80} className="h-full">
              <div className="flex h-full flex-col rounded-xl2 border border-ink/8 bg-surface-soft p-6 md:p-7">
                <span
                  className={`self-start rounded-full px-2.5 py-1 text-[11px] font-bold ${LANGUAGE_TINT[concern.language]}`}
                >
                  {concern.label}
                </span>
                <p className="mt-4 text-[17px] font-semibold leading-snug text-ink md:text-[18px]">
                  &ldquo;{concern.quote}&rdquo;
                </p>
                <p className="mt-3 flex-1 text-[14px] leading-relaxed text-ink-soft">
                  <span className="font-semibold text-brand">도란에서는 </span>
                  {concern.solution}
                </p>
                <Link
                  href={concern.href}
                  className="group mt-5 inline-flex min-h-11 items-center gap-1.5 self-start text-[14px] font-semibold text-ink transition-colors duration-200 hover:text-brand"
                >
                  {concern.ctaLabel}
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={200} className="mt-8 flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-center sm:gap-3">
          <p className="text-[14px] text-ink-soft">내 고민이 여기 없다면?</p>
          <AnchorLink href="#self-check" className="btn-secondary px-6 py-3 text-[14px]">
            30초 SELF-CHECK로 확인하기
            <ArrowRight size={15} aria-hidden />
          </AnchorLink>
        </Reveal>
      </div>
    </section>
  );
}

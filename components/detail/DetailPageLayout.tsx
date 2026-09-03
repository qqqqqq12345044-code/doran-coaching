import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Breadcrumb from "./Breadcrumb";
import DirectAnswer from "./DirectAnswer";
import DetailSection from "./DetailSection";
import ExamWalkthroughSection from "./ExamWalkthroughSection";
import CurriculumChips from "./CurriculumChips";
import DetailReviews from "./DetailReviews";
import DetailFAQ from "./DetailFAQ";
import RelatedLinks from "./RelatedLinks";
import type { DetailPageContent } from "@/data/detailPages/types";
import { COURSE_CATEGORIES } from "@/data/navigation/languageNavigation";

interface DetailPageAccent {
  /** DORAN LEARNING ROADMAP 뱃지 등에 쓰는 진한 배경. 예: "bg-english text-white" */
  solid: string;
  /** 링크 hover 화살표 등 포인트 텍스트 색상. 예: "text-english" */
  text: string;
  /** Direct Answer 뱃지/칩 배경. 예: "bg-english-tint text-english-dark" */
  tint: string;
}

interface DetailPageLayoutProps {
  content: DetailPageContent;
  accent: DetailPageAccent;
  languageNameKo: string;
  languageHref: string;
}

// 12개 세부 과정 페이지가 공유하는 유일한 레이아웃. 본문 문구는 모두
// data/detailPages에서 오고, 이 컴포넌트는 순수 렌더링만 담당하는 Server
// Component다(클라이언트 JS 없이 전체 본문이 최초 HTML에 포함된다).
// HomeHero/LanguageHeroVisual 같은 큰 사진 Hero는 재사용하지 않고, 콘텐츠
// 가독성을 우선하는 절제된 구조를 사용한다.
export default function DetailPageLayout({ content, accent, languageNameKo, languageHref }: DetailPageLayoutProps) {
  const otherCategories = COURSE_CATEGORIES.filter((category) => category.id !== content.category);

  return (
    <article className="bg-surface">
      <div className="section-shell pt-8 sm:pt-10">
        <Breadcrumb
          items={[
            { label: "홈", href: "/" },
            { label: languageNameKo, href: languageHref },
            { label: content.breadcrumbLabel },
          ]}
        />

        <p className="eyebrow mt-5">{content.eyebrow}</p>
        <h1 className="text-balance mt-2 text-[28px] font-extrabold leading-[1.25] tracking-tight text-ink sm:text-[36px]">
          {content.h1}
        </h1>

        <DirectAnswer
          question={content.directAnswer.question}
          answer={content.directAnswer.answer}
          accentTintClass={accent.tint}
        />
      </div>

      <div className="section-shell pb-20 sm:pb-24">
        <div className="mt-8 space-y-3">
          {content.intro.map((paragraph) => (
            <p key={paragraph} className="text-pretty text-[15px] leading-relaxed text-ink-soft">
              {paragraph}
            </p>
          ))}
        </div>

        {content.sections.map((section) => (
          <DetailSection key={section.heading} {...section} />
        ))}

        {content.examWalkthrough && <ExamWalkthroughSection items={content.examWalkthrough} />}

        <CurriculumChips ids={content.linkedCurriculumIds} tintClass={accent.tint} />

        <DetailReviews ids={content.reviewIds} />

        <DetailFAQ items={content.faq} />

        <RelatedLinks
          title={`다른 ${languageNameKo} 과정도 확인해보세요`}
          accentTextClass={accent.text}
          links={[
            ...otherCategories.map((category) => ({
              label: category.label,
              href: `${languageHref}/${category.sectionId}`,
            })),
            { label: `${languageNameKo} 전체 과정 보기`, href: languageHref },
          ]}
        />

        <div className="mt-10 flex flex-col items-start gap-4 rounded-xl2 border border-ink/8 bg-surface-soft p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[15px] font-semibold text-ink">
            내 목표에 맞는 학습 방향이 궁금하다면 상담을 통해 확인해보세요.
          </p>
          <Link href={`${languageHref}#consultation`} className="btn-primary shrink-0">
            무료 상담 신청
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}

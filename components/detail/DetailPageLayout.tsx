import { Fragment } from "react";
import DetailHero from "./DetailHero";
import DirectAnswer from "./DirectAnswer";
import KeySummaryPanel, { type KeySummaryColumn } from "./KeySummaryPanel";
import DetailRoadmapBlock from "./DetailRoadmapBlock";
import DetailSection from "./DetailSection";
import ExamWalkthroughSection from "./ExamWalkthroughSection";
import CurriculumChips from "./CurriculumChips";
import DetailReviews from "./DetailReviews";
import DetailFAQ from "./DetailFAQ";
import RelatedLinks from "./RelatedLinks";
import DetailCTABand from "./DetailCTABand";
import CurriculumVisualBanner from "@/components/CurriculumVisualBanner";
import RoadmapTimeline from "@/components/curriculum/RoadmapTimeline";
import CertificationExplorer from "@/components/curriculum/CertificationExplorer";
import OtherPurposeGrid from "@/components/curriculum/OtherPurposeGrid";
import Reveal from "@/components/Reveal";
import type { DetailCategory, DetailPageContent } from "@/data/detailPages/types";
import type { CurriculumLanguage } from "@/data/curriculum/powerCurriculum";
import {
  getConversationRoadmap,
  getSchoolRoadmap,
  getCertificationRoadmaps,
  getOtherCourseGroup,
  getLinkedCurriculumLabels,
} from "@/data/curriculum/courseDetails";
import { COURSE_CATEGORIES } from "@/data/navigation/languageNavigation";

interface DetailPageAccent {
  /** DORAN LEARNING ROADMAP 뱃지, STEP 배지 등에 쓰는 진한 배경. 예: "bg-english text-white" */
  solid: string;
  /** 링크 hover 화살표 등 포인트 텍스트 색상. 예: "text-english" */
  text: string;
  /** Direct Answer/칩/뱃지 배경. 예: "bg-english-tint text-english-dark" */
  tint: string;
}

interface DetailPageLayoutProps {
  content: DetailPageContent;
  accent: DetailPageAccent;
  languageNameKo: string;
  languageHref: string;
}

// 언어 페이지(/english 등)와 동일한 기존 Hero 이미지를 재사용한다. 새 이미지를
// 만들지 않고, 4개 카테고리 페이지가 언어별로 같은 이미지를 공유한다.
const HERO_IMAGE: Record<CurriculumLanguage, { src: string; alt: string }> = {
  english: { src: "/images/language/english-hero.jpg", alt: "밝은 카페에서 대화를 나누는 두 사람" },
  japanese: { src: "/images/language/japanese-hero.jpg", alt: "일본 도쿄 아키하바라 거리의 밤 풍경" },
  chinese: { src: "/images/language/chinese-hero.jpg", alt: "중국어 서예가 담긴 책" },
};

// Wide Visual Break용 이미지. 각 언어 종합페이지의 CurriculumVisualBanner와
// 동일한 이미지를 재사용한다(새 이미지 다운로드 없음).
const VISUAL_BREAK_IMAGE: Record<CurriculumLanguage, { src: string; alt: string }> = {
  english: { src: "/images/language/english-online-learning.jpg", alt: "노트북으로 함께 공부하는 모습" },
  japanese: { src: "/images/language/japanese-business.jpg", alt: "회의실에서 발표하는 모습" },
  chinese: { src: "/images/language/chinese-study.jpg", alt: "책과 노트로 공부하는 책상" },
};

const VISUAL_BREAK_EYEBROW: Record<DetailCategory, string> = {
  conversation: "REAL CONVERSATION",
  certification: "EXAM READY",
  school: "SCHOOL MANAGEMENT",
  other: "YOUR PURPOSE",
};

const CLASS_TEXT_BRAND = "전문 코치와 1:1로 진행되는 온라인 화상 수업입니다.";

// 12개 세부 과정 페이지가 공유하는 유일한 레이아웃. 본문 문구는 모두
// data/detailPages에서 오고 글자 수/내용은 그대로 유지한다 — 이 컴포넌트는
// 같은 데이터를 "제목 → 본문 → 제목 → 본문"으로 세로 나열하던 방식 대신,
// Hero → Direct Answer → Key Summary → Roadmap/Exam/Purpose 비주얼 →
// 본문(교차 배경 2-column) → Wide Visual Break → FAQ → Related → CTA 순서의
// Landing Page 구조로 재구성한다.
export default function DetailPageLayout({ content, accent, languageNameKo, languageHref }: DetailPageLayoutProps) {
  const otherCategories = COURSE_CATEGORIES.filter((category) => category.id !== content.category);
  const categoryMeta = COURSE_CATEGORIES.find((category) => category.id === content.category)!;
  const heroImage = HERO_IMAGE[content.language];
  const breakImage = VISUAL_BREAK_IMAGE[content.language];

  const heroChips = ["온라인 화상 수업", categoryMeta.label, "1:1 맞춤 수업"];

  // Key Summary 컬럼 1: 실제 sections 중 bullets가 있는 첫 Section(대부분
  // "이런 분에게 필요한 과정입니다")을 재사용한다. bullets가 없는 페이지(기타
  // 과정 등)는 section heading 목록으로 대체한다 — 둘 다 이미 존재하는 데이터다.
  const audienceSection = content.sections.find((section) => section.bullets && section.bullets.length > 0);
  const audienceItems = audienceSection
    ? audienceSection.bullets!.slice(0, 4)
    : content.sections.slice(0, 4).map((section) => section.heading);

  const summaryColumns: KeySummaryColumn[] = [
    { label: "이런 분에게 도움이 됩니다", variant: "bullets", items: audienceItems },
    {
      label: "실제 커리큘럼 기반",
      variant: "chips",
      items: getLinkedCurriculumLabels(content.linkedCurriculumIds).slice(0, 4),
    },
    { label: "수업 방식", variant: "text", items: [CLASS_TEXT_BRAND] },
  ];

  const breakIndex = content.sections.length >= 2 ? Math.floor(content.sections.length / 2) : -1;

  return (
    <article className="bg-surface">
      <DetailHero
        eyebrow={content.eyebrow}
        h1={content.h1}
        breadcrumbItems={[
          { label: "홈", href: "/" },
          { label: languageNameKo, href: languageHref },
          { label: content.breadcrumbLabel },
        ]}
        language={content.language}
        imageSrc={heroImage.src}
        imageAlt={heroImage.alt}
        chips={heroChips}
        accentTintClass={accent.tint}
      />

      <div className="bg-surface py-10 sm:py-12">
        <div className="section-shell">
          <Reveal>
            <DirectAnswer
              question={content.directAnswer.question}
              answer={content.directAnswer.answer}
              accentTintClass={accent.tint}
              accentBarClass={accent.solid}
            />
          </Reveal>

          <Reveal delay={80} className="mt-6">
            <KeySummaryPanel columns={summaryColumns} accentTintClass={accent.tint} />
          </Reveal>
        </div>
      </div>

      {content.category === "conversation" && (
        <ConversationRoadmap language={content.language} accent={accent} categoryLabel={categoryMeta.label} description={categoryMeta.description} />
      )}
      {content.category === "school" && (
        <SchoolRoadmap language={content.language} accent={accent} categoryLabel={categoryMeta.label} description={categoryMeta.description} />
      )}
      {content.category === "certification" && (
        <CertificationRoadmap language={content.language} accent={accent} categoryLabel={categoryMeta.label} description={categoryMeta.description} />
      )}
      {content.category === "other" && (
        <OtherRoadmap language={content.language} accent={accent} categoryLabel={categoryMeta.label} description={categoryMeta.description} />
      )}

      <div className="bg-surface py-10 sm:py-12">
        <div className="section-shell space-y-3">
          {content.intro.map((paragraph) => (
            <p key={paragraph} className="text-pretty text-[15px] leading-relaxed text-ink-soft">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {content.sections.map((section, index) => (
        <Fragment key={section.heading}>
          <DetailSection {...section} index={index} accentTextClass={accent.text} />
          {index === breakIndex && (
            <CurriculumVisualBanner
              imageSrc={breakImage.src}
              imageAlt={breakImage.alt}
              eyebrow={VISUAL_BREAK_EYEBROW[content.category]}
              copy={categoryMeta.description}
            />
          )}
        </Fragment>
      ))}

      {content.examWalkthrough && (
        <div className="bg-surface py-10 sm:py-12">
          <div className="section-shell">
            <ExamWalkthroughSection items={content.examWalkthrough} />
          </div>
        </div>
      )}

      <div className="bg-surface-soft py-14 sm:py-16">
        <div className="section-shell space-y-10">
          <CurriculumChips ids={content.linkedCurriculumIds} tintClass={accent.tint} />
          <DetailReviews ids={content.reviewIds} />
          <Reveal>
            <DetailFAQ items={content.faq} />
          </Reveal>
        </div>
      </div>

      <div className="bg-surface py-10 sm:py-12">
        <div className="section-shell">
          <Reveal>
            <RelatedLinks
              title={`다른 ${languageNameKo} 과정도 확인해보세요`}
              accentTextClass={accent.text}
              links={[
                ...otherCategories.map((category) => ({
                  label: category.label,
                  href: `${languageHref}/${category.sectionId}`,
                  description: category.description,
                })),
                { label: `${languageNameKo} 전체 과정 보기`, href: languageHref },
              ]}
            />
          </Reveal>
        </div>
      </div>

      <Reveal>
        <DetailCTABand
          lines={["어떤 과정이 맞을지", "고민된다면"]}
          subtitle="현재 수준과 목표에 맞는 과정을 함께 확인해보세요."
          href={`${languageHref}#consultation`}
        />
      </Reveal>
    </article>
  );
}

interface RoadmapBlockProps {
  language: CurriculumLanguage;
  accent: DetailPageAccent;
  categoryLabel: string;
  description: string;
}

function ConversationRoadmap({ language, accent, description }: RoadmapBlockProps) {
  const roadmap = getConversationRoadmap(language);
  return (
    <DetailRoadmapBlock eyebrow="DORAN LEARNING ROADMAP" title={roadmap.title} description={description}>
      <RoadmapTimeline stages={roadmap.stages} dotClass={accent.solid} accentTextClass={accent.text} badgeTintClass={accent.tint} />
    </DetailRoadmapBlock>
  );
}

function SchoolRoadmap({ language, accent, description }: RoadmapBlockProps) {
  const roadmap = getSchoolRoadmap(language);
  return (
    <DetailRoadmapBlock eyebrow="DORAN LEARNING ROADMAP" title={roadmap.title} description={description}>
      <RoadmapTimeline stages={roadmap.stages} dotClass={accent.solid} accentTextClass={accent.text} badgeTintClass={accent.tint} />
    </DetailRoadmapBlock>
  );
}

function CertificationRoadmap({ language, accent, categoryLabel, description }: RoadmapBlockProps) {
  const roadmaps = getCertificationRoadmaps(language);
  return (
    <DetailRoadmapBlock eyebrow="DORAN LEARNING ROADMAP" title={categoryLabel} description={description}>
      <CertificationExplorer
        roadmaps={roadmaps}
        activeTabClass={accent.solid}
        dotClass={accent.solid}
        accentTextClass={accent.text}
        badgeTintClass={accent.tint}
      />
    </DetailRoadmapBlock>
  );
}

function OtherRoadmap({ language, accent, description }: RoadmapBlockProps) {
  const group = getOtherCourseGroup(language);
  return (
    <DetailRoadmapBlock eyebrow="목적별 과정" title="어떤 목적에 가까우신가요" description={description}>
      <OtherPurposeGrid group={group} chipTintClass={accent.tint} />
    </DetailRoadmapBlock>
  );
}

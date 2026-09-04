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
import ProcessSection from "@/components/ProcessSection";
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

interface DetailImage {
  src: string;
  alt: string;
}

interface DetailImageSet {
  hero: DetailImage;
  mid: DetailImage;
}

// 12개 상세페이지 각각에 고유한 상단(hero)/중간(mid) 이미지를 지정한다.
// 언어 하나당 이미지를 돌려쓰던 이전 방식에서 "카테고리별로 다른 이미지"로
// 바꿔, 같은 언어 안에서도 회화/자격증/내신/기타 페이지가 시각적으로
// 구분되게 한다. 실제 파일은 public/images/detail/<language>/<category>/
// {hero,mid}.jpg. 출처는 data/media/imageCredits.ts에서 관리한다.
const DETAIL_IMAGES: Record<CurriculumLanguage, Record<DetailCategory, DetailImageSet>> = {
  english: {
    conversation: {
      hero: { src: "/images/detail/english/conversation/hero.jpg", alt: "노트북으로 화상통화하며 웃으며 대화하는 여성" },
      mid: { src: "/images/detail/english/conversation/mid.jpg", alt: "책상에서 노트북 화상통화로 대화하는 여성" },
    },
    certification: {
      hero: { src: "/images/detail/english/certification/hero.jpg", alt: "듀얼 모니터 앞에서 헤드폰을 쓰고 집중해서 영어 시험을 준비하는 모습" },
      mid: { src: "/images/detail/english/certification/mid.jpg", alt: "빈 노트와 펜이 놓인 시험 준비 책상" },
    },
    school: {
      hero: { src: "/images/detail/english/school/hero.jpg", alt: "노트를 옆에 두고 혼자 집중해서 영어 내신을 공부하는 모습" },
      mid: { src: "/images/detail/english/school/mid.jpg", alt: "노트와 연필, 안경이 놓인 깔끔한 학습 책상" },
    },
    other: {
      hero: { src: "/images/detail/english/other/hero.jpg", alt: "테이블 너머로 악수하는 두 사람" },
      mid: { src: "/images/detail/english/other/mid.jpg", alt: "책상에서 노트북으로 타이핑하는 모습" },
    },
  },
  japanese: {
    conversation: {
      hero: { src: "/images/detail/japanese/conversation/hero.jpg", alt: "아키하바라풍 네온 거리의 밤 풍경" },
      mid: { src: "/images/detail/japanese/conversation/mid.jpg", alt: "노트북으로 집중해서 학습하는 모습" },
    },
    certification: {
      hero: { src: "/images/detail/japanese/certification/hero.jpg", alt: "헤드폰을 쓰고 집중해서 학습하는 모습" },
      mid: { src: "/images/detail/japanese/certification/mid.jpg", alt: "노트에 펜으로 필기하는 손" },
    },
    school: {
      hero: { src: "/images/detail/japanese/school/hero.jpg", alt: "책상에서 집중해서 필기하며 공부하는 모습" },
      mid: { src: "/images/detail/japanese/school/mid.jpg", alt: "펼쳐진 노트와 펜들이 놓인 책상" },
    },
    other: {
      hero: { src: "/images/detail/japanese/other/hero.jpg", alt: "혼자 집중해서 노트북으로 업무·자료를 준비하는 모습" },
      mid: { src: "/images/detail/japanese/other/mid.jpg", alt: "책·노트북·헤드폰이 놓인 미니멀한 워크스페이스" },
    },
  },
  chinese: {
    conversation: {
      hero: { src: "/images/detail/chinese/conversation/hero.jpg", alt: "노트북 화상통화 중 인사하며 손을 흔드는 모습" },
      mid: { src: "/images/detail/chinese/conversation/mid.jpg", alt: "헤드폰을 쓰고 노트북으로 학습하는 모습" },
    },
    certification: {
      hero: { src: "/images/detail/chinese/certification/hero.jpg", alt: "헤드폰을 쓰고 집중해서 학습하는 모습" },
      mid: { src: "/images/detail/chinese/certification/mid.jpg", alt: "중국어 글씨가 쓰인 종이" },
    },
    school: {
      hero: { src: "/images/detail/chinese/school/hero.jpg", alt: "교복 차림의 학생이 혼자 책상에서 책을 보며 중국어 내신을 공부하는 모습" },
      mid: { src: "/images/detail/chinese/school/mid.jpg", alt: "펼쳐진 빈 노트와 펜·연필이 놓인 책상" },
    },
    other: {
      hero: { src: "/images/detail/chinese/other/hero.jpg", alt: "책상 너머로 악수하는 두 사람" },
      mid: { src: "/images/detail/chinese/other/mid.jpg", alt: "노트북 키보드로 실무를 준비하는 모습" },
    },
  },
};

const VISUAL_BREAK_EYEBROW: Record<DetailCategory, string> = {
  conversation: "REAL CONVERSATION",
  certification: "EXAM READY",
  school: "SCHOOL MANAGEMENT",
  other: "YOUR PURPOSE",
};

const CLASS_TEXT_BRAND = "전문 코치와 1:1로 진행되는 온라인 화상 수업입니다.";

// "시작 방법" compact process. 언어 종합페이지의 ProcessSection(수준 확인→
// 목표 설정→코치 매칭→수업→피드백)과 같은 실제 흐름을, 상세페이지에서는
// 4단계로 축약해 상담→매칭→수업→점검 흐름만 보여준다. 카테고리와 무관하게
// 동일한 실제 절차이므로 언어/카테고리별로 다시 만들지 않는다.
const START_STEPS = [
  { title: "상담 신청", description: "학습 목표와 현재 수준을 먼저 확인합니다." },
  { title: "코치 매칭", description: "목표와 수준에 맞는 전문 코치를 연결합니다." },
  { title: "1:1 온라인 수업", description: "화상으로 맞춤 커리큘럼 수업을 진행합니다." },
  { title: "정기 점검·피드백", description: "정기 상담으로 학습 상황을 점검합니다." },
];

// 12개 세부 과정 페이지가 공유하는 유일한 레이아웃. 본문 문구는 모두
// data/detailPages에서 오고 글자 수/내용은 그대로 유지한다 — 이 컴포넌트는
// 같은 데이터를 "제목 → 본문 → 제목 → 본문"으로 세로 나열하던 방식 대신,
// Hero → Direct Answer → Key Summary → Roadmap/Exam/Purpose 비주얼 →
// 본문(교차 배경 2-column) → Wide Visual Break → FAQ → Related → CTA 순서의
// Landing Page 구조로 재구성한다.
export default function DetailPageLayout({ content, accent, languageNameKo, languageHref }: DetailPageLayoutProps) {
  const otherCategories = COURSE_CATEGORIES.filter((category) => category.id !== content.category);
  const categoryMeta = COURSE_CATEGORIES.find((category) => category.id === content.category)!;
  const images = DETAIL_IMAGES[content.language][content.category];
  const heroImage = images.hero;
  const breakImage = images.mid;

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

      <ProcessSection eyebrow="HOW TO START" title={["이렇게 시작합니다"]} steps={START_STEPS} background="soft" />

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

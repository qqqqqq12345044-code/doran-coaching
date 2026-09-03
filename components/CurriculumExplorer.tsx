import Link from "next/link";
import { ArrowRight, MessagesSquare, Award, GraduationCap, LifeBuoy, type LucideIcon } from "lucide-react";
import Reveal from "@/components/Reveal";
import RoadmapTimeline from "@/components/curriculum/RoadmapTimeline";
import CertificationExplorer from "@/components/curriculum/CertificationExplorer";
import OtherPurposeGrid from "@/components/curriculum/OtherPurposeGrid";
import type { CurriculumLanguage } from "@/data/curriculum/powerCurriculum";
import {
  getConversationRoadmap,
  getSchoolRoadmap,
  getCertificationRoadmaps,
  getOtherCourseGroup,
} from "@/data/curriculum/courseDetails";
import { COURSE_CATEGORIES, type CourseCategoryId } from "@/data/navigation/languageNavigation";

interface CurriculumExplorerAccent {
  /** STEP 배지 / 활성 탭 배경. 예: "bg-english text-white" */
  solid: string;
  /** 체크 아이콘 등 포인트 텍스트 색상. 예: "text-english" */
  text: string;
  /** Chip/보조 배지 배경+텍스트. 예: "bg-english-tint text-english-dark" */
  tint: string;
  /** Category 아이콘 배경+텍스트. 예: "bg-english-tint text-english" */
  iconTint: string;
}

interface CurriculumExplorerProps {
  language: CurriculumLanguage;
  languageLabel: string;
  accent: CurriculumExplorerAccent;
}

const CATEGORY_ICONS: Record<CourseCategoryId, LucideIcon> = {
  conversation: MessagesSquare,
  certification: Award,
  school: GraduationCap,
  other: LifeBuoy,
};

const CERTIFICATION_INTRO: Record<CurriculumLanguage, string> = {
  english:
    "TOEIC, OPIc, IELTS, Duolingo — 목적이 다른 시험은 대비 방법도 다릅니다. 시험을 선택하면 그에 맞는 학습 로드맵을 볼 수 있습니다.",
  japanese: "JLPT, JPT — 같은 일본어 시험이라도 준비 방향이 다릅니다. 시험을 선택하면 그에 맞는 학습 로드맵을 볼 수 있습니다.",
  chinese:
    "HSK, HSKK, TSC, BCT — 같은 중국어 시험이라도 평가하는 능력이 다릅니다. 시험을 선택하면 그에 맞는 학습 로드맵을 볼 수 있습니다.",
};

function PowerCurriculumBadge({ languageLabel, tintClass }: { languageLabel: string; tintClass: string }) {
  return (
    <p className="mt-3 max-w-2xl text-[12px] leading-relaxed text-ink-faint">
      <span className={`mr-2 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide ${tintClass}`}>
        POWER CURRICULUM
      </span>
      실제 파워 {languageLabel} 과정에 기반해 현재 수준과 학습 목표에 맞춰 수업을 구성합니다.
    </p>
  );
}

function SectionHeader({
  categoryId,
  eyebrow,
  description,
  iconTintClass,
}: {
  categoryId: CourseCategoryId;
  eyebrow: string;
  description: string;
  iconTintClass: string;
}) {
  const category = COURSE_CATEGORIES.find((item) => item.id === categoryId)!;
  const Icon = CATEGORY_ICONS[categoryId];
  return (
    <Reveal className="max-w-2xl">
      <div className="flex items-center gap-2.5">
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconTintClass}`}>
          <Icon size={15} aria-hidden />
        </span>
        <p className="eyebrow">{eyebrow}</p>
      </div>
      <h2 className="mt-2 text-balance text-[26px] font-bold leading-snug text-ink md:text-[32px]">{category.label}</h2>
      <p className="mt-3 text-pretty text-[14px] leading-relaxed text-ink-soft md:text-[15px]">{description}</p>
    </Reveal>
  );
}

// 언어 상세 페이지의 "회화/자격증/내신/기타" 4개 영역을 카드 나열이 아니라
// 단계별 학습 로드맵(Curriculum Explorer)으로 보여준다. 각 영역은 그 자체로
// 하나의 작은 Landing Section(eyebrow → 제목 → 설명 → 로드맵 → CTA)이며,
// Header Mega Menu/StickySubNav가 이동하는 #conversation 등 기존 앵커 id를
// 그대로 유지한다.
export default function CurriculumExplorer({ language, languageLabel, accent }: CurriculumExplorerProps) {
  const conversation = getConversationRoadmap(language);
  const school = getSchoolRoadmap(language);
  const certifications = getCertificationRoadmaps(language);
  const other = getOtherCourseGroup(language);

  return (
    <>
      <section id="conversation" className="pb-20 pt-7 md:pb-28 md:pt-9 bg-surface">
        <div className="section-shell">
          <SectionHeader
            categoryId="conversation"
            eyebrow="CURRICULUM EXPLORER · 회화 로드맵"
            description={conversation.description}
            iconTintClass={accent.iconTint}
          />
          <PowerCurriculumBadge languageLabel={languageLabel} tintClass={accent.tint} />

          <Reveal delay={80}>
            <RoadmapTimeline
              stages={conversation.stages}
              dotClass={accent.solid}
              accentTextClass={accent.text}
              badgeTintClass={accent.tint}
            />
          </Reveal>

          <Link href="#consultation" className="btn-secondary mt-8 gap-2">
            상담하기
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </section>

      <section id="certification" className="pb-20 pt-7 md:pb-28 md:pt-9 bg-surface-soft">
        <div className="section-shell">
          <SectionHeader
            categoryId="certification"
            eyebrow="CURRICULUM EXPLORER · 자격증 로드맵"
            description={CERTIFICATION_INTRO[language]}
            iconTintClass={accent.iconTint}
          />
          <PowerCurriculumBadge languageLabel={languageLabel} tintClass={accent.tint} />

          <Reveal delay={80}>
            <div className="mt-8">
              <CertificationExplorer
                roadmaps={certifications}
                activeTabClass={accent.solid}
                dotClass={accent.solid}
                accentTextClass={accent.text}
                badgeTintClass={accent.tint}
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section id="school" className="pb-20 pt-7 md:pb-28 md:pt-9 bg-surface">
        <div className="section-shell">
          <SectionHeader
            categoryId="school"
            eyebrow="CURRICULUM EXPLORER · 내신 관리 로드맵"
            description={school.description}
            iconTintClass={accent.iconTint}
          />
          <PowerCurriculumBadge languageLabel={languageLabel} tintClass={accent.tint} />

          <Reveal delay={80}>
            <RoadmapTimeline
              stages={school.stages}
              dotClass={accent.solid}
              accentTextClass={accent.text}
              badgeTintClass={accent.tint}
            />
          </Reveal>

          <Link href="#consultation" className="btn-secondary mt-8 gap-2">
            상담하기
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </section>

      <section id="other" className="pb-20 pt-7 md:pb-28 md:pt-9 bg-surface-soft">
        <div className="section-shell">
          <SectionHeader
            categoryId="other"
            eyebrow="CURRICULUM EXPLORER · 목적별 수업 안내"
            description={other.description}
            iconTintClass={accent.iconTint}
          />

          <Reveal delay={80} className="mt-8">
            <OtherPurposeGrid group={other} chipTintClass={accent.tint} />
          </Reveal>
        </div>
      </section>
    </>
  );
}

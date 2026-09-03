import type { LanguageSlug } from "../../data/languages";
import type { SeoKeywordCluster } from "../../data/seo/keywords";
import { getIntentBlueprint, type IntentBlueprint } from "../../data/seo/contentBlueprints.ts";
import { getExamProfileForCluster, type ExamContentProfile } from "../../data/seo/examProfiles.ts";
import {
  getCurriculumByLanguage,
  type PowerCurriculumItem,
} from "../../data/curriculum/powerCurriculum.ts";
import { serviceFacts } from "../../data/seo/serviceFacts.ts";

// "지역 x Keyword Cluster" 조합 하나에 대해 SEO/AEO/GEO 원칙을 반영한 페이지
// 콘텐츠를 만드는 Content Engine.
//
// - SEO: 지역명 + mainKeyword를 Title/H1/첫 문단/FAQ 일부/마지막 CTA 에서만
//   자연스럽게 사용하고, 본문 대부분은 실제 서비스 정보로 채운다.
// - AEO: directAnswer 가 검색 질문에 2문장으로 바로 답한다.
// - GEO: 한 문장에 하나의 사실만 담고, service Facts 기반으로만 서술하며
//   과장 표현이나 근거 없는 수치를 만들지 않는다.
//
// 이 파일은 전국 페이지를 생성하지 않는다. 순수 함수만 제공한다.

export interface TargetRegion {
  sido: string;
  sigungu: string | null;
  regionName: string;
}

export interface LocalSeoContent {
  directAnswer: string;
  hero: {
    eyebrow?: string;
    h1: string;
    description: string;
  };
  serviceSummary: {
    heading: string;
    body: string;
  };
  recommendedFor: string[];
  benefits: { title: string; description: string }[];
  curriculum: {
    heading: string;
    description?: string;
    topics: string[];
    /** 실제로 선택된 data/curriculum/powerCurriculum.ts 항목의 id. 검증용. */
    relatedItemIds: string[];
  };
  process: { title: string; description: string }[];
  faq: { question: string; answer: string }[];
  finalCta: { heading: string; description: string };
}

export interface LocalSeoContentResult {
  region: TargetRegion;
  clusterId: string;
  language: LanguageSlug;
  searchPhrase: string;
  content: LocalSeoContent;
  metadata: { title: string; description: string };
}

const LANGUAGE_NAME: Record<LanguageSlug, string> = {
  english: "영어",
  japanese: "일본어",
  chinese: "중국어",
};

function fill(template: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce(
    (text, [key, value]) => text.split(`{${key}}`).join(value),
    template
  );
}

// 오프라인 지점이 있는 것처럼 오해되지 않는, 화상 서비스에 맞는 지역 표현.
function regionAvailabilityPhrase(regionName: string): string {
  return `${regionName}에서도 이용할 수 있는`;
}

function regionNoTravelPhrase(regionName: string): string {
  return `${regionName}에서 이동 없이 시작하는`;
}

// 한글 받침 유무에 따라 조사(과/와, 을/를 등)를 올바르게 붙이기 위한 유틸.
// mainKeyword/focusThemes 처럼 동적으로 조합되는 단어에는 조사를 하드코딩하지 않는다.
function particle(word: string, withBatchim: string, withoutBatchim: string): string {
  const lastChar = word.trim().slice(-1);
  const code = lastChar.charCodeAt(0);
  const isHangulSyllable = code >= 0xac00 && code <= 0xd7a3;
  const hasBatchim = isHangulSyllable && (code - 0xac00) % 28 !== 0;
  return hasBatchim ? withBatchim : withoutBatchim;
}

/** "a와 b를"처럼 두 단어를 자연스럽게 연결한다(마지막 단어에는 목적격 조사). */
function conjoinWithObjectParticle(words: string[]): string {
  if (words.length === 0) return "";
  if (words.length === 1) {
    return `${words[0]}${particle(words[0], "을", "를")}`;
  }
  const [first, ...rest] = words;
  const last = rest[rest.length - 1];
  const middle = rest.slice(0, -1).map((w) => `${w}${particle(w, "과", "와")} `).join("");
  return `${first}${particle(first, "과", "와")} ${middle}${last}${particle(last, "을", "를")}`;
}

// exam Intent 전용 Direct Answer. contentBlueprints.ts 의 공용 exam 문장을
// 그대로 재사용하지 않고, 시험별 Profile(examName/courseNoun/levelVocabulary/
// goalVocabulary)로 구조 자체가 다른 문장을 만든다("시험명만 바뀐 콘텐츠"가
// 되지 않도록 하는 핵심 지점).
function buildExamDirectAnswer(profile: ExamContentProfile, regionName: string): string {
  return (
    `${serviceFacts.brandNameKo}은 ${regionName}에서도 ${profile.examName} 대비 ${profile.courseNoun}` +
    `${particle(profile.courseNoun, "을", "를")} 1:1 온라인 화상으로 이용할 수 있습니다. ` +
    `현재 ${profile.levelVocabulary}${particle(profile.levelVocabulary, "과", "와")} ${profile.goalVocabulary}에 맞춰 ` +
    `${profile.examName} 준비 과정과 강사를 상담할 수 있습니다.`
  );
}

// ---------------------------------------------------------------------------
// Curriculum 연관도 선택 (섹션 10) — linkedClusterIds 정식 연결을 최우선으로 하고,
// Intent별 curriculumKeywords 로 normalizedTopics/sourceTitle을 대조해 보조
// 신호로 사용한다. 무관한 과정을 억지로 채우지 않는다.
// ---------------------------------------------------------------------------

function scoreCurriculumItem(
  item: PowerCurriculumItem,
  cluster: SeoKeywordCluster,
  blueprint: IntentBlueprint
): number {
  let score = 0;
  if (item.linkedClusterIds.includes(cluster.id)) score += 100;
  const haystack = [...item.normalizedTopics, item.sourceTitle].join(" ");
  for (const keyword of blueprint.curriculumKeywords) {
    if (haystack.includes(keyword)) score += 10;
  }
  return score;
}

// 하나의 Curriculum 항목이 "여러" Cluster에 formal 연결된 경우에만(예: "토익,
// 오픽 전문 수업"이 english-toeic과 english-opic 모두에 연결) 적용한다.
// normalizedTopics의 첫 항목을 무조건 쓰면 관련 없는 시험명이 표시될 수 있다
// (OPIc 페이지에 "토익" 칩만 뜨는 문제) — 현재 Cluster의 mainKeyword와 겹치는
// topic을 우선 선택한다. 단일 Cluster에만 연결된 항목(대부분의 경우)은 기존과
// 동일하게 topics[0]을 그대로 쓴다(기존 결과에 영향 없음).
function pickDisplayTopic(item: PowerCurriculumItem, cluster: SeoKeywordCluster): string {
  if (item.linkedClusterIds.length > 1) {
    const preferred = item.normalizedTopics.find(
      (topic) => cluster.mainKeyword.includes(topic) || topic.includes(cluster.mainKeyword)
    );
    if (preferred) return preferred;
  }
  return item.normalizedTopics[0];
}

export function getRelatedCurriculum(
  cluster: SeoKeywordCluster,
  maxItems = 8
): PowerCurriculumItem[] {
  const blueprint = getIntentBlueprint(cluster.intent);
  return getCurriculumByLanguage(cluster.language)
    .map((item) => ({ item, score: scoreCurriculumItem(item, cluster, blueprint) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxItems)
    .map((entry) => entry.item);
}

// ---------------------------------------------------------------------------
// 메인 생성 함수
// ---------------------------------------------------------------------------

export function generateLocalSeoContent(
  region: TargetRegion,
  cluster: SeoKeywordCluster
): LocalSeoContentResult {
  const blueprint = getIntentBlueprint(cluster.intent);
  // exam Intent는 시험별 Profile이 있으면 그 문구를 우선 사용한다. Profile이
  // 없는 exam Cluster(향후 확장)나 다른 Intent는 기존 공용 Blueprint로
  // 자연스럽게 fallback한다 — intent="exam" 구조 자체는 그대로 유지된다.
  const examProfile = cluster.intent === "exam" ? getExamProfileForCluster(cluster.id) : null;
  const langName = LANGUAGE_NAME[cluster.language];
  const searchPhrase = `${region.regionName} ${cluster.mainKeyword}`;

  const vars = { 지역명: region.regionName, 언어: langName, mainKeyword: cluster.mainKeyword };

  const instructorDescriptor = examProfile?.instructorDescriptor ?? blueprint.instructorDescriptor;
  const goalPhrase = examProfile?.goalVocabulary ?? blueprint.goalPhrase;
  const focusThemes = examProfile?.focusThemes ?? blueprint.focusThemes;

  // --- AEO Direct Answer (2문장) ---
  const directAnswer = examProfile
    ? buildExamDirectAnswer(examProfile, region.regionName)
    : `${serviceFacts.brandNameKo}은 ${regionAvailabilityPhrase(region.regionName)} ` +
      `1:1 화상 ${cluster.mainKeyword} 수업입니다. ` +
      `${instructorDescriptor}와 온라인으로 수업하며, 현재 수준과 ${goalPhrase}에 맞춰 ` +
      `과정과 강사를 상담할 수 있습니다.`;

  // --- Hero ---
  const hero = {
    eyebrow: `DORAN ${langName} · ${region.regionName}`,
    h1: `${searchPhrase},\n${blueprint.h1Subline}`,
    description:
      `${regionNoTravelPhrase(region.regionName)} ${langName} 1:1 화상수업입니다. ` +
      `${conjoinWithObjectParticle(focusThemes.slice(0, 2))} 중심으로, 현재 수준에 맞춰 진행됩니다.`,
  };

  // --- Service Summary (GEO: 사실 위주 짧은 문장들) ---
  const serviceSummary = {
    heading: `${cluster.mainKeyword}는 이렇게 진행됩니다`,
    body:
      `${serviceFacts.brandNameKo}은 ${serviceFacts.supportedLanguages.join("·")} ${serviceFacts.classFormat} ${serviceFacts.deliveryMethod}을 제공합니다. ` +
      `${serviceFacts.matchingMethod}합니다. ` +
      `${instructorDescriptor}와 함께 목표에 맞는 과정을 선택할 수 있습니다.`,
  };

  // --- Recommended For ---
  const recommendedFor = examProfile
    ? examProfile.audiencePoints
    : blueprint.audiencePoints.map((point) => fill(point, vars));

  // --- Benefits ---
  // exam Profile이 있으면 시험별로 직접 작성한 Benefit을 그대로 쓴다(Generic
  // "시험 대비/목표 급수/자격증" 문구가 시험 간 그대로 겹치는 문제의 해결 지점).
  // 없으면 기존처럼 focusThemes 기반 템플릿 문장을 생성한다.
  const benefitSentenceTemplates = [
    (theme: string) => `${theme}에 집중할 수 있도록 수업을 구성합니다.`,
    (theme: string) => `수업 시간 대부분을 ${theme}에 사용합니다.`,
    (theme: string) => `${theme}${particle(theme, "을", "를")} 목표로 커리큘럼을 조정합니다.`,
    (theme: string) => `강사와 함께 ${theme}${particle(theme, "을", "를")} 꾸준히 연습합니다.`,
  ];
  const benefits = examProfile
    ? examProfile.benefits
    : focusThemes.slice(0, 4).map((theme, index) => ({
        title: theme,
        description: benefitSentenceTemplates[index % benefitSentenceTemplates.length](theme),
      }));

  // --- Curriculum ---
  const relatedCurriculum = getRelatedCurriculum(cluster);
  const curriculumTopics = [...new Set(relatedCurriculum.map((item) => pickDisplayTopic(item, cluster)))];
  const curriculum = {
    heading: `${cluster.mainKeyword}${particle(cluster.mainKeyword, "과", "와")} 연결된 학습 주제`,
    description:
      relatedCurriculum.length > 0
        ? undefined
        : "현재 이 검색 의도와 직접 연결된 세부 과정 자료가 준비되지 않았습니다.",
    topics: curriculumTopics,
    relatedItemIds: relatedCurriculum.map((item) => item.id),
  };

  // --- Process (동일한 실제 진행 절차. Intent에 따라 억지로 바꾸지 않는다) ---
  const process = [
    { title: "상담 신청", description: "학습 목표와 현재 상황을 간단히 남깁니다." },
    { title: "수준 및 목표 확인", description: "상담을 통해 현재 수준과 목표를 확인합니다." },
    { title: "강사 매칭", description: `${instructorDescriptor} 중 목표에 맞는 강사를 매칭합니다.` },
    { title: "1:1 화상수업 시작", description: "온라인 화상으로 1:1 수업을 시작합니다." },
    { title: "학습 관리", description: "수업 진행 상황에 맞춰 학습을 관리합니다." },
  ];

  // --- FAQ (Intent/시험 Profile별 질문을 그대로 사용, 지역/언어/키워드만 치환) ---
  const qaTemplates = examProfile ? examProfile.qaTemplates : blueprint.qaTemplates;
  const faq = qaTemplates.slice(0, 6).map(({ question, answer }) => ({
    question: fill(question, vars),
    answer: fill(answer, vars),
  }));

  // --- Final CTA ---
  const finalCta = {
    heading: `${cluster.mainKeyword},\n이제 직접 시작해보세요.`,
    description: `${regionNoTravelPhrase(region.regionName)} 1:1 화상수업을 상담을 통해 시작할 수 있습니다.`,
  };

  // --- Metadata ---
  const metadataTitle = fill(blueprint.titleTemplate, vars);
  const metadataDescription =
    `${searchPhrase}를 찾고 있다면 ${serviceFacts.brandNameKo}의 1:1 화상수업으로 시작해보세요. ` +
    `${instructorDescriptor}와 함께 ${goalPhrase}에 맞춰 과정을 상담할 수 있습니다.`;

  return {
    region,
    clusterId: cluster.id,
    language: cluster.language,
    searchPhrase,
    content: {
      directAnswer,
      hero,
      serviceSummary,
      recommendedFor,
      benefits,
      curriculum,
      process,
      faq,
      finalCta,
    },
    metadata: {
      title: metadataTitle,
      description: metadataDescription,
    },
  };
}

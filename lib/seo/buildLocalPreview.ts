import type { LanguageSlug } from "@/data/languages";
import type { SeoIntent, SeoKeywordCluster } from "@/data/seo/keywords";

// (지역 x Keyword Cluster) 하나를 실제 SeoLocalPreview 객체로 계산하는 순수
// 함수. scripts/preview-seo-combinations.mts(사람이 검토용으로 미리보기 파일을
// 만들 때)와 data/seo/previewRegistry.ts(실제 페이지 렌더링 시 화이트리스트
// 조합을 그 자리에서 계산할 때)가 **같은 로직**을 공유하기 위해 분리했다.
//
// 전국 규모(3천+ 지역 x 6 키워드)로 확장하면서, 지역마다 별도 *.json Preview
// 파일을 수천 개 만들어 정적 import하던 기존 방식은 git/번들 관리에 비효율적
// 이라 판단해 이 계산 로직만 공유하고 파일은 만들지 않는 방식으로 바꿨다.
// (data/seo/previewRegistry.ts 상단 주석 참고 — 기존 서울 43개 지역의
// URL/canonical/title 산출 결과는 이 함수로 재계산해도 완전히 동일함을
// 빌드/검증으로 확인했다.)

export interface LocalPreviewRegion {
  sido: string;
  sigungu: string;
  legalDong: string;
  legalCode: string;
}

export interface SeoLocalPreview {
  region: LocalPreviewRegion;
  language: LanguageSlug;
  clusterId: string;
  mainKeyword: string;
  aliases: string[];
  searchPhrase: string;
  url: string;
  title: string;
  h1: string;
  pageType: string;
  intent: SeoIntent;
  needsReview: boolean;
  needsReviewReason?: string;
}

const LANGUAGE_NAME: Record<LanguageSlug, string> = {
  english: "영어",
  japanese: "일본어",
  chinese: "중국어",
};

// 전국 확장 시 발견된 문제: title/H1/description이 법정동 이름 하나만 쓰면
// "신교동", "효자동"처럼 서로 다른 시/군/구에 동일한 법정동 이름이 존재하는
// 경우(전국 3,633개 중 477개 이름이 2곳 이상에서 재사용됨) 완전히 동일한
// title/description/H1이 여러 페이지에 나오게 된다. 시/군/구까지 붙이면
// 3,625/3,633이 유일해지고, "중구/동구/북구"처럼 시/군/구 이름 자체가 서로
// 다른 광역시에도 존재하는 8개 잔여 케이스만 시/도 약칭까지 붙여 완전히
// 구분한다. dataset의 지역명 자체(법정동/시군구/시도 문자열)는 그대로
// 쓰고, 여기서는 "어디까지 붙여서 부를지"만 결정한다 — 임의 별칭이나 지역
// 특성 서술은 추가하지 않는다.
const AMBIGUOUS_SIGUNGU = new Set(["중구", "동구", "서구", "남구", "북구", "강서구"]);

const SHORT_SIDO_NAME: Record<string, string> = {
  서울특별시: "서울",
  부산광역시: "부산",
  대구광역시: "대구",
  인천광역시: "인천",
  대전광역시: "대전",
  울산광역시: "울산",
  세종특별자치시: "세종",
  경기도: "경기",
  충청북도: "충북",
  충청남도: "충남",
  경상북도: "경북",
  경상남도: "경남",
  제주특별자치도: "제주",
  강원특별자치도: "강원",
  전북특별자치도: "전북",
  전남광주통합특별시: "광주전남",
};

/** title/H1/본문에서 지역을 가리킬 때 쓸, 전국적으로 유일한 표기를 만든다. */
export function buildDisambiguatedRegionName(sido: string, sigungu: string, dong: string): string {
  if (AMBIGUOUS_SIGUNGU.has(sigungu)) {
    const shortSido = SHORT_SIDO_NAME[sido] ?? sido;
    return `${shortSido} ${sigungu} ${dong}`;
  }
  return `${sigungu} ${dong}`;
}

// 급수(등급) 체계 시험 vs 점수 체계 시험 vs 말하기 시험 — "exam" intent 안에서도
// 자연스러운 표현이 달라 clusterId 기준으로 세분화한다.
const GRADE_BASED_EXAMS = new Set(["japanese-jlpt", "chinese-hsk"]);
const SCORE_BASED_EXAMS = new Set(["english-opic", "english-toeic"]);
const SPEAKING_EXAMS = new Set(["chinese-hskk"]);

function buildTitle(cluster: SeoKeywordCluster, displayName: string): string {
  const lang = LANGUAGE_NAME[cluster.language];
  switch (cluster.intent) {
    case "conversation":
      return `${displayName} ${cluster.mainKeyword} | 1:1 화상 ${lang}수업 도란`;
    case "tutoring":
      return `${displayName} ${cluster.mainKeyword} | 1:1 맞춤 화상과외 도란`;
    case "online":
      return `${displayName} ${cluster.mainKeyword} | 화상으로 듣는 1:1 ${lang}수업 도란`;
    case "native":
      return `${displayName} ${cluster.mainKeyword} | 원어민 1:1 화상수업 도란`;
    case "beginner":
      return `${displayName} ${cluster.mainKeyword} | 왕초보를 위한 1:1 맞춤수업 도란`;
    case "adult":
      return `${displayName} ${cluster.mainKeyword} | 성인 눈높이 1:1 화상수업 도란`;
    case "worker":
      return `${displayName} ${cluster.mainKeyword} | 직장인 맞춤 1:1 화상수업 도란`;
    case "business":
      return `${displayName} ${cluster.mainKeyword} | 실무 중심 1:1 ${lang} 과외 도란`;
    case "exam":
      return `${displayName} ${cluster.mainKeyword} | 1:1 맞춤 시험대비 도란`;
    case "workingholiday":
      return `${displayName} ${cluster.mainKeyword} | 워킹홀리데이 준비 1:1 ${lang}수업 도란`;
    default:
      return `${displayName} ${cluster.mainKeyword} | 1:1 맞춤 화상수업 도란`;
  }
}

function buildH1(cluster: SeoKeywordCluster, displayName: string): string {
  const lang = LANGUAGE_NAME[cluster.language];
  let subline: string;
  switch (cluster.intent) {
    case "conversation":
      subline = "1:1 맞춤 화상수업";
      break;
    case "tutoring":
      subline = "1:1 맞춤 화상과외";
      break;
    case "online":
      subline = "화상으로 만나는 1:1 수업";
      break;
    case "native":
      subline = "대화 중심 1:1 화상수업";
      break;
    case "beginner":
      subline = "왕초보를 위한 1:1 맞춤수업";
      break;
    case "adult":
      subline = "성인 눈높이에 맞춘 1:1 수업";
      break;
    case "worker":
      subline = "퇴근 후 듣는 1:1 화상수업";
      break;
    case "business":
      subline = "실무 중심 1:1 비즈니스 수업";
      break;
    case "exam":
      if (GRADE_BASED_EXAMS.has(cluster.id)) {
        subline = `목표 급수에 맞춘 1:1 ${lang} 수업`;
      } else if (SCORE_BASED_EXAMS.has(cluster.id)) {
        subline = "목표 점수에 맞춘 1:1 수업";
      } else if (SPEAKING_EXAMS.has(cluster.id)) {
        subline = "말하기 시험 대비 1:1 회화 수업";
      } else {
        subline = "목표에 맞춘 1:1 시험대비 수업";
      }
      break;
    case "workingholiday":
      subline = `워킹홀리데이 준비 1:1 ${lang} 수업`;
      break;
    default:
      subline = "1:1 맞춤수업";
  }
  return `${displayName} ${cluster.mainKeyword},\n${subline}`;
}

// 사람이 보기에 검색어로 다소 어색할 수 있어 검토가 필요한 Cluster.
// (scripts/preview-seo-combinations.mts와 동일하게 현재는 비어 있음)
const NEEDS_REVIEW: Record<string, string> = {};

export function buildLocalPreview(region: LocalPreviewRegion, cluster: SeoKeywordCluster): SeoLocalPreview {
  // URL/canonical은 항상 법정동 단독 표기를 쓴다(route 구조 변경 금지 —
  // 기존 258개 공개 URL과 완전히 동일한 규칙 유지). title/H1/searchPhrase만
  // 전국 단위로 유일하도록 시/군/구(필요 시 시/도까지) 표기를 덧붙인다.
  const displayName = buildDisambiguatedRegionName(region.sido, region.sigungu, region.legalDong);
  const searchPhrase = `${displayName} ${cluster.mainKeyword}`;
  const url = `/local/${region.sido}/${region.sigungu}/${region.legalDong}/${cluster.mainKeyword}`;
  const needsReviewReason = NEEDS_REVIEW[cluster.id];

  return {
    region,
    language: cluster.language,
    clusterId: cluster.id,
    mainKeyword: cluster.mainKeyword,
    aliases: cluster.aliases,
    searchPhrase,
    url,
    title: buildTitle(cluster, displayName),
    h1: buildH1(cluster, displayName),
    pageType: cluster.pageType,
    intent: cluster.intent as SeoIntent,
    needsReview: Boolean(needsReviewReason),
    ...(needsReviewReason ? { needsReviewReason } : {}),
  };
}

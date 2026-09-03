import type { LanguageSlug } from "../languages";
import type { SeoIntent } from "./keywords";
import gongdeokDongPreviews from "./previews/gongdeok-dong.json";

// data/seo/previews/*.json (scripts/preview-seo-combinations.mts 로 생성) 항목의 구조.
// 실제 필드는 그 스크립트의 출력과 반드시 일치해야 한다.
export interface SeoLocalPreview {
  region: {
    sido: string;
    sigungu: string;
    legalDong: string;
    legalCode: string;
  };
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

// 법정동(legalDong) 이름 -> 해당 지역의 Preview 전체(활성 Cluster 30개 전부).
// 새 지역 Preview를 생성하면(scripts/preview-seo-combinations.mts) 여기에도 등록해야
// 아래 findLocalSeoPreview 에서 조회할 수 있다.
const PREVIEW_REGISTRY: Record<string, SeoLocalPreview[]> = {
  공덕동: gongdeokDongPreviews as SeoLocalPreview[],
};

// 실제로 공개하는 (지역, 키워드) 조합 화이트리스트.
// 여기 없는 조합은 Preview 데이터가 있어도 페이지를 공개하지 않는다.
// app/local/.../page.tsx 의 generateStaticParams + dynamicParams=false 와 함께
// 전국/전체 Cluster가 실수로 자동 노출되는 것을 이중으로 막는 안전장치다.
export const PUBLISHED_LOCAL_SEO_PAGES: Array<{
  sido: string;
  sigungu: string;
  dong: string;
  keyword: string;
}> = [{ sido: "서울특별시", sigungu: "마포구", dong: "공덕동", keyword: "영어회화" }];

export function findLocalSeoPreview(
  sido: string,
  sigungu: string,
  dong: string,
  keyword: string
): SeoLocalPreview | null {
  const isPublished = PUBLISHED_LOCAL_SEO_PAGES.some(
    (p) => p.sido === sido && p.sigungu === sigungu && p.dong === dong && p.keyword === keyword
  );
  if (!isPublished) return null;

  const regionPreviews = PREVIEW_REGISTRY[dong];
  if (!regionPreviews) return null;

  return (
    regionPreviews.find(
      (p) =>
        p.region.sido === sido &&
        p.region.sigungu === sigungu &&
        p.region.legalDong === dong &&
        p.mainKeyword === keyword
    ) ?? null
  );
}

// SEO meta description. title/h1과 마찬가지로 intent 기준 소수의 Template만 사용한다.
export function buildLocalSeoDescription(preview: SeoLocalPreview): string {
  const { legalDong } = preview.region;
  const { mainKeyword } = preview;
  switch (preview.intent) {
    case "conversation":
      return `${legalDong} ${mainKeyword}를 찾고 있다면 원어민 선생님과 1:1 화상수업으로 시작해보세요. 왕초보부터 성인·직장인 회화까지 현재 수준과 목표에 맞춰 배우는 도란 ${mainKeyword}.`;
    case "tutoring":
      return `${legalDong}에서 ${mainKeyword}를 찾고 있다면, 이동 없이 원하는 장소에서 받는 도란의 1:1 맞춤 화상과외로 시작해보세요.`;
    case "exam":
      return `${legalDong} ${mainKeyword}가 필요하다면 목표 점수·급수에 맞춘 도란의 1:1 맞춤 시험대비 수업으로 준비해보세요.`;
    default:
      return `${legalDong}에서도 이동 없이 시작하는 도란의 1:1 화상 ${mainKeyword} 수업을 만나보세요.`;
  }
}

import type { LanguageSlug } from "../languages";
import type { SeoIntent } from "./keywords";
import { computePublishedLocalSeoPages } from "./publishBatches";
import gongdeokDongPreviews from "./previews/gongdeok-dong.json";
import daechiDongPreviews from "./previews/대치동.json";
import yeoksamDongPreviews from "./previews/역삼동.json";
import samsungDongPreviews from "./previews/삼성동.json";
import cheongdamDongPreviews from "./previews/청담동.json";
import nonhyeonDongPreviews from "./previews/논현동.json";
import gaepoDongPreviews from "./previews/개포동.json";
import apgujeongDongPreviews from "./previews/압구정동.json";
import sinsaDongPreviews from "./previews/신사동.json";
import jamsilDongPreviews from "./previews/잠실동.json";
import songpaDongPreviews from "./previews/송파동.json";
import seokchonDongPreviews from "./previews/석촌동.json";
import bangiDongPreviews from "./previews/방이동.json";
import munjeongDongPreviews from "./previews/문정동.json";
import seogyoDongPreviews from "./previews/서교동.json";
import sangamDongPreviews from "./previews/상암동.json";
import hapjeongDongPreviews from "./previews/합정동.json";
import yeonnamDongPreviews from "./previews/연남동.json";
import yeouidoDongPreviews from "./previews/여의도동.json";
import dangsanDongPreviews from "./previews/당산동.json";
import yeongdeungpoDongPreviews from "./previews/영등포동.json";
import mokDongPreviews from "./previews/목동.json";
import sinjeongDongPreviews from "./previews/신정동.json";
import magokDongPreviews from "./previews/마곡동.json";
import hwagokDongPreviews from "./previews/화곡동.json";
import guroDongPreviews from "./previews/구로동.json";
import sindorimDongPreviews from "./previews/신도림동.json";
import gasanDongPreviews from "./previews/가산동.json";
import doksanDongPreviews from "./previews/독산동.json";
import seongsu1GaPreviews from "./previews/성수동1가.json";
import haengdangDongPreviews from "./previews/행당동.json";
import hwayangDongPreviews from "./previews/화양동.json";
import gireumDongPreviews from "./previews/길음동.json";
import jeongneungDongPreviews from "./previews/정릉동.json";
import jangwiDongPreviews from "./previews/장위동.json";
import cheongnyangniDongPreviews from "./previews/청량리동.json";
import janganDongPreviews from "./previews/장안동.json";
import sillimDongPreviews from "./previews/신림동.json";
import bongcheonDongPreviews from "./previews/봉천동.json";
import sadangDongPreviews from "./previews/사당동.json";
import sangdoDongPreviews from "./previews/상도동.json";
import sanggyeDongPreviews from "./previews/상계동.json";
import junggyeDongPreviews from "./previews/중계동.json";

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
  대치동: daechiDongPreviews as SeoLocalPreview[],
  역삼동: yeoksamDongPreviews as SeoLocalPreview[],
  삼성동: samsungDongPreviews as SeoLocalPreview[],
  청담동: cheongdamDongPreviews as SeoLocalPreview[],
  논현동: nonhyeonDongPreviews as SeoLocalPreview[],
  개포동: gaepoDongPreviews as SeoLocalPreview[],
  압구정동: apgujeongDongPreviews as SeoLocalPreview[],
  신사동: sinsaDongPreviews as SeoLocalPreview[],
  잠실동: jamsilDongPreviews as SeoLocalPreview[],
  송파동: songpaDongPreviews as SeoLocalPreview[],
  석촌동: seokchonDongPreviews as SeoLocalPreview[],
  방이동: bangiDongPreviews as SeoLocalPreview[],
  문정동: munjeongDongPreviews as SeoLocalPreview[],
  서교동: seogyoDongPreviews as SeoLocalPreview[],
  상암동: sangamDongPreviews as SeoLocalPreview[],
  합정동: hapjeongDongPreviews as SeoLocalPreview[],
  연남동: yeonnamDongPreviews as SeoLocalPreview[],
  여의도동: yeouidoDongPreviews as SeoLocalPreview[],
  당산동: dangsanDongPreviews as SeoLocalPreview[],
  영등포동: yeongdeungpoDongPreviews as SeoLocalPreview[],
  목동: mokDongPreviews as SeoLocalPreview[],
  신정동: sinjeongDongPreviews as SeoLocalPreview[],
  마곡동: magokDongPreviews as SeoLocalPreview[],
  화곡동: hwagokDongPreviews as SeoLocalPreview[],
  구로동: guroDongPreviews as SeoLocalPreview[],
  신도림동: sindorimDongPreviews as SeoLocalPreview[],
  가산동: gasanDongPreviews as SeoLocalPreview[],
  독산동: doksanDongPreviews as SeoLocalPreview[],
  성수동1가: seongsu1GaPreviews as SeoLocalPreview[],
  행당동: haengdangDongPreviews as SeoLocalPreview[],
  화양동: hwayangDongPreviews as SeoLocalPreview[],
  길음동: gireumDongPreviews as SeoLocalPreview[],
  정릉동: jeongneungDongPreviews as SeoLocalPreview[],
  장위동: jangwiDongPreviews as SeoLocalPreview[],
  청량리동: cheongnyangniDongPreviews as SeoLocalPreview[],
  장안동: janganDongPreviews as SeoLocalPreview[],
  신림동: sillimDongPreviews as SeoLocalPreview[],
  봉천동: bongcheonDongPreviews as SeoLocalPreview[],
  사당동: sadangDongPreviews as SeoLocalPreview[],
  상도동: sangdoDongPreviews as SeoLocalPreview[],
  상계동: sanggyeDongPreviews as SeoLocalPreview[],
  중계동: junggyeDongPreviews as SeoLocalPreview[],
};

// ---------------------------------------------------------------------------
// 공개 지역 x 공개 Keyword 화이트리스트
//
// PUBLISHED_LOCAL_SEO_PAGES 는 여전히 유일한 Single Source of Truth다 —
// app/local/.../page.tsx(generateStaticParams)와 app/sitemap.ts가 그대로
// 이 배열을 import해서 쓴다. 실제 "공개 지역 목록"과 "공개 키워드 목록"은
// ./publishBatches.ts 에서 관리하고(사람이 코드에서 쉽게 확인 가능), 여기서는
// 그 cross product만 계산한다. 새 지역/키워드를 공개하려면 publishBatches.ts의
// 두 배열에만 추가하면 된다.
// ---------------------------------------------------------------------------

export const PUBLISHED_LOCAL_SEO_PAGES: Array<{
  sido: string;
  sigungu: string;
  dong: string;
  keyword: string;
}> = computePublishedLocalSeoPages();

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

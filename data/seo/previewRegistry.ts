import fs from "node:fs";
import path from "node:path";
import { computePublishedLocalSeoPages } from "./publishBatches";
import { getEnabledClusters } from "./keywords";
import { buildLocalPreview, type SeoLocalPreview } from "@/lib/seo/buildLocalPreview";

// SeoLocalPreview 타입은 lib/seo/buildLocalPreview.ts가 소유한다. 이 파일은
// 그 타입을 그대로 재노출해 기존 import 경로(@/data/seo/previewRegistry의
// SeoLocalPreview)를 깨지 않는다.
export type { SeoLocalPreview } from "@/lib/seo/buildLocalPreview";

// ---------------------------------------------------------------------------
// 지역 -> legalCode 조회 인덱스
//
// 예전에는 지역(법정동)마다 미리 만든 Preview *.json을 정적 import해서 조회
// 했지만, 전국 규모로 확장하면서 지역마다 별도 파일을 두는 방식은 git/번들
// 관리에 비효율적이라 판단해 걷어냈다(Part 7 참고). 대신
// data/regions/generated/seo-regions.json(행정동+법정동 병합 SEO 지역
// 마스터)에서 그 자리에서 code만 조회하고, 실제 Preview 객체(title/h1/
// searchPhrase 등)는 lib/seo/buildLocalPreview.ts의 순수 함수로 즉시
// 계산한다. 이 code 값은 내부 식별 용도일 뿐 title/H1/description/URL
// 어디에도 그대로 노출되지 않는다(사용처: buildLocalPreview.ts 타입 요구
// 사항 충족용).
//
// seo-regions.json은 행정동에서만 존재하는 지역(legalCodes가 빈 배열)과
// 법정동에서만 존재하는 지역(administrativeCodes가 빈 배열)을 모두 포함하기
// 때문에, legalCode를 우선하되 없으면 administrativeCode, 그마저 없으면
// (이론상 발생하지 않지만 방어적으로) region id 문자열을 그대로 쓴다.
//
// fs.readFileSync를 쓰는 이유: 최신 Node의 ESM JSON import는 import
// attribute를 요구해 순수 node 실행(스크립트)에서 깨지기 쉽다.
// scripts/preview-seo-combinations.mts도 이미 같은 방식으로 이 파일을 읽는다.
interface SeoRegionRecord {
  id: string;
  sido: string;
  sigungu: string | null;
  regionName: string;
  regionType: "읍" | "면" | "동" | null;
  fullName: string;
  sources: string[];
  legalCodes: string[];
  administrativeCodes: string[];
}

const seoRegionsPath = path.join(process.cwd(), "data", "regions", "generated", "seo-regions.json");
const seoRegions: SeoRegionRecord[] = JSON.parse(fs.readFileSync(seoRegionsPath, "utf-8"));

// 모듈 로드 시 1회만 인덱싱한다 — 정적 페이지를 생성하는 동안 매번 6,560개
// 레코드를 순회하지 않도록.
const legalCodeByRegion = new Map<string, string>();
for (const r of seoRegions) {
  if (!r.sigungu) continue;
  const key = `${r.sido}|${r.sigungu}|${r.regionName}`;
  const code = r.legalCodes[0] ?? r.administrativeCodes[0] ?? r.id;
  legalCodeByRegion.set(key, code);
}

// ---------------------------------------------------------------------------
// 공개 지역 x 공개 Keyword 화이트리스트
//
// PUBLISHED_LOCAL_SEO_PAGES 는 여전히 유일한 Single Source of Truth다 —
// app/local/.../page.tsx(generateStaticParams)와 app/sitemap.ts가 그대로
// 이 배열을 import해서 쓴다. 실제 "공개 지역 목록"과 "공개 키워드 목록"은
// ./publishBatches.ts 에서 관리하고(사람이 코드에서 쉽게 확인 가능), 여기서는
// 그 cross product만 계산한다. 공개 범위를 바꾸려면 publishBatches.ts만
// 수정하면 된다.
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

  const legalCode = legalCodeByRegion.get(`${sido}|${sigungu}|${dong}`);
  if (!legalCode) return null;

  const cluster = getEnabledClusters().find((c) => c.mainKeyword === keyword);
  if (!cluster) return null;

  return buildLocalPreview({ sido, sigungu, legalDong: dong, legalCode }, cluster);
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

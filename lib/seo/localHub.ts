import type { LanguageSlug } from "@/data/languages";
import { PUBLISHED_REGIONS_NATIONWIDE, CORE_LOCAL_KEYWORDS } from "@/data/seo/publishBatches";
import { getEnabledClusters } from "@/data/seo/keywords";

// 지역 허브(/local, /local/[sido], /local/[sido]/[sigungu], /local/[sido]/[sigungu]/[dong])가
// 공유하는 탐색 인덱스. PUBLISHED_REGIONS_NATIONWIDE(data/seo/publishBatches.ts)를
// Single Source of Truth로 그대로 재사용한다 — 여기서 지역 목록을 다시 정의하거나
// seo-regions.json을 별도로 다시 읽지 않는다. 기존 97,905개 Local SEO 화이트리스트와
// 완전히 같은 지역 집합만 허브에서 "탐색 가능"하게 만든다(존재하지 않는 조합을
// 만들지 않기 위함).
//
// 모듈 로드 시 1회만 인덱싱해 재사용한다(build-time에 sido 15개 + sigungu 255개
// 페이지를 만드는 동안 매번 6,527개 레코드를 다시 스캔하지 않도록).

const sidoSet = new Set<string>();
const sigunguBySido = new Map<string, Set<string>>();
const dongBySidoSigungu = new Map<string, string[]>();

for (const region of PUBLISHED_REGIONS_NATIONWIDE) {
  sidoSet.add(region.sido);

  if (!sigunguBySido.has(region.sido)) sigunguBySido.set(region.sido, new Set());
  sigunguBySido.get(region.sido)!.add(region.sigungu);

  const key = `${region.sido}|${region.sigungu}`;
  if (!dongBySidoSigungu.has(key)) dongBySidoSigungu.set(key, []);
  dongBySidoSigungu.get(key)!.push(region.dong);
}

// 가나다순 정렬 — dataset에 별도 표시 순서가 없어 사람이 찾기 쉬운 순서로 보여준다.
function sortKo(values: string[]): string[] {
  return [...values].sort((a, b) => a.localeCompare(b, "ko"));
}

/** 실제 공개 대상 지역에 존재하는 시/도 전체(세종특별자치시 제외 — sigungu가 없어
 *  4-segment route로 표현할 수 없기 때문에 PUBLISHED_REGIONS_NATIONWIDE 자체에서
 *  이미 제외돼 있다). */
export function getAllSido(): string[] {
  return sortKo([...sidoSet]);
}

export function isValidSido(sido: string): boolean {
  return sidoSet.has(sido);
}

export function getSigunguList(sido: string): string[] {
  const set = sigunguBySido.get(sido);
  return set ? sortKo([...set]) : [];
}

export function isValidSigungu(sido: string, sigungu: string): boolean {
  return sigunguBySido.get(sido)?.has(sigungu) ?? false;
}

export function getDongList(sido: string, sigungu: string): string[] {
  const list = dongBySidoSigungu.get(`${sido}|${sigungu}`);
  return list ? sortKo(list) : [];
}

export function isValidDong(sido: string, sigungu: string, dong: string): boolean {
  return getDongList(sido, sigungu).includes(dong);
}

export interface LanguageKeywordGroup {
  language: LanguageSlug;
  keywords: string[];
}

/** CORE_LOCAL_KEYWORDS(15개, 언어당 5개)를 실제 Cluster의 language 값 기준으로
 *  묶는다. publishBatches.ts의 선언 순서에 의존하지 않고 keywords.ts의 실제
 *  Cluster 데이터로 매핑해, 두 파일이 나중에 바뀌어도 항상 정확하다. */
export function getCoreKeywordsByLanguage(): LanguageKeywordGroup[] {
  const clusters = getEnabledClusters();
  const grouped = new Map<LanguageSlug, string[]>();

  for (const keyword of CORE_LOCAL_KEYWORDS) {
    const cluster = clusters.find((c) => c.mainKeyword === keyword);
    if (!cluster) continue;
    const list = grouped.get(cluster.language) ?? [];
    list.push(keyword);
    grouped.set(cluster.language, list);
  }

  return (["english", "japanese", "chinese"] as LanguageSlug[]).map((language) => ({
    language,
    keywords: grouped.get(language) ?? [],
  }));
}

export function getTotalPublishedRegionCount(): number {
  return PUBLISHED_REGIONS_NATIONWIDE.length;
}

export function getSigunguCount(sido: string): number {
  return sigunguBySido.get(sido)?.size ?? 0;
}

export function getDongCount(sido: string, sigungu: string): number {
  return dongBySidoSigungu.get(`${sido}|${sigungu}`)?.length ?? 0;
}

// 지역 허브 상단 페이지에서 시/도를 사람이 익숙한 권역 단위로 묶어 보여주기
// 위한 순수 UI 그룹핑이다. 새 지역 사실을 만들지 않고, 이미 존재하는 공식 시/도
// 이름을 어떤 묶음으로 배치할지만 정의한다(널리 알려진 수도권/충청권/호남권/
// 영남권/강원·제주권 구분을 사용). dataset에 없는 시/도는 자동으로 무시된다.
const SIDO_REGION_GROUPS: { label: string; sidoNames: string[] }[] = [
  { label: "수도권", sidoNames: ["서울특별시", "경기도", "인천광역시"] },
  { label: "강원권", sidoNames: ["강원특별자치도"] },
  { label: "충청권", sidoNames: ["대전광역시", "충청북도", "충청남도"] },
  { label: "호남권", sidoNames: ["전남광주통합특별시", "전북특별자치도"] },
  { label: "영남권", sidoNames: ["부산광역시", "대구광역시", "울산광역시", "경상북도", "경상남도"] },
  { label: "제주권", sidoNames: ["제주특별자치도"] },
];

export interface SidoRegionGroup {
  label: string;
  sidoList: string[];
}

export function getSidoGroupedByRegion(): SidoRegionGroup[] {
  const available = new Set(getAllSido());
  return SIDO_REGION_GROUPS.map((group) => ({
    label: group.label,
    sidoList: group.sidoNames.filter((sido) => available.has(sido)),
  })).filter((group) => group.sidoList.length > 0);
}

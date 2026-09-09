// Local SEO 공개 지역/키워드 정의. previewRegistry.ts와
// scripts/validate-local-seo-published.mts가 이 파일을 공유해서 같은
// "공개 조합" 정의를 두 곳에서 다시 만들지 않는다(Single Source of Truth).
//
// 이 파일은 ES `import`로 JSON을 가져오지 않는다 — Node로 직접 실행하는
// 검증 스크립트가 (Next.js 번들러 없이도) 문제없이 import할 수 있게 하기
// 위해 seo-regions.json은 아래에서 fs.readFileSync로 읽는다(ESM의 JSON
// import는 최신 Node에서 import attribute를 요구해 순수 node 실행이 깨진다).
//
// 2026-09 nationwide 확장(1단계, legal-dongs.json 기반 3,633개 × 6 keyword)에
// 이어, 2단계로 지역 소스를 seo-regions.json(행정동+법정동 병합 SEO 지역
// 마스터, 6,560개)으로 넓히고 keyword를 15개로 확장한다. 기존 3,633개 지역
// 전부와 기존 6개 keyword 전부가 이번에 새로 계산되는 집합의 부분집합임을
// 확인했다(빌드 시 스크립트로 재검증 가능) — 즉 기존에 공개/색인된 URL은
// 하나도 없어지지 않고, 새 지역(읍/면 + 행정동 전용/법정동 전용 지역)과 새
// keyword 9개만 추가된다.
import fs from "node:fs";
import path from "node:path";

export interface PublishedRegion {
  sido: string;
  sigungu: string;
  dong: string;
}

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

// ---------------------------------------------------------------------------
// 전국 공개 대상 지역 계산
//
// data/regions/generated/seo-regions.json(행정동+법정동을 (시도,시군구,읍면동명)
// 기준으로 병합한 SEO 지역 마스터, build:seo-regions로 생성, 직접 수정 금지)
// 에서 아래 조건으로 걸러낸 지역만 공개 후보로 쓴다:
//
//   1. sigungu가 없는 레코드 제외 — 현재 세종특별자치시 33개 항목이 해당한다.
//      route가 `/local/{sido}/{sigungu}/{dong}/{keyword}` 4-segment 구조라
//      sigungu 세그먼트를 비워둘 방법이 없다(빈 세그먼트는 URL이 깨진다).
//      seo-regions.json에는 이미 "리"/"출장소"/시도·시군구 요약행이 빌드
//      단계에서 제외돼 있어, 별도로 리·출장소를 다시 거를 필요가 없다.
//   2. regionName에 괄호(한자 병기)가 포함된 항목 제외 — 현재 0건이지만
//      원본 데이터가 바뀌어도 안전하도록 방어적으로 유지한다.
//   3. (sido, sigungu, regionName) 조합은 seo-regions.json 빌드 시점에 이미
//      유일하다(build-seo-regions.mjs가 이 조합을 키로 병합) — 여기서 다시
//      중복 제거하지 않는다.
//
// 지역명 자체는 dataset 값을 그대로 쓴다(줄임/별칭/행정동 치환/법정동 병합
// 금지).
const seoRegionsPath = path.join(process.cwd(), "data", "regions", "generated", "seo-regions.json");
const seoRegions: SeoRegionRecord[] = JSON.parse(fs.readFileSync(seoRegionsPath, "utf-8"));

function computeNationwideRegions(): PublishedRegion[] {
  const result: PublishedRegion[] = [];
  for (const r of seoRegions) {
    if (!r.sigungu) continue; // 세종특별자치시 등 sigungu 없는 특수 레코드 제외
    if (r.regionName.includes("(")) continue; // 한자 병기 중복 이름 방어적 제외
    result.push({ sido: r.sido, sigungu: r.sigungu, dong: r.regionName });
  }
  return result;
}

// 모듈 로드 시 1회만 계산해 재사용한다(정적 페이지 약 9만 8천여 개를
// 생성하는 동안 매번 6,560개 레코드를 다시 스캔하지 않도록). 실제로는
// sigungu 없는 세종 33개가 제외돼 6,527개다.
export const PUBLISHED_REGIONS_NATIONWIDE: PublishedRegion[] = computeNationwideRegions();

// CORE_LOCAL_KEYWORDS — 30개 활성 Cluster 중 전국 공개에 적합한 15개(언어당
// 5개, 회화/과외/화상 + 시험 계열)만 선정한다. 선정 기준(자세한 근거는 완료
// 보고 참고):
//   1. 검색 의도가 명확할 것 2. 기존 DORAN 과정과 연결 가능할 것
//   3. 서로 의미가 과도하게 겹치지 않을 것 4. 언어별 균형(5/5/5)
//   5. conversation/tutoring/online/exam/workingholiday 등 Intent 다양성
// 아래 문자열은 data/seo/keywords.ts의 실제 mainKeyword를 그대로 사용한다 —
// 임의 keyword를 만들지 않는다. JPT는 data/seo/keywords.ts에 Cluster가 없어
// (일본어에 시험 계열 Cluster가 JLPT 하나뿐이라) 후보에서 제외했고, 대신
// 일본어에만 있는 고유 검색 의도인 "워홀일본어"로 5개를 채웠다.
export const CORE_LOCAL_KEYWORDS: string[] = [
  // 영어 5개: 회화/과외/화상 + 시험 2종(TOEIC=점수제, OPIc=말하기)
  "영어회화",
  "영어과외",
  "화상영어",
  "토익과외",
  "오픽과외",
  // 일본어 5개: 회화/과외/화상 + 시험 1종(JLPT) + 워홀(일본어에만 있는 Intent)
  "일본어회화",
  "일본어과외",
  "화상일본어",
  "JLPT과외",
  "워홀일본어",
  // 중국어 5개: 회화/과외/화상 + 시험 2종(HSK=등급제, HSKK=말하기)
  "중국어회화",
  "중국어과외",
  "화상중국어",
  "HSK과외",
  "HSKK과외",
];

export interface PublishedLocalSeoPage extends PublishedRegion {
  keyword: string;
}

export function computePublishedLocalSeoPages(): PublishedLocalSeoPage[] {
  return PUBLISHED_REGIONS_NATIONWIDE.flatMap((region) =>
    CORE_LOCAL_KEYWORDS.map((keyword) => ({ ...region, keyword }))
  );
}

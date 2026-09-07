// Local SEO 공개 지역/키워드 정의. previewRegistry.ts와
// scripts/validate-local-seo-published.mts가 이 파일을 공유해서 같은
// "공개 조합" 정의를 두 곳에서 다시 만들지 않는다(Single Source of Truth).
//
// 이 파일은 ES `import`로 JSON을 가져오지 않는다 — Node로 직접 실행하는
// 검증 스크립트가 (Next.js 번들러 없이도) 문제없이 import할 수 있게 하기
// 위해 legal-dongs.json은 아래에서 fs.readFileSync로 읽는다(ESM의 JSON
// import는 최신 Node에서 import attribute를 요구해 순수 node 실행이 깨진다).

import fs from "node:fs";
import path from "node:path";

export interface PublishedRegion {
  sido: string;
  sigungu: string;
  dong: string;
}

interface LegalDongRecord {
  sido: string;
  sigungu: string | null;
  legalEupmyeondong: string | null;
  legalDong: string;
  legalCode: string;
  createdAt: string | null;
}

// ---------------------------------------------------------------------------
// 전국 공개 대상 지역 계산
//
// data/regions/generated/legal-dongs.json(전국 법정동, build:regions로 생성,
// 직접 수정 금지)에서 아래 조건으로 걸러낸 지역만 공개 후보로 쓴다:
//
//   1. legalDong이 "리"로 끝나는 항목 제외 — 읍/면 아래 자연부락(농어촌 리)
//      단위는 실제 "OO리 영어회화" 같은 검색 수요가 사실상 없고, 법정동
//      granularity를 지나치게 잘게 쪼개 thin-content 페이지만 늘리는 결과가
//      된다. "동/가"(도시 지역) 단위만 남긴다.
//   2. legalDong에 괄호(한자 병기, 예: "기암리(岐岩)")가 포함된 항목 제외 —
//      같은 한글 이름이 legalCode만 다르게 중복 등록된 경우라 공개 지역명
//      으로 부적절하다.
//   3. (sido, sigungu, legalDong) 완전 일치 기준으로 중복 제거.
//
// 지역명 자체는 dataset 값을 그대로 쓴다(줄임/별칭/행정동 치환/법정동 병합
// 금지). sigungu가 null인 세종특별자치시 등 특수 사례는 자동으로 제외된다
// (아래 필터가 sigungu !== null도 함께 확인).
const legalDongsPath = path.join(process.cwd(), "data", "regions", "generated", "legal-dongs.json");
const legalDongs: LegalDongRecord[] = JSON.parse(fs.readFileSync(legalDongsPath, "utf-8"));

function computeNationwideRegions(): PublishedRegion[] {
  const seen = new Set<string>();
  const result: PublishedRegion[] = [];
  for (const r of legalDongs) {
    if (!r.sigungu) continue; // sigungu 없는 특수 레코드 제외
    if (r.legalDong.endsWith("리")) continue; // 농어촌 리 단위 제외
    if (r.legalDong.includes("(")) continue; // 한자 병기 중복 이름 제외
    const key = `${r.sido}|${r.sigungu}|${r.legalDong}`;
    if (seen.has(key)) continue; // (sido, sigungu, legalDong) 중복 제거
    seen.add(key);
    result.push({ sido: r.sido, sigungu: r.sigungu, dong: r.legalDong });
  }
  return result;
}

// 모듈 로드 시 1회만 계산해 재사용한다(정적 페이지 21,900여 개를 생성하는
// 동안 매번 18,868개 레코드를 다시 스캔하지 않도록).
export const PUBLISHED_REGIONS_NATIONWIDE: PublishedRegion[] = computeNationwideRegions();

// CORE_LOCAL_KEYWORDS — 30개 활성 Cluster 전체가 아니라, 검색 의도가 뚜렷한
// 핵심 6개만 전국 공개 대상으로 삼는다(언어당 회화 1개 + 자격증 성격 시험
// 1개). 아래 문자열은 data/seo/keywords.ts의 실제 mainKeyword를 그대로
// 사용한다 — 임의 keyword를 만들지 않는다("영어자격증"/"영어내신"처럼
// taxonomy에 없는 이름은 사용하지 않고, 실제 존재하는 자격증 Cluster인
// 토익과외/JLPT과외/HSK과외로 대체).
export const CORE_LOCAL_KEYWORDS: string[] = [
  "영어회화",
  "토익과외",
  "일본어회화",
  "JLPT과외",
  "중국어회화",
  "HSK과외",
];

export interface PublishedLocalSeoPage extends PublishedRegion {
  keyword: string;
}

export function computePublishedLocalSeoPages(): PublishedLocalSeoPage[] {
  return PUBLISHED_REGIONS_NATIONWIDE.flatMap((region) =>
    CORE_LOCAL_KEYWORDS.map((keyword) => ({ ...region, keyword }))
  );
}

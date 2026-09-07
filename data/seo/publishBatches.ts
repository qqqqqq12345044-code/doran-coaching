// Local SEO 공개 지역/키워드 배치 정의. previewRegistry.ts와
// scripts/validate-local-seo-published.mts가 이 파일을 공유해서 같은
// "공개 조합" 정의를 두 곳에서 다시 만들지 않는다(Single Source of Truth).
//
// 이 파일은 JSON을 import하지 않는 순수 TS 상수만 담는다 — Node로 직접
// 실행하는 검증 스크립트가 (Next.js 번들러 없이도) 문제없이 import할 수
// 있게 하기 위한 의도적인 분리다.

export interface PublishedRegion {
  sido: string;
  sigungu: string;
  dong: string;
}

// SEO_PUBLISH_BATCH_1 — 2026-09 1차 확대: 서울 주요 지역 x 핵심 6개 Keyword.
// 전국 6,560개 지역 중 검색엔진이 품질을 확인할 수 있는 범위로만 전략적으로
// 공개한다(전체 공개 금지 — CLAUDE.md [SEO] 참고).
export const SEO_PUBLISH_BATCH_1_REGIONS: PublishedRegion[] = [
  // 마포구
  { sido: "서울특별시", sigungu: "마포구", dong: "공덕동" }, // 최초 공개 지역
  { sido: "서울특별시", sigungu: "마포구", dong: "서교동" },
  { sido: "서울특별시", sigungu: "마포구", dong: "상암동" },
  { sido: "서울특별시", sigungu: "마포구", dong: "합정동" },
  { sido: "서울특별시", sigungu: "마포구", dong: "연남동" },
  // 강남구
  { sido: "서울특별시", sigungu: "강남구", dong: "대치동" },
  { sido: "서울특별시", sigungu: "강남구", dong: "역삼동" },
  { sido: "서울특별시", sigungu: "강남구", dong: "삼성동" },
  { sido: "서울특별시", sigungu: "강남구", dong: "청담동" },
  { sido: "서울특별시", sigungu: "강남구", dong: "논현동" },
  { sido: "서울특별시", sigungu: "강남구", dong: "개포동" },
  { sido: "서울특별시", sigungu: "강남구", dong: "압구정동" },
  { sido: "서울특별시", sigungu: "강남구", dong: "신사동" },
  // 송파구
  { sido: "서울특별시", sigungu: "송파구", dong: "잠실동" },
  { sido: "서울특별시", sigungu: "송파구", dong: "송파동" },
  { sido: "서울특별시", sigungu: "송파구", dong: "석촌동" },
  { sido: "서울특별시", sigungu: "송파구", dong: "방이동" },
  { sido: "서울특별시", sigungu: "송파구", dong: "문정동" },
  // 영등포구
  { sido: "서울특별시", sigungu: "영등포구", dong: "여의도동" },
  { sido: "서울특별시", sigungu: "영등포구", dong: "당산동" },
  { sido: "서울특별시", sigungu: "영등포구", dong: "영등포동" },
  // 양천구
  { sido: "서울특별시", sigungu: "양천구", dong: "목동" },
  { sido: "서울특별시", sigungu: "양천구", dong: "신정동" },
  // 강서구
  { sido: "서울특별시", sigungu: "강서구", dong: "마곡동" },
  { sido: "서울특별시", sigungu: "강서구", dong: "화곡동" },
  // 구로구
  { sido: "서울특별시", sigungu: "구로구", dong: "구로동" },
  { sido: "서울특별시", sigungu: "구로구", dong: "신도림동" },
  // 금천구 (사용자 예시의 "가산동"은 실제로는 금천구 소속 법정동 — dataset 기준 반영)
  { sido: "서울특별시", sigungu: "금천구", dong: "가산동" },
  { sido: "서울특별시", sigungu: "금천구", dong: "독산동" },
  // 성동구 (사용자 예시의 "성수동"은 법정동상 성수동1가/2가로 분리 — 1가로 대표)
  { sido: "서울특별시", sigungu: "성동구", dong: "성수동1가" },
  { sido: "서울특별시", sigungu: "성동구", dong: "행당동" },
  // 광진구
  { sido: "서울특별시", sigungu: "광진구", dong: "화양동" },
  // 성북구
  { sido: "서울특별시", sigungu: "성북구", dong: "길음동" },
  { sido: "서울특별시", sigungu: "성북구", dong: "정릉동" },
  { sido: "서울특별시", sigungu: "성북구", dong: "장위동" },
  // 동대문구
  { sido: "서울특별시", sigungu: "동대문구", dong: "청량리동" },
  { sido: "서울특별시", sigungu: "동대문구", dong: "장안동" },
  // 관악구
  { sido: "서울특별시", sigungu: "관악구", dong: "신림동" },
  { sido: "서울특별시", sigungu: "관악구", dong: "봉천동" },
  // 동작구
  { sido: "서울특별시", sigungu: "동작구", dong: "사당동" },
  { sido: "서울특별시", sigungu: "동작구", dong: "상도동" },
  // 노원구
  { sido: "서울특별시", sigungu: "노원구", dong: "상계동" },
  { sido: "서울특별시", sigungu: "노원구", dong: "중계동" },
];

// 1차 확대에서는 30개 활성 Cluster 전체가 아니라, 검색 의도가 뚜렷한 핵심
// Keyword만 공개한다(언어당 회화 1개 + 자격증 성격 시험 1개). 아래 문자열은
// data/seo/keywords.ts의 실제 mainKeyword를 그대로 사용한다 — 임의 keyword를
// 만들지 않는다("영어자격증"/"영어내신"처럼 taxonomy에 없는 이름은 사용하지
// 않고, 실제 존재하는 자격증 Cluster인 토익과외/JLPT과외/HSK과외로 대체).
export const SEO_PUBLISH_BATCH_1_KEYWORDS: string[] = [
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
  return SEO_PUBLISH_BATCH_1_REGIONS.flatMap((region) =>
    SEO_PUBLISH_BATCH_1_KEYWORDS.map((keyword) => ({ ...region, keyword }))
  );
}

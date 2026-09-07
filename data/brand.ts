// 브랜드 아이덴티티 관련 문구를 한 곳에서 관리합니다.
// 브랜드명/카피 변경 시 이 파일만 수정하면 됩니다.
//
// 노출 방식 기준:
// - Header: 도란(nameKo)만 단독 사용
// - 브랜드 소개 / Hero / Footer: 도란 DORAN(brandLabel) 조합 사용
// - 영문 단독 표기가 필요한 디자인 요소: DORAN(nameEn)
// - SEO: 도란 DORAN(brandLabel) 조합 사용

export const brand = {
  nameKo: "도란",
  nameEn: "DORAN",
  brandLabel: "도란 DORAN",
  tagline: {
    lines: ["배우는 외국어에서,", "말하는 외국어로."],
  },
  footerServiceLine: "영어 · 일본어 · 중국어",
  footerSubLine: "1:1 맞춤 외국어 과외",
  /** 사이트 전체 metadata description / WebSite·Organization schema에서 공유하는
   *  서비스 설명. 여러 곳에 같은 문구를 다시 적지 않기 위한 단일 출처. */
  seoDescription:
    "영어, 일본어, 중국어를 각 분야 전문 코치와 1:1로 배우는 도란. 회화부터 내신, JLPT·HSK 시험 대비까지 목표에 맞춘 맞춤 커리큘럼을 제공합니다.",
} as const;

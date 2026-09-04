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
} as const;

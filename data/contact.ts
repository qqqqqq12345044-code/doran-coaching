// 실제 확인된 상담 전화번호 Single Source of Truth. 여러 컴포넌트에 번호를
// 각각 하드코딩하지 않고 이 파일 하나만 참조한다. 사용자가 직접 확인해 준
// 값 외에는 임의로 번호를 만들지 않는다.
export const contact = {
  phoneDisplay: "010-2813-1821",
  phoneHref: "tel:01028131821",
} as const;

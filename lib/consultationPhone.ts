// 상담폼 연락처 검증(순수 함수). 한국 휴대폰 010 번호만 받는다.
// 허용 입력: 01012345678 / 010-1234-5678 / 010 1234 5678 → 정규화 결과 01012345678.
// Apps Script(scripts/google-apps-script/consultation.gs)의 isValidMobilePhone이 같은 규칙을
// 그대로 복제한다(.gs는 TS를 import할 수 없음). 규칙을 바꾸면 두 곳을 함께 바꾸고
// `npm run validate:consultation-phone`으로 일치를 확인한다.

export const CONSULTATION_PHONE_ERROR = "휴대폰 번호 11자리를 정확히 입력해주세요.";

/** 숫자·공백·하이픈 외 문자가 있거나 010 + 8자리가 아니면 null. */
export function normalizeConsultationPhone(value: unknown): string | null {
  const text = String(value ?? "").trim();
  if (!/^[\d\s-]+$/.test(text)) return null;
  const digits = text.replace(/[\s-]/g, "");
  return /^010\d{8}$/.test(digits) ? digits : null;
}

export function isValidConsultationPhone(value: unknown): boolean {
  return normalizeConsultationPhone(value) !== null;
}

// 개인정보 관련 운영 정보 Single Source of Truth. 상담폼 동의 문구(ConsultationSection)와
// /privacy 페이지가 함께 참조한다.
// 처리주체(사업자명)/보유기간/문의처/시행일은 아직 확정되지 않아 비워 둔다 — 추측해서
// 채우지 않는다. 값이 확정되면 이 객체만 채우면 두 곳에 자동으로 노출된다(비어 있는
// 항목은 화면에 아무것도 그리지 않는다).
export const privacyPolicyInfo: {
  processor?: string;
  retentionPeriod?: string;
  contact?: string;
  effectiveDate?: string;
  policyUrl: string;
} = {
  policyUrl: "/privacy",
};

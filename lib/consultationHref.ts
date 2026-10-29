import { languages } from "@/data/languages";

// "#consultation" 섹션이 없는 페이지(12개 세부 과정 상세·매거진·수강후기 등)에서
// 전역 상담 CTA(Header/Floating/Footer)가 이동할 곳. 언어 하위 경로(/english/...)
// 에서는 같은 언어 랜딩의 상담 섹션으로 보내 관심 언어가 유지되게 하고, 그 외에는
// 기존처럼 홈의 상담 섹션으로 보낸다.
export function getConsultationFallbackHref(pathname: string): string {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  const language = languages.find((lang) => lang.slug === firstSegment);
  return language ? `${language.href}#consultation` : "/#consultation";
}

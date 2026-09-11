import type { LanguageSlug } from "@/data/languages";

// 12개 상세페이지/Local SEO 리프 페이지가 이미 쓰는 언어별 accent 규칙(bg-{lang},
// text-{lang}, {lang}-tint/{lang}-dark)을 지역 허브 컴포넌트에서도 그대로
// 재사용한다 — 새 색상 토큰을 만들지 않는다.
export const LANGUAGE_ACCENT: Record<
  LanguageSlug,
  { text: string; tint: string; border: string }
> = {
  english: { text: "text-english", tint: "bg-english-tint text-english-dark", border: "border-english/20" },
  japanese: { text: "text-japanese", tint: "bg-japanese-tint text-japanese-dark", border: "border-japanese/20" },
  chinese: { text: "text-chinese", tint: "bg-chinese-tint text-chinese-dark", border: "border-chinese/20" },
};

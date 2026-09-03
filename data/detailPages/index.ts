import type { CurriculumLanguage } from "../curriculum/powerCurriculum.ts";
import type { DetailCategory, DetailPageContent } from "./types.ts";
import { englishDetailPages } from "./english.ts";
import { japaneseDetailPages } from "./japanese.ts";
import { chineseDetailPages } from "./chinese.ts";

export * from "./types.ts";

export const DETAIL_CATEGORIES: DetailCategory[] = ["conversation", "certification", "school", "other"];

const PAGES_BY_LANGUAGE: Record<CurriculumLanguage, Record<string, DetailPageContent>> = {
  english: englishDetailPages,
  japanese: japaneseDetailPages,
  chinese: chineseDetailPages,
};

const LANGUAGE_SLUGS: CurriculumLanguage[] = ["english", "japanese", "chinese"];

function isCurriculumLanguage(value: string): value is CurriculumLanguage {
  return (LANGUAGE_SLUGS as string[]).includes(value);
}

/** 화이트리스트 조회. 12개 조합 외에는 항상 null을 반환한다(새 조합 임의 생성 금지). */
export function getDetailPage(language: string, category: string): DetailPageContent | null {
  if (!isCurriculumLanguage(language)) return null;
  if (!DETAIL_CATEGORIES.includes(category as DetailCategory)) return null;
  return PAGES_BY_LANGUAGE[language][category] ?? null;
}

export function getAllDetailPages(): DetailPageContent[] {
  return LANGUAGE_SLUGS.flatMap((language) => DETAIL_CATEGORIES.map((category) => PAGES_BY_LANGUAGE[language][category]));
}

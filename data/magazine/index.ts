import type { MagazineArticle, MagazineLanguage } from "./types.ts";
import { englishMagazineArticles } from "./english.ts";
import { japaneseMagazineArticles } from "./japanese.ts";
import { chineseMagazineArticles } from "./chinese.ts";
import { commonMagazineArticles } from "./common.ts";

export type { MagazineArticle, MagazineLanguage, MagazineRelatedCourse } from "./types.ts";

// 매거진 글 전체(1차 배치 10개). 언어별 파일(english/japanese/chinese/common)을
// 그대로 합친다 — data/detailPages/index.ts와 같은 패턴.
export const magazineArticles: MagazineArticle[] = [
  ...englishMagazineArticles,
  ...japaneseMagazineArticles,
  ...chineseMagazineArticles,
  ...commonMagazineArticles,
];

export function getMagazineArticle(slug: string): MagazineArticle | null {
  return magazineArticles.find((article) => article.slug === slug) ?? null;
}

export function getAllMagazineSlugs(): string[] {
  return magazineArticles.map((article) => article.slug);
}

export function getMagazineArticlesByLanguage(language: MagazineLanguage): MagazineArticle[] {
  return magazineArticles.filter((article) => article.language === language);
}

/** relatedArticleSlugs에 등록된 slug로 실제 MagazineArticle을 조회한다.
 *  존재하지 않는 slug(오타 등)는 조용히 걸러낸다. */
export function getRelatedMagazineArticles(article: MagazineArticle): MagazineArticle[] {
  return article.relatedArticleSlugs
    .map((slug) => getMagazineArticle(slug))
    .filter((related): related is MagazineArticle => related !== null);
}

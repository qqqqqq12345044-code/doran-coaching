import { getMagazineArticle, type MagazineArticle } from "../magazine/index.ts";

// 문맥 내부링크용 "키워드/과정 -> 실제로 관련 있는 매거진 글" 매핑.
//
// 무차별 링크를 만들지 않기 위해 사람이 직접 확인해 고정한 소수의 slug만 둔다.
// 새 글/새 키워드가 생겨도 여기 없으면 링크를 만들지 않는다(없는 관련성을 창작하지
// 않음). slug 존재/언어 일치는 scripts/validate-seo-quality.mts가 검사한다.

/** 지역 리프(keyword)별 관련 매거진 1개. CORE_LOCAL_KEYWORDS 15개와 1:1. */
export const LOCAL_KEYWORD_MAGAZINE_SLUG: Record<string, string> = {
  영어회화: "why-english-speaking-not-improving",
  영어과외: "who-fits-online-language-tutoring",
  화상영어: "self-study-vs-1on1-english-speaking",
  토익과외: "toeic-study-order",
  오픽과외: "opic-grade-guide",
  일본어회화: "japanese-speaking-study-order",
  일본어과외: "japanese-self-study-plateau",
  화상일본어: "who-fits-online-language-tutoring",
  JLPT과외: "jlpt-n3-n2-n1-difference",
  워홀일본어: "workingholiday-japanese-prep-order",
  중국어회화: "chinese-speaking-study-order",
  중국어과외: "chinese-speaking-not-improving",
  화상중국어: "who-fits-online-language-tutoring",
  HSK과외: "hsk-study-order",
  HSKK과외: "hskk-speaking-prep",
};

/** 상세 서비스 페이지(`${language}/${category}`)별 관련 매거진(최대 3개).
 *  내신(school)은 관련 매거진이 영어 1개뿐이라 그 이상 억지로 채우지 않는다. */
export const DETAIL_MAGAZINE_SLUGS: Record<string, string[]> = {
  "english/conversation": ["why-english-speaking-not-improving", "self-study-vs-1on1-english-speaking", "listening-ok-speaking-blocked"],
  "english/certification": ["toeic-vs-opic-which-to-prepare", "toeic-study-order", "opic-grade-guide"],
  "english/school": ["middle-school-english-grade-management"],
  "english/other": ["english-abroad-study-prep-basics", "ielts-vs-toeic-difference", "det-vs-toeic-difference"],
  "japanese/conversation": ["japanese-speaking-study-order", "japanese-speaking-not-improving", "japan-travel-japanese-prep"],
  "japanese/certification": ["jlpt-vs-jpt", "jlpt-n3-n2-n1-difference", "jlpt-n2-study-order"],
  "japanese/school": [],
  "japanese/other": ["workingholiday-japanese-prep-order", "office-worker-japanese-study-routine"],
  "chinese/conversation": ["chinese-speaking-study-order", "chinese-speaking-not-improving", "china-travel-chinese-prep"],
  "chinese/certification": ["hsk-vs-hskk", "hsk-study-order", "hskk-speaking-prep"],
  "chinese/school": [],
  "chinese/other": ["business-chinese-basics", "chinese-business-etiquette-basics"],
};

/** 언어별 종합 랜딩(/english /japanese /chinese)의 "시작 전에 읽어보면 좋은 질문 가이드" 링크(2026-11 GEO 파일럿).
 *  랜딩에서 신규 질문 글과 기존 관련 글로 연결하는 소수의 링크만 둔다. 슬러그 존재/언어 일치는
 *  scripts/validate-geo-pilot.mts가 검사한다. */
export const LANDING_GUIDE_MAGAZINE_SLUGS: Record<"english" | "japanese" | "chinese", string[]> = {
  english: [
    "adult-english-speaking-beginner-start",
    "online-english-lessons-per-week",
    "office-worker-english-30-minute-lesson",
    "online-english-tutoring-vs-academy",
    "online-english-tutoring-cost-comparison",
    "self-study-vs-1on1-english-speaking",
  ],
  japanese: [
    "japanese-beginner-online-lesson",
    "jlpt-and-conversation-together",
    "japanese-speaking-study-order",
    "japanese-self-study-plateau",
  ],
  chinese: [
    "chinese-speaking-self-study-vs-online-lesson",
    "hsk-and-conversation-together",
    "chinese-speaking-study-order",
    "chinese-tone-difficulty",
  ],
};

export function getLandingGuideArticles(language: "english" | "japanese" | "chinese"): MagazineArticle[] {
  return LANDING_GUIDE_MAGAZINE_SLUGS[language]
    .map((slug) => getMagazineArticle(slug))
    .filter((a): a is MagazineArticle => a !== null);
}

export function getLocalRelatedMagazine(mainKeyword: string): MagazineArticle | null {
  const slug = LOCAL_KEYWORD_MAGAZINE_SLUG[mainKeyword];
  return slug ? getMagazineArticle(slug) : null;
}

export function getDetailRelatedMagazines(language: string, category: string): MagazineArticle[] {
  return (DETAIL_MAGAZINE_SLUGS[`${language}/${category}`] ?? [])
    .map((slug) => getMagazineArticle(slug))
    .filter((a): a is MagazineArticle => a !== null);
}

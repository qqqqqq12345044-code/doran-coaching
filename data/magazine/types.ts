import type { DetailContentSection, DetailFaqItem } from "@/data/detailPages/types";

// 매거진 아티클 전용 콘텐츠 타입. 12개 세부 과정 상세페이지(data/detailPages)와
// 같은 본문 조각 타입(DetailContentSection/DetailFaqItem)을 그대로 재사용해
// components/detail/* 컴포넌트(DetailSection, DetailFAQ 등)를 새로 만들지
// 않고 그대로 쓸 수 있게 한다.
//
// 이 파일의 문자열 필드는 실제 사용자 노출 Editorial Body Content다. 시험
// 관련 사실은 항상 data/curriculum/examFacts.ts / courseDetails.ts에 있는
// 값만 사용하고, 이 파일 자체에는 새로운 점수·등급·통계를 만들지 않는다.

export type MagazineLanguage = "english" | "japanese" | "chinese" | "common";

export interface MagazineRelatedCourse {
  label: string;
  href: string;
}

export interface MagazineArticle {
  /** URL 세그먼트. /magazine/[slug]. 영문 kebab-case. */
  slug: string;
  language: MagazineLanguage;
  /** 목록 페이지 카드에 노출하는 카테고리 라벨(예: "영어 학습법"). */
  categoryLabel: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  /** 목록 카드에 쓰는 1문장 요약. */
  cardSummary: string;
  directAnswer: { question: string; answer: string };
  /** Direct Answer 다음, 첫 Section 이전에 오는 도입부 문단(선택). */
  intro?: string[];
  /** 핵심 요약부터 "어떤 사람에게 적합한지"까지 본문 Section들. */
  sections: DetailContentSection[];
  /** 관련 DORAN 과정 상세페이지 링크. 1~3개. */
  relatedCourses: MagazineRelatedCourse[];
  /** 관련 매거진 글 slug. 2~3개. */
  relatedArticleSlugs: string[];
  faq: DetailFaqItem[];
  /** 실제 작업일 기준 게시일. ISO 날짜 문자열(YYYY-MM-DD). */
  publishedAt: string;
}

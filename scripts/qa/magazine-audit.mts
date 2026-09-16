// DORAN Magazine 50개 아티클 콘텐츠 유사도 + 검색 intent cannibalization 감사.
// 실행: node scripts/qa/magazine-audit.mts > scripts/qa/out/magazine-audit.json

import { magazineArticles } from "../../data/magazine/index.ts";
import type { MagazineArticle } from "../../data/magazine/index.ts";
import { similarityPair, stats } from "./similarity-lib.mts";

function bodyText(a: MagazineArticle): string {
  const parts = [
    a.h1,
    a.directAnswer.question,
    a.directAnswer.answer,
    ...(a.intro ?? []),
    ...a.sections.flatMap((s) => [s.heading, ...s.paragraphs, ...(s.bullets ?? [])]),
    ...a.faq.flatMap((f) => [f.question, f.answer]),
  ];
  return parts.filter(Boolean).join(" ");
}

// "검색 의도 표면" — 제목/설명/직접답변 질문만. 본문이 달라도 같은 쿼리를
// 노리고 있는지(cannibalization) 판단하는 용도.
function intentText(a: MagazineArticle): string {
  return [a.eyebrow, a.h1, a.metaTitle, a.metaDescription, a.cardSummary, a.directAnswer.question].filter(Boolean).join(" ");
}

const items = magazineArticles.map((a) => ({
  slug: a.slug,
  language: a.language,
  categoryLabel: a.categoryLabel,
  body: bodyText(a),
  intent: intentText(a),
}));

interface PairResult {
  pair: string;
  sameLanguage: boolean;
  sameCategory: boolean;
  bodyCosine: number;
  bodyJaccard: number;
  intentCosine: number;
  intentJaccard: number;
}

const pairs: PairResult[] = [];
for (let i = 0; i < items.length; i++) {
  for (let j = i + 1; j < items.length; j++) {
    const a = items[i];
    const b = items[j];
    const bodySim = similarityPair(a.body, b.body);
    const intentSim = similarityPair(a.intent, b.intent);
    pairs.push({
      pair: `${a.slug} vs ${b.slug}`,
      sameLanguage: a.language === b.language,
      sameCategory: a.categoryLabel === b.categoryLabel,
      bodyCosine: bodySim.cosine,
      bodyJaccard: bodySim.jaccard,
      intentCosine: intentSim.cosine,
      intentJaccard: intentSim.jaccard,
    });
  }
}

const byBody = [...pairs].sort((a, b) => b.bodyCosine - a.bodyCosine);
const byIntent = [...pairs].sort((a, b) => b.intentCosine - a.intentCosine);

// 특정 검증 대상: JLPT N3/N2/N1 차이 글 vs JLPT N1/N2 관련 글
const jlptPair = pairs.find((p) => p.pair.includes("jlpt-n3-n2-n1") && p.pair.includes("jlpt-n1-n2"));

const report = {
  totalArticles: items.length,
  totalPairs: pairs.length,
  bodyOverall: stats(pairs.map((p) => p.bodyCosine)),
  intentOverall: stats(pairs.map((p) => p.intentCosine)),
  top15MostSimilarBody: byBody.slice(0, 15),
  top15MostSimilarIntent: byIntent.slice(0, 15),
  // "위험": 같은 언어 + intent cosine 0.55 이상(제목/설명 수준에서 같은 검색어를 노림)
  cannibalizationCandidates: pairs
    .filter((p) => p.sameLanguage && p.intentCosine >= 0.55)
    .sort((a, b) => b.intentCosine - a.intentCosine),
  // "관찰": intent cosine 0.4~0.55
  watchCandidates: pairs
    .filter((p) => p.sameLanguage && p.intentCosine >= 0.4 && p.intentCosine < 0.55)
    .sort((a, b) => b.intentCosine - a.intentCosine),
  jlptN3N2N1_vs_N1N2: jlptPair ?? null,
  byLanguageBody: (() => {
    const langOf = new Map(items.map((it) => [it.slug, it.language]));
    const out: Record<string, ReturnType<typeof stats>> = {};
    for (const lang of ["english", "japanese", "chinese", "common"] as const) {
      const vals = pairs
        .filter((p) => {
          const [a, b] = p.pair.split(" vs ");
          return langOf.get(a) === lang && langOf.get(b) === lang;
        })
        .map((p) => p.bodyCosine);
      out[lang] = stats(vals);
    }
    return out;
  })(),
};

console.log(JSON.stringify(report, null, 2));

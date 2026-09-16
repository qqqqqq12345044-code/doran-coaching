// DORAN Detail 12개 페이지(/[language]/[category]) 콘텐츠 유사도 감사.
// 실행: node scripts/qa/detail-audit.mts > scripts/qa/out/detail-audit.json

import { getAllDetailPages, type DetailPageContent } from "../../data/detailPages/index.ts";
import { similarityPair, stats } from "./similarity-lib.mts";

function mainText(page: DetailPageContent): string {
  const parts = [
    page.eyebrow,
    page.h1,
    page.directAnswer.question,
    page.directAnswer.answer,
    ...page.intro,
    ...page.sections.flatMap((s) => [s.heading, ...s.paragraphs, ...(s.bullets ?? [])]),
    ...(page.examWalkthrough ?? []).flatMap((e) => [e.intro, e.doranApproach]),
    ...page.faq.flatMap((f) => [f.question, f.answer]),
    page.metaTitle,
    page.metaDescription,
  ];
  return parts.filter(Boolean).join(" ");
}

const pages = getAllDetailPages();
const texts = pages.map((p) => ({ id: `${p.language}/${p.category}`, path: p.path, text: mainText(p) }));

const pairs: { pair: string; jaccard: number; cosine: number }[] = [];
for (let i = 0; i < texts.length; i++) {
  for (let j = i + 1; j < texts.length; j++) {
    const sim = similarityPair(texts[i].text, texts[j].text);
    pairs.push({ pair: `${texts[i].id} vs ${texts[j].id}`, jaccard: sim.jaccard, cosine: sim.cosine });
  }
}

pairs.sort((a, b) => b.cosine - a.cosine);

function groupBy(predicate: (a: string, b: string) => boolean, label: string) {
  const filtered = pairs.filter((p) => {
    const [a, b] = p.pair.split(" vs ");
    return predicate(a, b);
  });
  return { label, stats: stats(filtered.map((p) => p.cosine)), jaccardStats: stats(filtered.map((p) => p.jaccard)), n: filtered.length };
}

const sameLanguage = groupBy((a, b) => a.split("/")[0] === b.split("/")[0], "same language, different category");
const sameCategory = groupBy((a, b) => a.split("/")[1] === b.split("/")[1], "same category, different language");
const certificationOnly = groupBy((a, b) => a.includes("certification") && b.includes("certification"), "certification x certification (cross-language)");
const conversationOnly = groupBy((a, b) => a.includes("conversation") && b.includes("conversation"), "conversation x conversation (cross-language)");
const schoolOnly = groupBy((a, b) => a.includes("school") && b.includes("school"), "school x school (cross-language)");
const otherOnly = groupBy((a, b) => a.includes("other") && b.includes("other"), "other x other (cross-language)");

const report = {
  totalPages: pages.length,
  totalPairs: pairs.length,
  overall: { cosine: stats(pairs.map((p) => p.cosine)), jaccard: stats(pairs.map((p) => p.jaccard)) },
  top10MostSimilar: pairs.slice(0, 10),
  top10MostDifferent: [...pairs].sort((a, b) => a.cosine - b.cosine).slice(0, 10),
  groups: { sameLanguage, sameCategory, certificationOnly, conversationOnly, schoolOnly, otherOnly },
  allPairs: pairs,
};

console.log(JSON.stringify(report, null, 2));

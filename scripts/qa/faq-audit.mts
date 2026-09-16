// DORAN FAQ 반복 감사 — Detail(12)/Local(15 keyword template)/Magazine(50)/Home·언어페이지
// 전체 FAQ 질문/답변 텍스트를 모아 exact-duplicate / near-duplicate / 어느
// 페이지 유형에서 반복되는지를 확인한다.
//
// Local은 97,905개를 전부 순회하지 않고, "템플릿(지역명 치환 전)" 기준으로
// 비교한다 — 지역명 치환 후 비교는 이미 local-audit.mts Part 1(skeleton dedup)에서
// 전수 처리했고, 여기서는 "페이지 유형을 가로지르는" FAQ 구조 반복이 목적이다.

import { getAllDetailPages } from "../../data/detailPages/index.ts";
import { magazineArticles } from "../../data/magazine/index.ts";
import { faqItems, faqByLanguage } from "../../data/faq.ts";
import { getEnabledClusters } from "../../data/seo/keywords.ts";
import { intentBlueprints } from "../../data/seo/contentBlueprints.ts";
import { examProfiles } from "../../data/seo/examProfiles.ts";
import { clusterContentOverrides } from "../../data/seo/clusterContentOverrides.ts";
import { CORE_LOCAL_KEYWORDS } from "../../data/seo/publishBatches.ts";
import { similarityPair, stats } from "./similarity-lib.mts";

interface FaqEntry {
  source: string; // 어느 페이지 유형인지
  key: string; // 식별자(slug/path/clusterId 등)
  question: string;
  answer: string;
}

const entries: FaqEntry[] = [];

// 1) Detail 12개
for (const page of getAllDetailPages()) {
  for (const item of page.faq) {
    entries.push({ source: "detail", key: `${page.language}/${page.category}`, question: item.question, answer: item.answer });
  }
}

// 2) Magazine 50개
for (const article of magazineArticles) {
  for (const item of article.faq) {
    entries.push({ source: "magazine", key: article.slug, question: item.question, answer: item.answer });
  }
}

// 3) Home + 언어별(faqByLanguage)
for (const item of faqItems) {
  entries.push({ source: "home", key: "home", question: item.question, answer: item.answer });
}
for (const [lang, items] of Object.entries(faqByLanguage)) {
  for (const item of items) {
    entries.push({ source: "language-page", key: lang, question: item.question, answer: item.answer });
  }
}

// 4) Local — CORE_LOCAL_KEYWORDS 15개의 "템플릿"(지역명 치환 전) FAQ. exam
// profile > cluster override > intent blueprint 우선순위는 generateLocalSeoContent.ts와
// 동일하게 재현한다(로직 복제가 아니라 같은 우선순위 규칙만 따름).
const clusters = getEnabledClusters();
for (const keyword of CORE_LOCAL_KEYWORDS) {
  const cluster = clusters.find((c) => c.mainKeyword === keyword)!;
  const examProfile = cluster.intent === "exam" ? examProfiles.find((e) => e.clusterId === cluster.id) : undefined;
  const override = examProfile ? undefined : clusterContentOverrides.find((o) => o.clusterId === cluster.id);
  const qaTemplates = examProfile?.qaTemplates ?? override?.qaTemplates ?? intentBlueprints[cluster.intent].qaTemplates;
  for (const item of qaTemplates.slice(0, 6)) {
    entries.push({ source: "local-template", key: cluster.id, question: item.question, answer: item.answer });
  }
}

// ---------------------------------------------------------------------------
// Exact-duplicate 분석(question+answer 완전 동일, source 무관하게)
// ---------------------------------------------------------------------------
function normKey(e: FaqEntry) {
  return `${e.question.trim()}|||${e.answer.trim()}`;
}
const exactGroups = new Map<string, FaqEntry[]>();
for (const e of entries) {
  const k = normKey(e);
  if (!exactGroups.has(k)) exactGroups.set(k, []);
  exactGroups.get(k)!.push(e);
}
const exactDuplicateGroups = [...exactGroups.values()].filter((g) => g.length > 1);

// answer만 동일(question은 달라도 답변 문장이 재활용된 경우) — Local 시험군에서
// 특히 두드러질 것으로 예상.
const answerGroups = new Map<string, FaqEntry[]>();
for (const e of entries) {
  const k = e.answer.trim();
  if (!answerGroups.has(k)) answerGroups.set(k, []);
  answerGroups.get(k)!.push(e);
}
const answerOnlyDuplicateGroups = [...answerGroups.entries()]
  .filter(([, g]) => g.length > 1)
  .map(([answer, group]) => ({ answer, count: group.length, entries: group }))
  .sort((a, b) => b.count - a.count);

// ---------------------------------------------------------------------------
// Cross-type near-duplicate: source가 다른 entry끼리 question 유사도 높은 쌍
// ---------------------------------------------------------------------------
const crossTypePairs: { a: string; b: string; sourceA: string; sourceB: string; cosine: number }[] = [];
for (let i = 0; i < entries.length; i++) {
  for (let j = i + 1; j < entries.length; j++) {
    const a = entries[i];
    const b = entries[j];
    if (a.source === b.source) continue; // 같은 유형 내부는 위 exact/answer 분석으로 충분
    const sim = similarityPair(a.question, b.question);
    if (sim.cosine >= 0.6) {
      crossTypePairs.push({
        a: `${a.source}:${a.key} — ${a.question}`,
        b: `${b.source}:${b.key} — ${b.question}`,
        sourceA: a.source,
        sourceB: b.source,
        cosine: sim.cosine,
      });
    }
  }
}
crossTypePairs.sort((a, b) => b.cosine - a.cosine);

// ---------------------------------------------------------------------------
// FAQPage schema(JSON-LD) 반복 — Local의 경우 15개 keyword template 각각이
// 그대로 97,905번 재사용된다(스키마 자체 구조 반복, 이미 skeleton dedup에서
// 수치화됨). 여기서는 "몇 개의 서로 다른 FAQ 구조가 실제로 존재하는지"만 집계.
// ---------------------------------------------------------------------------
const distinctLocalFaqSets = new Set(
  CORE_LOCAL_KEYWORDS.map((keyword) => {
    const cluster = clusters.find((c) => c.mainKeyword === keyword)!;
    const examProfile = cluster.intent === "exam" ? examProfiles.find((e) => e.clusterId === cluster.id) : undefined;
    const override = examProfile ? undefined : clusterContentOverrides.find((o) => o.clusterId === cluster.id);
    const qaTemplates = examProfile?.qaTemplates ?? override?.qaTemplates ?? intentBlueprints[cluster.intent].qaTemplates;
    return qaTemplates.map((q) => q.answer).join("|");
  })
);

const report = {
  totalEntries: entries.length,
  bySource: Object.fromEntries(
    ["detail", "magazine", "home", "language-page", "local-template"].map((s) => [s, entries.filter((e) => e.source === s).length])
  ),
  exactDuplicateGroups: {
    count: exactDuplicateGroups.length,
    groups: exactDuplicateGroups.map((g) => ({
      question: g[0].question,
      answer: g[0].answer,
      occurrences: g.map((e) => `${e.source}:${e.key}`),
    })),
  },
  answerOnlyDuplicateGroups: {
    count: answerOnlyDuplicateGroups.length,
    top20: answerOnlyDuplicateGroups.slice(0, 20).map((g) => ({
      answer: g.answer,
      count: g.count,
      occurrences: g.entries.map((e) => `${e.source}:${e.key} (Q: ${e.question})`),
    })),
  },
  crossTypeNearDuplicateQuestions: {
    count: crossTypePairs.length,
    top20: crossTypePairs.slice(0, 20),
  },
  localTemplateStructuralDiversity: {
    coreKeywordCount: CORE_LOCAL_KEYWORDS.length,
    distinctFaqAnswerSets: distinctLocalFaqSets.size,
  },
};

console.log(JSON.stringify(report, null, 2));

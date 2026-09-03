// data/detailPages/* 세부 과정 페이지의 Editorial Body Content 글자수를 검증한다.
// Header/Footer/Navigation/Breadcrumb/Button label/공통 CTA/metadata/코드/
// JSON-LD/examFacts(공식 Fact 표) 등은 집계하지 않는다. 사용자가 실제로 읽는
// 본문(H1, Direct Answer, intro, sections, examWalkthrough 저자 문장, FAQ)만
// 더한다. 외부 표절 검사 도구가 아니라 "내부 분량/중복 문장" 점검용 스크립트다.
//
// 사용법: npm run validate:detail-content

import { getAllDetailPages, type DetailPageContent } from "../data/detailPages/index.ts";

const MIN_CHARS = 3500;
const MAX_CHARS = 4500;

function countBodyChars(content: DetailPageContent): number {
  const parts: string[] = [];

  parts.push(content.h1);
  parts.push(content.directAnswer.question, content.directAnswer.answer);
  parts.push(...content.intro);

  for (const section of content.sections) {
    parts.push(section.heading);
    parts.push(...section.paragraphs);
    if (section.bullets) parts.push(...section.bullets);
  }

  if (content.examWalkthrough) {
    for (const item of content.examWalkthrough) {
      parts.push(item.intro, item.doranApproach);
    }
  }

  for (const item of content.faq) {
    parts.push(item.question, item.answer);
  }

  return parts.join("").length;
}

/** 같은 언어 안에서 완전히 동일한 문장이 여러 페이지에 반복되는지 확인한다
 *  (12페이지끼리도 복제처럼 보이면 안 된다는 요건의 최소 점검). */
function findRepeatedSentences(pages: DetailPageContent[]): Array<{ sentence: string; count: number; pages: string[] }> {
  const sentenceToPages = new Map<string, Set<string>>();

  for (const page of pages) {
    const sentences = [
      ...page.intro,
      ...page.sections.flatMap((s) => s.paragraphs),
      ...(page.examWalkthrough?.flatMap((e) => [e.intro, e.doranApproach]) ?? []),
      ...page.faq.map((f) => f.answer),
    ];
    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (trimmed.length < 20) continue; // 너무 짧은 문장은 우연히 같을 수 있어 제외
      if (!sentenceToPages.has(trimmed)) sentenceToPages.set(trimmed, new Set());
      sentenceToPages.get(trimmed)!.add(page.path);
    }
  }

  return [...sentenceToPages.entries()]
    .filter(([, pages]) => pages.size > 1)
    .map(([sentence, pages]) => ({ sentence, count: pages.size, pages: [...pages] }));
}

const pages = getAllDetailPages();

console.log("=".repeat(70));
console.log("세부 과정 페이지 본문 글자수 검증");
console.log("=".repeat(70));

let failCount = 0;
let totalChars = 0;

for (const page of pages) {
  const chars = countBodyChars(page);
  totalChars += chars;
  const pass = chars >= MIN_CHARS && chars <= MAX_CHARS;
  if (!pass) failCount++;
  console.log(`${page.path.padEnd(24)} ${chars.toLocaleString()}자 ${pass ? "PASS" : "FAIL"}`);
}

console.log("-".repeat(70));
console.log(`평균: ${Math.round(totalChars / pages.length).toLocaleString()}자 (목표 범위 ${MIN_CHARS.toLocaleString()}~${MAX_CHARS.toLocaleString()}자)`);

console.log("\n--- 12페이지 내부 문장 중복 점검(20자 이상 완전 일치 문장) ---");
const repeated = findRepeatedSentences(pages);
if (repeated.length === 0) {
  console.log("중복 문장 없음");
} else {
  for (const r of repeated) {
    console.log(`(${r.count}회) ${r.pages.join(", ")}\n  → "${r.sentence}"`);
  }
}

console.log(`\n종합: ${failCount === 0 && repeated.length === 0 ? "이상 없음" : `확인 필요 (글자수 범위 밖 ${failCount}건, 중복 문장 ${repeated.length}건)`}`);

if (failCount > 0) {
  process.exitCode = 1;
}

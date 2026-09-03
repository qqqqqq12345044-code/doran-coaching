// SEO 키워드 마스터 데이터(data/seo/keywords.ts) 검증 + 법정동 결합 시
// 예상 페이지 후보 개수 계산. 실제 페이지는 생성하지 않는다.
//
// 사용법: npm run validate:seo

import fs from "node:fs";
import path from "node:path";
import { seoKeywordClusters, type SeoKeywordCluster } from "../data/seo/keywords.ts";

const ROOT = process.cwd();
const LANGUAGES = ["english", "japanese", "chinese"] as const;

function findDuplicates(values: string[]): string[] {
  const counts = new Map<string, number>();
  for (const v of values) counts.set(v, (counts.get(v) || 0) + 1);
  return [...counts.entries()].filter(([, n]) => n > 1).map(([v]) => v);
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const duplicateIds = findDuplicates(seoKeywordClusters.map((c) => c.id));
const duplicateMainKeywords = findDuplicates(seoKeywordClusters.map((c) => c.mainKeyword));

const duplicateAliasesWithinLanguage: Record<string, string[]> = {};
for (const lang of LANGUAGES) {
  const aliasesInLang = seoKeywordClusters.filter((c) => c.language === lang).flatMap((c) => c.aliases);
  const dupes = findDuplicates(aliasesInLang);
  if (dupes.length > 0) duplicateAliasesWithinLanguage[lang] = dupes;
}

const allAliases = seoKeywordClusters.flatMap((c) => c.aliases);
const duplicateAliasesAcrossClusters = findDuplicates(allAliases);

const invalidLanguage = seoKeywordClusters.filter((c) => !LANGUAGES.includes(c.language as any));
const missingEnabled = seoKeywordClusters.filter((c) => typeof c.enabled !== "boolean");
const emptyMainKeyword = seoKeywordClusters.filter((c) => !c.mainKeyword || c.mainKeyword.trim() === "");
const emptyAliases = seoKeywordClusters.filter((c) => !c.aliases || c.aliases.length === 0);

// mainKeyword 자신이 같은 Cluster의 alias로도 등록돼 자기중복인 경우
const mainKeywordInOwnAliases = seoKeywordClusters.filter((c) => c.aliases.includes(c.mainKeyword));

const hasIssues =
  duplicateIds.length > 0 ||
  duplicateMainKeywords.length > 0 ||
  Object.keys(duplicateAliasesWithinLanguage).length > 0 ||
  duplicateAliasesAcrossClusters.length > 0 ||
  invalidLanguage.length > 0 ||
  missingEnabled.length > 0 ||
  emptyMainKeyword.length > 0 ||
  emptyAliases.length > 0 ||
  mainKeywordInOwnAliases.length > 0;

// ---------------------------------------------------------------------------
// 조합 개수 계산 (법정동 x Cluster) — 실제 페이지 생성 아님
// ---------------------------------------------------------------------------

const legalDongsPath = path.join(ROOT, "data", "regions", "generated", "legal-dongs.json");
let legalDongCount: number | null = null;
if (fs.existsSync(legalDongsPath)) {
  const legalDongs = JSON.parse(fs.readFileSync(legalDongsPath, "utf-8"));
  legalDongCount = Array.isArray(legalDongs) ? legalDongs.length : null;
}

const enabledClusters = seoKeywordClusters.filter((c) => c.enabled);
const enabledByLanguage: Record<string, SeoKeywordCluster[]> = {
  english: enabledClusters.filter((c) => c.language === "english"),
  japanese: enabledClusters.filter((c) => c.language === "japanese"),
  chinese: enabledClusters.filter((c) => c.language === "chinese"),
};

// ---------------------------------------------------------------------------
// 리포트
// ---------------------------------------------------------------------------

console.log("=".repeat(70));
console.log("SEO 키워드 마스터 데이터 검증");
console.log("=".repeat(70));
console.log(`전체 Cluster 수: ${seoKeywordClusters.length}`);
console.log(`활성(enabled) Cluster 수: ${enabledClusters.length}`);
console.log(`  영어: ${enabledByLanguage.english.length}`);
console.log(`  일본어: ${enabledByLanguage.japanese.length}`);
console.log(`  중국어: ${enabledByLanguage.chinese.length}`);
console.log(`backlog(미확정 후보) 키워드 수: (data/seo/keywords.ts의 seoKeywordBacklog 참고)`);

console.log("\n--- 검증 결과 ---");
console.log(`id 중복: ${duplicateIds.length}`, duplicateIds);
console.log(`mainKeyword 중복: ${duplicateMainKeywords.length}`, duplicateMainKeywords);
console.log(`언어 내 alias 중복:`, duplicateAliasesWithinLanguage);
console.log(`Cluster 간 완전 동일 alias 중복: ${duplicateAliasesAcrossClusters.length}`, duplicateAliasesAcrossClusters);
console.log(`language 값 오류: ${invalidLanguage.length}`, invalidLanguage.map((c) => c.id));
console.log(`enabled 누락: ${missingEnabled.length}`, missingEnabled.map((c) => c.id));
console.log(`빈 mainKeyword: ${emptyMainKeyword.length}`, emptyMainKeyword.map((c) => c.id));
console.log(`빈 aliases: ${emptyAliases.length}`, emptyAliases.map((c) => c.id));
console.log(`mainKeyword가 자신의 aliases에도 포함된 경우: ${mainKeywordInOwnAliases.length}`, mainKeywordInOwnAliases.map((c) => c.id));
console.log(`\n종합: ${hasIssues ? "이상 데이터 발견 (위 목록 확인)" : "이상 없음"}`);

console.log("\n--- 예상 페이지 후보 개수 (법정동 x 활성 Cluster, 실제 생성 아님) ---");
if (legalDongCount === null) {
  console.log("data/regions/generated/legal-dongs.json 을 찾을 수 없어 계산할 수 없습니다.");
} else {
  console.log(`법정동 unique 수: ${legalDongCount}`);
  console.log(`전체: ${legalDongCount} x ${enabledClusters.length} = ${legalDongCount * enabledClusters.length}`);
  console.log(
    `영어: ${legalDongCount} x ${enabledByLanguage.english.length} = ${legalDongCount * enabledByLanguage.english.length}`
  );
  console.log(
    `일본어: ${legalDongCount} x ${enabledByLanguage.japanese.length} = ${legalDongCount * enabledByLanguage.japanese.length}`
  );
  console.log(
    `중국어: ${legalDongCount} x ${enabledByLanguage.chinese.length} = ${legalDongCount * enabledByLanguage.chinese.length}`
  );
}

if (hasIssues) {
  process.exitCode = 1;
}

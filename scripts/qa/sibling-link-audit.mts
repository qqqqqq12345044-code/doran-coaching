import { getEnabledClusters } from "../../data/seo/keywords.ts";
import { CORE_LOCAL_KEYWORDS } from "../../data/seo/publishBatches.ts";
import { getLocalSiblingKeywords } from "../../lib/seo/localSiblingKeywords.ts";

// production 함수(lib/seo/localSiblingKeywords.ts)를 그대로 호출해 15개
// keyword 전부의 inbound sibling 링크 수를 재계산한다. 이 관계는 지역과
// 무관하게 keyword 조합에만 의존해 항상 동일한 결과가 나온다(97,905개
// 어디를 봐도 같음) — 2026-09-16 Phase 2 내부링크 보강 전/후 비교용.

const inbound: Record<string, string[]> = {};
for (const kw of CORE_LOCAL_KEYWORDS) inbound[kw] = [];

for (const currentKeyword of CORE_LOCAL_KEYWORDS) {
  const cluster = getEnabledClusters().find((c) => c.mainKeyword === currentKeyword)!;
  const siblingKeywords = getLocalSiblingKeywords(cluster);
  for (const sib of siblingKeywords) {
    inbound[sib].push(currentKeyword);
  }
}

let totalOutbound = 0;
let zeroInboundCount = 0;
for (const [kw, sources] of Object.entries(inbound)) {
  console.log(`${kw}: inbound ${sources.length}건 ← [${sources.join(", ")}]`);
  if (sources.length === 0) zeroInboundCount++;
}
for (const kw of CORE_LOCAL_KEYWORDS) {
  const cluster = getEnabledClusters().find((c) => c.mainKeyword === kw)!;
  totalOutbound += getLocalSiblingKeywords(cluster).length;
}
console.log(`\n총 outbound edge 수: ${totalOutbound}(기존 로직과 동일하게 keyword당 최대 2개 유지 여부 확인용)`);
console.log(`inbound 0건인 keyword 수: ${zeroInboundCount} / ${CORE_LOCAL_KEYWORDS.length}`);

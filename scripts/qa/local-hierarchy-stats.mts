import { PUBLISHED_REGIONS_NATIONWIDE, CORE_LOCAL_KEYWORDS } from "../../data/seo/publishBatches.ts";

// lib/seo/localHub.ts와 동일한 인덱싱 로직을 @/ alias 없이(순수 node 실행 위해) 재현.
const sidoSet = new Set<string>();
const sigunguBySido = new Map<string, Set<string>>();
const dongBySidoSigungu = new Map<string, string[]>();

for (const region of PUBLISHED_REGIONS_NATIONWIDE) {
  sidoSet.add(region.sido);
  if (!sigunguBySido.has(region.sido)) sigunguBySido.set(region.sido, new Set());
  sigunguBySido.get(region.sido)!.add(region.sigungu);
  const key = `${region.sido}|${region.sigungu}`;
  if (!dongBySidoSigungu.has(key)) dongBySidoSigungu.set(key, []);
  dongBySidoSigungu.get(key)!.push(region.dong);
}

const sidos = [...sidoSet];
const sigunguCounts = sidos.map((s) => sigunguBySido.get(s)!.size);
const dongCountsPerSigungu: number[] = [];
const sigunguDongPairs: { sido: string; sigungu: string; dongCount: number }[] = [];
for (const sido of sidos) {
  for (const sigungu of sigunguBySido.get(sido)!) {
    const count = dongBySidoSigungu.get(`${sido}|${sigungu}`)!.length;
    dongCountsPerSigungu.push(count);
    sigunguDongPairs.push({ sido, sigungu, dongCount: count });
  }
}

function summarize(arr: number[]) {
  const sorted = [...arr].sort((a, b) => a - b);
  const sum = arr.reduce((a, b) => a + b, 0);
  return {
    count: arr.length,
    sum,
    mean: +(sum / arr.length).toFixed(2),
    median: sorted[Math.floor(sorted.length / 2)],
    min: sorted[0],
    max: sorted[sorted.length - 1],
  };
}

console.log("총 sido:", sidos.length);
const totalSigungu = sigunguCounts.reduce((a, b) => a + b, 0);
console.log("총 sigungu:", totalSigungu);
console.log("총 dong(=PUBLISHED_REGIONS_NATIONWIDE):", PUBLISHED_REGIONS_NATIONWIDE.length);
console.log("sido당 sigungu 수 분포:", JSON.stringify(summarize(sigunguCounts)));
console.log("sigungu당 dong 수 분포:", JSON.stringify(summarize(dongCountsPerSigungu)));
console.log("총 leaf(6527*15):", PUBLISHED_REGIONS_NATIONWIDE.length * CORE_LOCAL_KEYWORDS.length);
console.log("총 hub(local+sido+sigungu+dong):", 1 + sidos.length + totalSigungu + PUBLISHED_REGIONS_NATIONWIDE.length);

const sidoSorted = sidos.map((s) => ({ sido: s, sigunguCount: sigunguBySido.get(s)!.size })).sort((a, b) => b.sigunguCount - a.sigunguCount);
console.log("sigungu 수 상위 5 sido:", JSON.stringify(sidoSorted.slice(0, 5)));

sigunguDongPairs.sort((a, b) => b.dongCount - a.dongCount);
console.log("dong 수 상위 10 sigungu:", JSON.stringify(sigunguDongPairs.slice(0, 10)));
console.log("dong 수 하위 10 sigungu:", JSON.stringify(sigunguDongPairs.slice(-10)));

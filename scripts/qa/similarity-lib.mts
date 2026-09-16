// DORAN 콘텐츠 유사도 감사 전용 공용 유틸리티.
//
// 이 파일은 production 코드가 아니라 1회성 QA 분석 스크립트(scripts/qa/*)에서만
// 쓰는 순수 함수 모음이다. 외부 라이브러리 설치 없이(내장 Node API만 사용) 한글
// 텍스트에 합리적으로 적용 가능한 유사도 지표 2종(Jaccard on character shingle,
// cosine on word term-frequency)을 제공한다.
//
// 왜 형태소 분석기를 쓰지 않는가: 별도 패키지 설치가 필요하고, 이번 감사의
// 목적(템플릿 반복 여부 측정)에는 문자 n-gram shingle 방식으로 충분히 정확한
// 신호를 얻을 수 있다 — 조사가 붙어 단어 경계가 달라져도 n-gram은 겹친다.

export function normalizeText(raw: string): string {
  return raw
    .replace(/\s+/g, " ")
    .replace(/[.,!?"'“”‘’()·\-–—:;/\\[\]{}]/g, "")
    .trim();
}

/** 공백을 제거한 문자 n-gram(기본 2-gram) 집합. 한글 조사 변화에 강건하다. */
export function charShingles(raw: string, n = 2): Set<string> {
  const text = normalizeText(raw).replace(/\s+/g, "");
  const set = new Set<string>();
  for (let i = 0; i + n <= text.length; i++) {
    set.add(text.slice(i, i + n));
  }
  if (set.size === 0 && text.length > 0) set.add(text);
  return set;
}

/** 공백 기준 단어 토큰 빈도 Map. */
export function wordFreq(raw: string): Map<string, number> {
  const text = normalizeText(raw);
  const freq = new Map<string, number>();
  for (const word of text.split(" ")) {
    if (!word) continue;
    freq.set(word, (freq.get(word) ?? 0) + 1);
  }
  return freq;
}

export function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  let inter = 0;
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  for (const x of small) if (large.has(x)) inter++;
  const union = a.size + b.size - inter;
  return union === 0 ? 1 : inter / union;
}

export function cosine(a: Map<string, number>, b: Map<string, number>): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (const v of a.values()) normA += v * v;
  for (const v of b.values()) normB += v * v;
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  for (const [k, v] of small) {
    const otherV = large.get(k);
    if (otherV) dot += v * otherV;
  }
  if (normA === 0 || normB === 0) return normA === normB ? 1 : 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/** 두 텍스트 사이 Jaccard(2-gram)와 cosine(word) 유사도를 함께 계산(교차 확인용). */
export function similarityPair(textA: string, textB: string): { jaccard: number; cosine: number } {
  return {
    jaccard: jaccard(charShingles(textA), charShingles(textB)),
    cosine: cosine(wordFreq(textA), wordFreq(textB)),
  };
}

export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

export interface Bucketed {
  "0-30": number;
  "30-50": number;
  "50-70": number;
  "70-80": number;
  "80-90": number;
  "90-100": number;
}

export function bucketize(values: number[]): Bucketed {
  const b: Bucketed = { "0-30": 0, "30-50": 0, "50-70": 0, "70-80": 0, "80-90": 0, "90-100": 0 };
  for (const v of values) {
    const pct = v * 100;
    if (pct < 30) b["0-30"]++;
    else if (pct < 50) b["30-50"]++;
    else if (pct < 70) b["50-70"]++;
    else if (pct < 80) b["70-80"]++;
    else if (pct < 90) b["80-90"]++;
    else b["90-100"]++;
  }
  return b;
}

export function stats(values: number[]) {
  if (values.length === 0) return { mean: 0, median: 0, min: 0, max: 0, n: 0 };
  return {
    mean: mean(values),
    median: median(values),
    min: Math.min(...values),
    max: Math.max(...values),
    n: values.length,
  };
}

/** 간단한 seedable PRNG(Mulberry32) — 매 실행마다 동일한 표본이 뽑히도록. */
export function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickN<T>(arr: T[], n: number, rng: () => number): T[] {
  if (arr.length <= n) return [...arr];
  const copy = [...arr];
  const result: T[] = [];
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(rng() * copy.length);
    result.push(copy[idx]);
    copy.splice(idx, 1);
  }
  return result;
}

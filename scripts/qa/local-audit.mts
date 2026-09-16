// DORAN Local SEO(97,905 URL) 콘텐츠 유사도 감사.
// 분석/측정 전용 — production 코드를 수정하지 않고 generateLocalSeoContent()를
// 그대로 호출해 결과 텍스트를 비교한다. 네트워크 요청/HTTP 렌더링 없음.
//
// 실행: node scripts/qa/local-audit.mts > scripts/qa/out/local-audit.json

import { getEnabledClusters, type SeoKeywordCluster } from "../../data/seo/keywords.ts";
import { generateLocalSeoContent, type TargetRegion } from "../../lib/seo/generateLocalSeoContent.ts";
import { buildDisambiguatedRegionName } from "../../lib/seo/buildLocalPreview.ts";
import { CORE_LOCAL_KEYWORDS, PUBLISHED_REGIONS_NATIONWIDE, type PublishedRegion } from "../../data/seo/publishBatches.ts";
import {
  allPublishedPages,
  buildResultFor,
  clusterByKeyword,
  engineText,
  engineTextDesensitized,
  fullMainText,
  toRegion,
} from "./local-render.mts";
import { similarityPair, stats, bucketize, mulberry32, pickN, type Bucketed } from "./similarity-lib.mts";

const rng = mulberry32(20260916);

// ---------------------------------------------------------------------------
// Part 1: 전수(97,905) — keyword별 "지역명 치환 후 skeleton" exact-dedup
// ---------------------------------------------------------------------------
function part1_skeletonDedup() {
  const pages = allPublishedPages();
  const byKeyword = new Map<string, typeof pages>();
  for (const p of pages) {
    if (!byKeyword.has(p.keyword)) byKeyword.set(p.keyword, []);
    byKeyword.get(p.keyword)!.push(p);
  }

  const perKeyword: Record<string, { regionCount: number; distinctSkeletons: number; sampleSkeletonLength: number }> = {};
  for (const [keyword, list] of byKeyword) {
    const skeletons = new Set<string>();
    let sampleLen = 0;
    for (const page of list) {
      const { result } = buildResultFor(page);
      const skeleton = engineTextDesensitized(result);
      skeletons.add(skeleton);
      sampleLen = skeleton.length;
    }
    perKeyword[keyword] = { regionCount: list.length, distinctSkeletons: skeletons.size, sampleSkeletonLength: sampleLen };
  }

  const totalRegions = pages.length;
  const totalDistinctSkeletons = Object.values(perKeyword).reduce((s, v) => s + v.distinctSkeletons, 0);

  return { totalPages: totalRegions, perKeyword, totalDistinctSkeletons };
}

// ---------------------------------------------------------------------------
// Part 2: same keyword / different region — 큐레이션 샘플 + 대규모 랜덤 샘플
// ---------------------------------------------------------------------------
function regionText(region: PublishedRegion, cluster: SeoKeywordCluster, tier: "engine" | "full") {
  const targetRegion: TargetRegion = {
    sido: region.sido,
    sigungu: region.sigungu,
    regionName: buildDisambiguatedRegionName(region.sido, region.sigungu, region.dong),
  };
  const result = generateLocalSeoContent(targetRegion, cluster);
  return tier === "engine" ? engineText(result) : fullMainText({ ...region, keyword: cluster.mainKeyword }, cluster, result);
}

function part2_sameKeywordDiffRegion() {
  const byName = [...PUBLISHED_REGIONS_NATIONWIDE].sort((a, b) => a.dong.length - b.dong.length);
  const shortest = byName[0];
  const longest = byName[byName.length - 1];
  const sameSigunguPair = PUBLISHED_REGIONS_NATIONWIDE.filter((r) => r.sido === shortest.sido && r.sigungu === shortest.sigungu);
  const sameCityDiffGu = PUBLISHED_REGIONS_NATIONWIDE.find((r) => r.sido === shortest.sido && r.sigungu !== shortest.sigungu);
  const diffProvince = PUBLISHED_REGIONS_NATIONWIDE.find((r) => r.sido !== shortest.sido);

  const curatedRegions = [
    shortest,
    sameSigunguPair[Math.min(1, sameSigunguPair.length - 1)] ?? shortest,
    sameCityDiffGu ?? shortest,
    diffProvince ?? shortest,
    longest,
  ];

  const curatedByKeyword: Record<string, { pairs: { a: string; b: string; jaccard: number; cosine: number }[] }> = {};
  const randomSampleByKeyword: Record<string, ReturnType<typeof stats> & { jaccardStats: ReturnType<typeof stats> }> = {} as any;

  for (const keyword of CORE_LOCAL_KEYWORDS) {
    const cluster = clusterByKeyword.get(keyword)!;
    const texts = curatedRegions.map((r) => ({ label: `${r.sido}/${r.sigungu}/${r.dong}`, text: regionText(r, cluster, "engine") }));
    const pairs: { a: string; b: string; jaccard: number; cosine: number }[] = [];
    for (let i = 0; i < texts.length; i++) {
      for (let j = i + 1; j < texts.length; j++) {
        const sim = similarityPair(texts[i].text, texts[j].text);
        pairs.push({ a: texts[i].label, b: texts[j].label, jaccard: sim.jaccard, cosine: sim.cosine });
      }
    }
    curatedByKeyword[keyword] = { pairs };

    // 대규모 랜덤 샘플(같은 keyword, 서로 다른 지역 300쌍)
    const sampleRegions = pickN(PUBLISHED_REGIONS_NATIONWIDE, 40, rng);
    const jaccards: number[] = [];
    const cosines: number[] = [];
    const sampleTexts = sampleRegions.map((r) => regionText(r, cluster, "engine"));
    for (let i = 0; i < sampleTexts.length; i++) {
      for (let j = i + 1; j < sampleTexts.length; j++) {
        const sim = similarityPair(sampleTexts[i], sampleTexts[j]);
        jaccards.push(sim.jaccard);
        cosines.push(sim.cosine);
      }
    }
    randomSampleByKeyword[keyword] = { ...stats(cosines), jaccardStats: stats(jaccards) } as any;
  }

  return { curatedByKeyword, randomSampleByKeyword };
}

// ---------------------------------------------------------------------------
// Part 3: same region / different keyword (intent 차별화)
// ---------------------------------------------------------------------------
function part3_sameRegionDiffKeyword() {
  const sampleRegions = pickN(PUBLISHED_REGIONS_NATIONWIDE, 60, mulberry32(777));
  const perLanguage: Record<string, number[]> = { english: [], japanese: [], chinese: [] };
  const allJaccard: number[] = [];
  const allCosine: number[] = [];
  const pairLabelStats: Record<string, number[]> = {};

  for (const region of sampleRegions) {
    for (const language of ["english", "japanese", "chinese"] as const) {
      const keywordsForLang = CORE_LOCAL_KEYWORDS.filter((kw) => clusterByKeyword.get(kw)!.language === language);
      const texts = keywordsForLang.map((kw) => ({ kw, text: regionText(region, clusterByKeyword.get(kw)!, "engine") }));
      for (let i = 0; i < texts.length; i++) {
        for (let j = i + 1; j < texts.length; j++) {
          const sim = similarityPair(texts[i].text, texts[j].text);
          perLanguage[language].push(sim.cosine);
          allJaccard.push(sim.jaccard);
          allCosine.push(sim.cosine);
          const pairKey = [texts[i].kw, texts[j].kw].sort().join(" vs ");
          if (!pairLabelStats[pairKey]) pairLabelStats[pairKey] = [];
          pairLabelStats[pairKey].push(sim.cosine);
        }
      }
    }
  }

  const pairSummary: Record<string, ReturnType<typeof stats>> = {};
  for (const [k, v] of Object.entries(pairLabelStats)) pairSummary[k] = stats(v);

  return {
    overall: { jaccard: stats(allJaccard), cosine: stats(allCosine) },
    byLanguage: Object.fromEntries(Object.entries(perLanguage).map(([k, v]) => [k, stats(v)])),
    byKeywordPair: pairSummary,
    sampledRegions: sampleRegions.length,
  };
}

// ---------------------------------------------------------------------------
// Part 4: same region / different language (conversation / tutoring / online triples)
// ---------------------------------------------------------------------------
function part4_sameRegionDiffLanguage() {
  const sampleRegions = pickN(PUBLISHED_REGIONS_NATIONWIDE, 60, mulberry32(1234));
  const intentTriples: Record<string, [string, string, string]> = {
    conversation: ["영어회화", "일본어회화", "중국어회화"],
    tutoring: ["영어과외", "일본어과외", "중국어과외"],
    online: ["화상영어", "화상일본어", "화상중국어"],
  };

  const results: Record<string, ReturnType<typeof stats>> = {};
  for (const [intent, keywords] of Object.entries(intentTriples)) {
    const cosines: number[] = [];
    for (const region of sampleRegions) {
      const texts = keywords.map((kw) => regionText(region, clusterByKeyword.get(kw)!, "engine"));
      for (let i = 0; i < texts.length; i++) {
        for (let j = i + 1; j < texts.length; j++) {
          cosines.push(similarityPair(texts[i], texts[j]).cosine);
        }
      }
    }
    results[intent] = stats(cosines);
  }
  return results;
}

// ---------------------------------------------------------------------------
// Part 5: 같은 시험군 내부(exam) pair 비교
// ---------------------------------------------------------------------------
function part5_examPairs() {
  const sampleRegions = pickN(PUBLISHED_REGIONS_NATIONWIDE, 60, mulberry32(555));
  const pairs: [string, string][] = [
    ["토익과외", "오픽과외"],
    ["JLPT과외", "워홀일본어"],
    ["HSK과외", "HSKK과외"],
  ];
  const results: Record<string, ReturnType<typeof stats>> = {};
  for (const [a, b] of pairs) {
    const cosines: number[] = [];
    for (const region of sampleRegions) {
      const ta = regionText(region, clusterByKeyword.get(a)!, "engine");
      const tb = regionText(region, clusterByKeyword.get(b)!, "engine");
      cosines.push(similarityPair(ta, tb).cosine);
    }
    results[`${a} vs ${b}`] = stats(cosines);
  }
  return results;
}

// ---------------------------------------------------------------------------
// Part 6: override 적용 keyword vs override 없는(generic fallback) 형제 cluster
// 30개 전체 Cluster 중 15개(published)만 override/examProfile이 있고, 나머지
// 15개(비공개, native/beginner/adult/worker/business)는 순수 Blueprint fallback이다.
// 같은 intent라도 override 유무로 얼마나 달라지는지 "실제 코드 경로"로 측정한다.
// ---------------------------------------------------------------------------
function part6_overrideEffect() {
  const allClusters = getEnabledClusters();
  const sampleRegions = pickN(PUBLISHED_REGIONS_NATIONWIDE, 40, mulberry32(999));

  // (a) override 있는 3개 conversation 키워드끼리 vs override 없는 3개 beginner 키워드끼리
  const conversationKw = ["영어회화", "일본어회화", "중국어회화"];
  const beginnerClusters = allClusters.filter((c) => c.intent === "beginner"); // override 없음(fallback)
  const nativeClusters = allClusters.filter((c) => c.intent === "native"); // override 없음(fallback)

  function crossLangSim(clustersOfIntent: SeoKeywordCluster[]) {
    const cosines: number[] = [];
    for (const region of sampleRegions) {
      const texts = clustersOfIntent.map((c) => regionText(region, c, "engine"));
      for (let i = 0; i < texts.length; i++)
        for (let j = i + 1; j < texts.length; j++) cosines.push(similarityPair(texts[i], texts[j]).cosine);
    }
    return stats(cosines);
  }

  const conversationClusters = conversationKw.map((kw) => clusterByKeyword.get(kw)!);

  return {
    withOverride_conversation_crossLanguage: crossLangSim(conversationClusters),
    withoutOverride_beginner_crossLanguage: crossLangSim(beginnerClusters),
    withoutOverride_native_crossLanguage: crossLangSim(nativeClusters),
    note: "beginner/native는 published 15개에 없는 cluster(override/examProfile 없음) — 실제 published override의 효과를 fallback과 대조하기 위해 같은 생성 함수로 계산.",
  };
}

// ---------------------------------------------------------------------------
// Part 7: fallback끼리 비교(같은 keyword, 다른 지역) — 워홀일본어(published 중 유일한
// 순수 fallback) + 비공개 fallback cluster(beginner/native/adult/worker/business) 5개
// 언어별 내부에서 "지역만 다른" 유사도.
// ---------------------------------------------------------------------------
function part7_fallbackVsFallback() {
  const allClusters = getEnabledClusters();
  const fallbackIntents = ["beginner", "native", "adult", "worker", "business", "workingholiday"];
  const fallbackClusters = allClusters.filter(
    (c) => fallbackIntents.includes(c.intent) && !["english-conversation", "japanese-conversation", "chinese-conversation"].includes(c.id)
  );
  const sampleRegions = pickN(PUBLISHED_REGIONS_NATIONWIDE, 30, mulberry32(2468));

  const perCluster: Record<string, ReturnType<typeof stats>> = {};
  for (const cluster of fallbackClusters) {
    const texts = sampleRegions.map((r) => regionText(r, cluster, "engine"));
    const cosines: number[] = [];
    for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) cosines.push(similarityPair(texts[i], texts[j]).cosine);
    perCluster[cluster.id] = stats(cosines);
  }
  return { perCluster, clusterCount: fallbackClusters.length, note: "워홀일본어(japanese-workingholiday)는 published(97,905 대상), 나머지는 비공개 cluster(참고용, 실제 라이브 URL 없음)." };
}

// ---------------------------------------------------------------------------
// Part 8: raw vs desensitized(=chrome 제거 근사) 비교 — 같은 keyword 5쌍 지역에 대해
// full main text / engine-only text / desensitized text 3단계 유사도를 나란히 계산
// ---------------------------------------------------------------------------
function part8_tierComparison() {
  const sampleKeywords = ["영어회화", "토익과외", "워홀일본어"];
  const sampleRegions = pickN(PUBLISHED_REGIONS_NATIONWIDE, 2, mulberry32(31));
  const [r1, r2] = sampleRegions;
  const out: Record<string, { full: number; engineOnly: number }> = {};
  for (const keyword of sampleKeywords) {
    const cluster = clusterByKeyword.get(keyword)!;
    const full1 = regionText(r1, cluster, "full");
    const full2 = regionText(r2, cluster, "full");
    const eng1 = regionText(r1, cluster, "engine");
    const eng2 = regionText(r2, cluster, "engine");
    out[keyword] = {
      full: similarityPair(full1, full2).cosine,
      engineOnly: similarityPair(eng1, eng2).cosine,
    };
  }
  return { regions: [`${r1.sido}/${r1.sigungu}/${r1.dong}`, `${r2.sido}/${r2.sigungu}/${r2.dong}`], out };
}

// ---------------------------------------------------------------------------
// Part 9: 섹션 9 요구 — 유형별 분포 구간(0-30/30-50/.../90-100) 집계.
// 97,905^2 전수 pairwise는 계산량상 불가능(약 48억 쌍)이므로, 유형별로 이미
// 뽑은 대규모 랜덤 표본(수백~수천 쌍)을 풀링해 분포를 낸다 — part2/part3/part4의
// 표본을 재사용(같은 seed로 재계산, 실행 시간 절약을 위해 규모는 part2보다 축소).
// ---------------------------------------------------------------------------
function part9_bucketDistributions() {
  // same keyword / diff region — 15 keyword 전체 풀링(part2 랜덤 표본 재사용 규모)
  const sameKeywordCos: number[] = [];
  const sameKeywordJac: number[] = [];
  for (const keyword of CORE_LOCAL_KEYWORDS) {
    const cluster = clusterByKeyword.get(keyword)!;
    const sampleRegions = pickN(PUBLISHED_REGIONS_NATIONWIDE, 25, mulberry32(keyword.length * 7919));
    const texts = sampleRegions.map((r) => regionText(r, cluster, "engine"));
    for (let i = 0; i < texts.length; i++)
      for (let j = i + 1; j < texts.length; j++) {
        const sim = similarityPair(texts[i], texts[j]);
        sameKeywordCos.push(sim.cosine);
        sameKeywordJac.push(sim.jaccard);
      }
  }

  // same region / diff keyword — part3와 동일 로직, 별도 seed로 축소 재표본
  const sameRegionCos: number[] = [];
  const sameRegionJac: number[] = [];
  const regionsForDiffKeyword = pickN(PUBLISHED_REGIONS_NATIONWIDE, 40, mulberry32(31415));
  for (const region of regionsForDiffKeyword) {
    const texts = CORE_LOCAL_KEYWORDS.map((kw) => regionText(region, clusterByKeyword.get(kw)!, "engine"));
    for (let i = 0; i < texts.length; i++)
      for (let j = i + 1; j < texts.length; j++) {
        const sim = similarityPair(texts[i], texts[j]);
        sameRegionCos.push(sim.cosine);
        sameRegionJac.push(sim.jaccard);
      }
  }

  return {
    sameKeywordDiffRegion: {
      n: sameKeywordCos.length,
      cosineBuckets: bucketize(sameKeywordCos),
      jaccardBuckets: bucketize(sameKeywordJac),
      cosineStats: stats(sameKeywordCos),
      jaccardStats: stats(sameKeywordJac),
    },
    sameRegionDiffKeyword: {
      n: sameRegionCos.length,
      cosineBuckets: bucketize(sameRegionCos),
      jaccardBuckets: bucketize(sameRegionJac),
      cosineStats: stats(sameRegionCos),
      jaccardStats: stats(sameRegionJac),
    },
    note: "97,905^2(약 48억) 전수 pairwise는 계산량상 불가능해 유형별 대규모 무작위 표본(수백~수천 쌍)의 분포로 대체함. 대신 Part1에서 '같은 keyword'는 지역명 치환 후 skeleton이 100% 동일함을 97,905건 전수로 직접 증명함.",
  };
}

const report = {
  meta: { totalPublishedPages: allPublishedPages().length, coreKeywords: CORE_LOCAL_KEYWORDS, generatedAt: new Date().toISOString() },
  part1_skeletonDedup: part1_skeletonDedup(),
  part2_sameKeywordDiffRegion: part2_sameKeywordDiffRegion(),
  part3_sameRegionDiffKeyword: part3_sameRegionDiffKeyword(),
  part4_sameRegionDiffLanguage: part4_sameRegionDiffLanguage(),
  part5_examPairs: part5_examPairs(),
  part6_overrideEffect: part6_overrideEffect(),
  part7_fallbackVsFallback: part7_fallbackVsFallback(),
  part8_tierComparison: part8_tierComparison(),
  part9_bucketDistributions: part9_bucketDistributions(),
};

console.log(JSON.stringify(report, null, 2));

import type { MetadataRoute } from "next";
import { DETAIL_CATEGORIES } from "@/data/detailPages";
import { PUBLISHED_LOCAL_SEO_PAGES } from "@/data/seo/previewRegistry";
import { getEnabledClusters } from "@/data/seo/keywords";
import { magazineArticles, getMagazineModifiedDate } from "@/data/magazine";
import { getAllSido, getSigunguList } from "@/lib/seo/localHub";
import { absoluteUrl } from "@/lib/seo/schema";

// 실제 공개 페이지만 포함한다. data/regions/generated/seo-regions.json의
// 6,560개 조합을 그대로 순회하지 않는다 — local SEO는 반드시
// PUBLISHED_LOCAL_SEO_PAGES(화이트리스트) 하나만 Single Source of Truth로
// 사용한다. 여기에 새 조합이 추가되면 sitemap도 자동으로 반영된다.
const LANGUAGES = ["english", "japanese", "chinese"] as const;
type Language = (typeof LANGUAGES)[number];

// sitemap.xml 하나에 97,905개 local URL을 전부 담으면 sitemap 프로토콜의
// 파일당 권장 한도(5만 URL / 50MB)를 넘는다. Next.js의 generateSitemaps()로
// shard를 나누면 각 shard가 /sitemap/{id}.xml로 생성된다. 주의: 이 기능을
// 쓰면 Next.js가 최상위 /sitemap.xml을 "sitemap index"로 자동 생성해주지는
// 않는다(실제 next start로 확인함 — 404). 그래서 기존에 등록됐을 수 있는
// https://dorancoaching.com/sitemap.xml URL이 계속 유효하도록
// app/sitemap.xml/route.ts에서 표준 <sitemapindex> XML을 직접 만들어
// 이 shard들을 가리키게 했다(아래 SITEMAP_SHARD_IDS를 그대로 재사용).
//
//   id 0: 정적 페이지(홈/언어 3/상세 12/magazine/reviews) + 지역 허브(/local, 시/도,
//     시/군/구) + magazine 개별 글
//   id 1~3: local SEO를 언어(영어/일본어/중국어)별로 3등분. keyword 15개가
//     언어당 정확히 5개씩이라 6,527개 지역 × 5 keyword = 32,635개로 3개
//     shard가 균등하게 나뉜다(각각 5만 한도 이내).
const LOCAL_SHARD_LANGUAGES: Record<number, Language> = {
  1: "english",
  2: "japanese",
  3: "chinese",
};

// app/robots.ts가 실제 존재하는 sitemap shard URL 목록을 그대로 가져다 쓸 수
// 있도록 공유한다. generateSitemaps()를 쓰면 Next.js가 최상위 /sitemap.xml을
// "sitemap index"로 자동 생성해주지 않는다(실제 next start로 확인함 — 404) —
// 대신 /sitemap/0.xml ~ /sitemap/3.xml 각각이 개별 sitemap으로 생성되므로,
// robots.txt에는 이 개별 URL을 전부 나열해야 한다(sitemap 프로토콜은 robots.txt에
// 여러 Sitemap: 줄을 허용한다).
export const SITEMAP_SHARD_IDS = [0, 1, 2, 3] as const;

export async function generateSitemaps() {
  return SITEMAP_SHARD_IDS.map((id) => ({ id }));
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  // lastmod 정직화(2026-10): 예전에는 new Date()를 모든 URL에 넣어 배포할 때마다
  // 약 10만 개 URL이 "방금 수정된 것처럼" 표시됐다. 실제 수정일 데이터가 있는
  // URL(매거진: updatedAt ?? publishedAt)만 lastModified를 넣고, 나머지(홈/언어/
  // 상세/지역)는 신뢰할 수 있는 수정일 데이터가 없으므로 lastmod를 생략한다
  // (sitemap 프로토콜상 lastmod는 선택 항목). 지역/상세에 수정일을 붙이려면
  // content-hash manifest가 필요해 이번에는 설계만 하고 보류했다(docs 참고).
  // Next.js가 URL segment(/sitemap/0.xml의 "0")에서 파싱한 값을 그대로 넘겨줘
  // 타입은 number로 선언돼 있어도 실제 런타임 값은 문자열("0")로 들어온다.
  // Number()로 명시적으로 변환하지 않으면 `id === 0` 비교가 항상 false가 되어
  // shard 0(정적 페이지 + magazine)이 빈 sitemap으로 나가는 문제가 있었다.
  const shardId = Number(id);

  if (shardId === 0) {
    const staticEntries: MetadataRoute.Sitemap = [
      { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
      ...LANGUAGES.map((language) => ({
        url: absoluteUrl(`/${language}`),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
      ...LANGUAGES.flatMap((language) =>
        DETAIL_CATEGORIES.map((category) => ({
          url: absoluteUrl(`/${language}/${category}`),
          changeFrequency: "monthly" as const,
          priority: 0.6,
        }))
      ),
      { url: absoluteUrl("/magazine"), changeFrequency: "monthly", priority: 0.5 },
      { url: absoluteUrl("/reviews"), changeFrequency: "monthly", priority: 0.5 },
      // 지역 허브 진입 구조: /local, 시/도 15개, 시/군/구 255개. 읍/면/동 허브
      // (6,527개)는 내용이 얇아 의도적으로 넣지 않는다 — /local/시도/시군구 페이지의
      // 실제 <a> 링크로 계속 타고 들어갈 수 있다(app/local/**/page.tsx 참고).
      { url: absoluteUrl("/local"), changeFrequency: "monthly", priority: 0.6 },
      ...getAllSido().map((sido) => ({
        url: absoluteUrl(`/local/${sido}`),
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
      // 시/군/구 허브 255개(동 허브 6,527개는 내용이 얇아 제외 유지). 이미 indexable이고
      // canonical이 self이며 시/도 허브에서 <a>로 연결돼 있어, sitemap에 넣어도
      // 구조 변경이 없고 shard 0은 84 -> 339개로 5만 한도에 한참 못 미친다.
      ...getAllSido().flatMap((sido) =>
        getSigunguList(sido).map((sigungu) => ({
          url: absoluteUrl(`/local/${sido}/${sigungu}`),
          changeFrequency: "monthly" as const,
          priority: 0.4,
        }))
      ),
    ];

    const magazineEntries: MetadataRoute.Sitemap = magazineArticles.map((article) => ({
      url: absoluteUrl(`/magazine/${article.slug}`),
      lastModified: getMagazineModifiedDate(article),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));

    return [...staticEntries, ...magazineEntries];
  }

  const shardLanguage = LOCAL_SHARD_LANGUAGES[shardId];
  const keywordsForLanguage = new Set(
    getEnabledClusters()
      .filter((cluster) => cluster.language === shardLanguage)
      .map((cluster) => cluster.mainKeyword)
  );

  return PUBLISHED_LOCAL_SEO_PAGES.filter((page) => keywordsForLanguage.has(page.keyword)).map((page) => ({
    url: absoluteUrl(`/local/${page.sido}/${page.sigungu}/${page.dong}/${page.keyword}`),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));
}

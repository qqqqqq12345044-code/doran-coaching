import type { MetadataRoute } from "next";
import { DETAIL_CATEGORIES } from "@/data/detailPages";
import { PUBLISHED_LOCAL_SEO_PAGES } from "@/data/seo/previewRegistry";
import { getEnabledClusters } from "@/data/seo/keywords";
import { getAllMagazineSlugs } from "@/data/magazine";
import { getAllSido } from "@/lib/seo/localHub";
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
//   id 0: 정적 페이지(홈/언어 3/상세 12/magazine/reviews) + magazine 개별 글
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
  // 빌드 시점 1회만 계산해 모든 항목에 동일하게 사용한다. 페이지마다
  // 임의로 다른 가짜 날짜를 만들지 않는다.
  const lastModified = new Date();

  // Next.js가 URL segment(/sitemap/0.xml의 "0")에서 파싱한 값을 그대로 넘겨줘
  // 타입은 number로 선언돼 있어도 실제 런타임 값은 문자열("0")로 들어온다.
  // Number()로 명시적으로 변환하지 않으면 `id === 0` 비교가 항상 false가 되어
  // shard 0(정적 페이지 + magazine)이 빈 sitemap으로 나가는 문제가 있었다.
  const shardId = Number(id);

  if (shardId === 0) {
    const staticEntries: MetadataRoute.Sitemap = [
      { url: absoluteUrl("/"), lastModified, changeFrequency: "weekly", priority: 1 },
      ...LANGUAGES.map((language) => ({
        url: absoluteUrl(`/${language}`),
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
      ...LANGUAGES.flatMap((language) =>
        DETAIL_CATEGORIES.map((category) => ({
          url: absoluteUrl(`/${language}/${category}`),
          lastModified,
          changeFrequency: "monthly" as const,
          priority: 0.6,
        }))
      ),
      { url: absoluteUrl("/magazine"), lastModified, changeFrequency: "monthly", priority: 0.5 },
      { url: absoluteUrl("/reviews"), lastModified, changeFrequency: "monthly", priority: 0.5 },
      // 지역 허브 진입 구조. 시/군/구(255개)·읍/면/동(6,527개) browse 페이지는
      // 여기 넣지 않는다 — /local과 시/도 페이지의 실제 <a> 링크로 계속
      // 타고 들어갈 수 있어 crawlability에 문제가 없고(app/local/**/page.tsx
      // 참고), shard 0을 "정적 상위 페이지" 목록으로 가볍게 유지하기 위함이다.
      { url: absoluteUrl("/local"), lastModified, changeFrequency: "monthly", priority: 0.6 },
      ...getAllSido().map((sido) => ({
        url: absoluteUrl(`/local/${sido}`),
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
    ];

    const magazineEntries: MetadataRoute.Sitemap = getAllMagazineSlugs().map((slug) => ({
      url: absoluteUrl(`/magazine/${slug}`),
      lastModified,
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
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));
}

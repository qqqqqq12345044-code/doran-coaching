import type { MetadataRoute } from "next";
import { DETAIL_CATEGORIES } from "@/data/detailPages";
import { PUBLISHED_LOCAL_SEO_PAGES } from "@/data/seo/previewRegistry";
import { getAllMagazineSlugs } from "@/data/magazine";
import { absoluteUrl } from "@/lib/seo/schema";

// 실제 공개 페이지만 포함한다. data/regions/generated/seo-regions.json의
// 6,560개 조합은 절대 순회하지 않는다 — local SEO는 반드시
// PUBLISHED_LOCAL_SEO_PAGES(화이트리스트) 하나만 Single Source of Truth로
// 사용한다. 여기에 새 조합이 추가되면 sitemap도 자동으로 반영된다.
const LANGUAGES = ["english", "japanese", "chinese"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  // 빌드 시점 1회만 계산해 모든 항목에 동일하게 사용한다. 페이지마다
  // 임의로 다른 가짜 날짜를 만들지 않는다.
  const lastModified = new Date();

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
  ];

  const localEntries: MetadataRoute.Sitemap = PUBLISHED_LOCAL_SEO_PAGES.map((page) => ({
    url: absoluteUrl(`/local/${page.sido}/${page.sigungu}/${page.dong}/${page.keyword}`),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const magazineEntries: MetadataRoute.Sitemap = getAllMagazineSlugs().map((slug) => ({
    url: absoluteUrl(`/magazine/${slug}`),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticEntries, ...localEntries, ...magazineEntries];
}

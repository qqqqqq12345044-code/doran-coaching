import { SITE_URL } from "@/lib/seo/schema";
import { SITEMAP_SHARD_IDS } from "../sitemap";

// app/sitemap.ts가 generateSitemaps()로 shard(/sitemap/0.xml ~ /sitemap/3.xml)를
// 나누면서 Next.js 관례상 최상위 /sitemap.xml 자체는 더 이상 자동 생성되지
// 않는다(실제 배포로 확인: generateSitemaps 사용 시 /sitemap.xml은 404).
//
// 하지만 지금까지 Google Search Console / 네이버 서치어드바이저에는
// https://dorancoaching.com/sitemap.xml 이 그대로 등록돼 있었을 수 있다
// ([GIT / 배포], [SEO] 원칙: "기존 Google/Naver 등록 URL이 깨지지 않는 방식
// 우선"). 그래서 /sitemap.xml 자체를 없애는 대신, 이 경로에 표준
// <sitemapindex> 문서를 직접 만들어 각 shard(/sitemap/0.xml ~ 3.xml)를
// 가리키게 한다 — 검색엔진 입장에서는 이 URL이 계속 유효한 sitemap
// 진입점으로 남는다. robots.ts도 이 목록과 동일한 SITEMAP_SHARD_IDS를
// 그대로 나열해 이중으로 안전장치를 둔다.
export function GET() {
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    SITEMAP_SHARD_IDS.map(
      (id) => `<sitemap><loc>${SITE_URL}/sitemap/${id}.xml</loc></sitemap>`
    ).join("\n") +
    `\n</sitemapindex>`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml" },
  });
}

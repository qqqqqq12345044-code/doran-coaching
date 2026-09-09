import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/schema";
import { SITEMAP_SHARD_IDS } from "./sitemap";

// 현재 공개된 모든 페이지(/english,/japanese,/chinese,/local 포함)는 실제
// 서비스 콘텐츠이므로 과도한 Disallow를 두지 않는다. 화이트리스트 밖 local
// 조합은 app/local/.../page.tsx의 findLocalSeoPreview() whitelist 검사 +
// notFound()로 이미 404 처리되므로(dynamicParams=true라도 whitelist 밖은
// 그대로 404) robots에서 별도 패턴을 차단할 필요가 없다.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    // app/sitemap.ts가 generateSitemaps()로 shard를 나누면서 최상위
    // /sitemap.xml은 더 이상 존재하지 않는다(실제 배포 확인: 404) — 대신
    // /sitemap/0.xml ~ /sitemap/3.xml 개별 shard를 전부 나열한다. sitemap
    // 프로토콜은 robots.txt에 여러 Sitemap: 줄을 허용하므로 이 방식이
    // 표준을 벗어나지 않는다.
    sitemap: SITEMAP_SHARD_IDS.map((id) => `${SITE_URL}/sitemap/${id}.xml`),
    host: SITE_URL,
  };
}

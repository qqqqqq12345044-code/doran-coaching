import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/schema";

// 현재 공개된 모든 페이지(/english,/japanese,/chinese,/local 포함)는 실제
// 서비스 콘텐츠이므로 과도한 Disallow를 두지 않는다. 화이트리스트 밖 local
// 조합은 app/local/.../page.tsx의 dynamicParams=false + notFound()로 이미
// 404 처리되므로 robots에서 별도 패턴을 차단할 필요가 없다.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

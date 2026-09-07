import { brand } from "../../data/brand.ts";

// 기술 SEO(robots/sitemap/schema)에서 공통으로 쓰는 절대 도메인.
// app/layout.tsx의 siteUrl, app/local/.../page.tsx의 SITE_URL과 동일한 값이다.
export const SITE_URL = "https://dorancoaching.com";

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

// schema.org JSON-LD Builder 모음. 여기 있는 함수들은 값만 조합할 뿐 새로운
// 사실(법인명/주소/전화번호/통계/후기/가격 등)을 만들지 않는다. 실제로
// 존재하지 않는 정보는 인자로 넘기지 않으면 그대로 비어 있는 채로 유지된다.

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brand.brandLabel,
    url: SITE_URL,
    description: brand.seoDescription,
  };
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.brandLabel,
    url: SITE_URL,
    // app/apple-icon.tsx가 실제로 생성/서빙하는 브랜드 심볼 이미지. 별도 로고
    // 파일을 새로 만들지 않고 이미 존재하는 아이콘 라우트를 그대로 가리킨다.
    logo: absoluteUrl("/apple-icon"),
    description: brand.seoDescription,
  };
}

export interface BreadcrumbSchemaItem {
  label: string;
  /** 실제 화면 Breadcrumb과 동일하게, 링크가 없는 항목은 href를 비운다. */
  href?: string;
}

/** 화면에 실제로 보이는 Breadcrumb items 배열을 그대로 넘겨 JSON-LD로
 *  변환한다. 화면에 없는 항목을 여기서 추가로 만들지 않는다. */
export function buildBreadcrumbListSchema(items: BreadcrumbSchemaItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}

/** 화면에 실제로 렌더링되는 FAQ 배열(질문/답변을 새로 만들지 않음)을 그대로
 *  FAQPage schema로 변환한다. */
export function buildFaqPageSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** 가격/기간/수료증처럼 실제 값이 없는 필드는 넣지 않는다(name/description/
 *  provider만 정확히 구성 가능할 때만 사용). */
export function buildCourseSchema(params: { name: string; description: string; url: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: params.name,
    description: params.description,
    url: absoluteUrl(params.url),
    provider: {
      "@type": "Organization",
      name: brand.brandLabel,
      sameAs: SITE_URL,
    },
  };
}

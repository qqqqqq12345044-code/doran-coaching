import { magazineArticles } from "@/data/magazine";
import { brand } from "@/data/brand";
import { SITE_URL, absoluteUrl } from "@/lib/seo/schema";

// DORAN Magazine(50개) 전용 RSS 2.0 feed. Local SEO(97,905)/Detail(12)/지역
// 페이지/상담 페이지는 의도적으로 포함하지 않는다 — Google Search Console /
// 네이버 서치어드바이저에 "새 매거진 글이 올라왔다"는 신호만 주기 위한
// 용도이며, sitemap(app/sitemap.ts)을 대체하지 않는다. 새 콘텐츠를 만들지
// 않고 data/magazine의 기존 필드(h1/cardSummary/directAnswer/publishedAt)만
// 그대로 조합한다.
//
// 정적 데이터만 사용하는 결정적 응답이라 force-static으로 서빙한다(요청마다
// 다시 계산하지 않음) — app/local/region-search/route.ts와 동일한 패턴.
export const dynamic = "force-static";

const RSS_URL = `${SITE_URL}/rss.xml`;
const CHANNEL_DESCRIPTION =
  "회화·자격증·시험 준비를 하며 실제로 궁금한 질문에 답하는 도란 매거진. 영어·일본어·중국어 학습법과 시험 정보를 모았습니다.";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// data/magazine의 publishedAt은 "YYYY-MM-DD" 실제 게시일이다(창작하지 않음).
// RSS 2.0 pubDate는 RFC 822 형식을 요구하므로 변환만 하고, 값이 없거나
// 파싱 불가능하면 그 항목의 pubDate를 아예 생략한다(날짜 창작 금지).
function toRfc822(dateIso: string): string | null {
  if (!dateIso) return null;
  const date = new Date(`${dateIso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return null;
  return date.toUTCString();
}

export function GET() {
  const sortedArticles = [...magazineArticles].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : a.publishedAt > b.publishedAt ? -1 : 0));

  const itemsXml = sortedArticles
    .map((article) => {
      const url = absoluteUrl(`/magazine/${article.slug}`);
      const description = `${article.cardSummary} ${article.directAnswer.answer}`;
      const pubDate = toRfc822(article.publishedAt);

      return (
        `  <item>\n` +
        `    <title>${escapeXml(article.h1)}</title>\n` +
        `    <link>${escapeXml(url)}</link>\n` +
        `    <guid isPermaLink="true">${escapeXml(url)}</guid>\n` +
        `    <description>${escapeXml(description)}</description>\n` +
        (pubDate ? `    <pubDate>${pubDate}</pubDate>\n` : "") +
        `  </item>`
      );
    })
    .join("\n");

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n` +
    `<channel>\n` +
    `  <title>${escapeXml(brand.brandLabel)}</title>\n` +
    `  <link>${SITE_URL}</link>\n` +
    `  <description>${escapeXml(CHANNEL_DESCRIPTION)}</description>\n` +
    `  <language>ko-KR</language>\n` +
    `  <atom:link href="${RSS_URL}" rel="self" type="application/rss+xml" />\n` +
    itemsXml +
    `\n</channel>\n` +
    `</rss>\n`;

  return new Response(body, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}

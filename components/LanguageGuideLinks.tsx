import Link from "next/link";
import RelatedLinks from "@/components/detail/RelatedLinks";
import { getLandingGuideArticles } from "@/data/seo/relatedMagazine";

type GuideLanguage = "english" | "japanese" | "chinese";

const ACCENT_TEXT: Record<GuideLanguage, string> = {
  english: "text-english",
  japanese: "text-japanese",
  chinese: "text-chinese",
};

// 언어별 종합 랜딩(/english /japanese /chinese)의 "시작 전에 읽어보면 좋은 질문 가이드".
// 새 콘텐츠 시스템을 만들지 않고 기존 매거진 글(질문형 파일럿 포함)로 연결하는 소수의 내부 링크만
// 보여준다. Server Component이며, FAQ 뒤 / 상담 폼 앞에 놓여 히어로 CTA와 첫 화면은 그대로다.
export default function LanguageGuideLinks({
  language,
  languageLabel,
}: {
  language: GuideLanguage;
  languageLabel: string;
}) {
  const articles = getLandingGuideArticles(language);
  if (articles.length === 0) return null;

  return (
    <section className="bg-surface pb-14 md:pb-20">
      <div className="section-shell">
        <RelatedLinks
          title={`${languageLabel} 수업 시작 전에 읽어보면 좋은 질문 가이드`}
          accentTextClass={ACCENT_TEXT[language]}
          links={articles.map((article) => ({
            label: article.h1,
            href: `/magazine/${article.slug}`,
            description: article.cardSummary,
          }))}
        />
        <p className="mt-4 text-[13px] text-ink-faint">
          더 많은 학습 정보는{" "}
          <Link href="/magazine" className="font-semibold text-ink-soft underline underline-offset-2">
            도란 매거진
          </Link>
          에서 볼 수 있습니다.
        </p>
      </div>
    </section>
  );
}

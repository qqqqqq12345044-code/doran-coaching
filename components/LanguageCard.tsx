import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LanguageMeta } from "@/data/languages";

const CARD_STYLES: Record<
  LanguageMeta["colorVar"],
  { tint: string; text: string; border: string; tagBg: string }
> = {
  english: {
    tint: "bg-english-tint",
    text: "text-english",
    border: "hover:border-english/40",
    tagBg: "bg-english-tint text-english-dark",
  },
  japanese: {
    tint: "bg-japanese-tint",
    text: "text-japanese",
    border: "hover:border-japanese/40",
    tagBg: "bg-japanese-tint text-japanese-dark",
  },
  chinese: {
    tint: "bg-chinese-tint",
    text: "text-chinese",
    border: "hover:border-chinese/40",
    tagBg: "bg-chinese-tint text-chinese-dark",
  },
};

// 언어 진입 카드 — 사진 없이 타이포/여백/hover만으로 고급스러움을 만든다.
// 원어민 표기를 크게 띄우는 대신 톤온톤 배지 안에 담아 "아이콘 앵커"처럼
// 정리하고, 기본 상태에서는 그림자를 절제(hover에서만 부여)해 editorial한
// 톤을 유지한다.
export default function LanguageCard({ language }: { language: LanguageMeta }) {
  const styles = CARD_STYLES[language.colorVar];

  return (
    <Link
      href={language.href}
      className={`group flex h-full flex-col rounded-xl2 border border-ink/8 bg-white p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-card ${styles.border}`}
    >
      <span
        className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${styles.tint} ${styles.text}`}
      >
        <span className={`${language.nativeFontClass} text-2xl font-medium`}>{language.nameNative}</span>
      </span>

      <h3 className="mt-5 text-2xl font-bold text-ink">{language.nameKo}</h3>
      <p className="mt-3 text-pretty whitespace-pre-line text-[15px] leading-relaxed text-ink-soft">
        {language.description}
      </p>

      <ul className="mt-6 flex flex-wrap gap-2">
        {language.tags.map((tag) => (
          <li
            key={tag}
            className={`rounded-full px-3 py-1 text-xs font-medium ${styles.tagBg}`}
          >
            {tag}
          </li>
        ))}
      </ul>

      <span className={`mt-8 inline-flex items-center gap-1.5 text-[15px] font-semibold ${styles.text}`}>
        {language.cardCta}
        <ArrowRight
          size={16}
          className="transition-transform duration-200 group-hover:translate-x-1"
          aria-hidden
        />
      </span>
    </Link>
  );
}

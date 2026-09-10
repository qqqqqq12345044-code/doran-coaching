import { languages } from "@/data/languages";
import LanguageCard from "./LanguageCard";

interface LanguageSelectSectionProps {
  eyebrow?: string;
  title?: string;
}

// title 기본값은 기존 문구를 그대로 유지한다. 홈페이지처럼 바로 위/근처에
// SelfCheck(1단계 질문 "어떤 언어를 배우고 싶으세요?")가 있는 페이지에서는
// 같은 질문형 헤딩이 페이지 안에서 반복되지 않도록 다른 문구를 넘겨 쓴다.
export default function LanguageSelectSection({
  eyebrow = "언어 선택",
  title = "어떤 언어를 배우고 싶으세요?",
}: LanguageSelectSectionProps) {
  return (
    <section className="section-pad bg-surface-soft">
      <div className="section-shell">
        <div className="max-w-lg">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="text-balance mt-3 text-[28px] font-bold leading-snug text-ink md:text-[34px]">
            {title}
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {languages.map((language) => (
            <LanguageCard key={language.slug} language={language} />
          ))}
        </div>
      </div>
    </section>
  );
}

import { languages } from "@/data/languages";
import LanguageCard from "./LanguageCard";

export default function LanguageSelectSection() {
  return (
    <section className="section-pad bg-surface-soft">
      <div className="section-shell">
        <div className="max-w-lg">
          <p className="eyebrow">언어 선택</p>
          <h2 className="text-balance mt-3 text-[28px] font-bold leading-snug text-ink md:text-[34px]">
            어떤 언어를 배우고 싶으세요?
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

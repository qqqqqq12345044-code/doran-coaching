import { MessageCircle } from "lucide-react";
import Reveal from "@/components/Reveal";

interface CurriculumTopicsSectionProps {
  eyebrow?: string;
  title: string[];
  description?: string;
  /** data/curriculum/powerCurriculum.ts 항목의 normalizedTopics 기반 짧은 Display Text. */
  topics: string[];
  accentClass?: string;
}

// content.curriculum (lib/seo/generateLocalSeoContent.ts) 을 그대로 보여주는 Section.
// 관련 항목이 없으면(topics가 비어 있으면) 억지로 채우지 않고 렌더링하지 않는다.
export default function CurriculumTopicsSection({
  eyebrow,
  title,
  description,
  topics,
  accentClass = "bg-brand-tint text-brand",
}: CurriculumTopicsSectionProps) {
  if (topics.length === 0) return null;

  return (
    <section className="section-pad bg-surface">
      <div className="section-shell">
        <Reveal className="max-w-lg">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 className="mt-3 text-[28px] font-bold leading-snug text-ink md:text-[34px]">
            {title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          {description && (
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{description}</p>
          )}
        </Reveal>

        <div className="mt-10 flex flex-wrap gap-3">
          {topics.map((topic, index) => (
            <Reveal key={topic} delay={index * 60}>
              <span
                className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-[15px] font-semibold transition-transform duration-200 hover:-translate-y-0.5 ${accentClass}`}
              >
                <MessageCircle size={14} aria-hidden />
                {topic}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

interface ProblemSectionProps {
  title: string[];
  problems: string[];
}

export default function ProblemSection({ title, problems }: ProblemSectionProps) {
  return (
    <section className="section-pad bg-surface">
      <div className="section-shell">
        <div className="max-w-lg">
          <h2 className="text-[28px] font-bold leading-snug text-ink md:text-[34px]">
            {title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {problems.map((problem) => (
            <div
              key={problem}
              className="relative rounded-xl2 border border-ink/8 bg-surface-soft px-7 py-8"
            >
              <p className="text-[16px] leading-relaxed text-ink md:text-[17px]">
                &ldquo;{problem}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

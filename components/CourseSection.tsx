import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Course } from "@/data/courses";
import Reveal from "@/components/Reveal";

interface CourseSectionProps {
  id?: string;
  eyebrow?: string;
  title: string[];
  courses: Course[];
  accentClass?: string;
}

// Quick Overview: 사진 없이 번호 배지 + 타이포 + hover 인터랙션만으로
// "프리미엄 교육 서비스의 정보 카드"를 구성한다. Course 이름/데이터는
// data/courses.ts를 그대로 재사용하고 새 문구를 추가하지 않는다.
export default function CourseSection({
  id,
  eyebrow,
  title,
  courses,
  accentClass = "bg-brand-tint text-brand",
}: CourseSectionProps) {
  return (
    <section id={id} className="section-pad bg-surface-soft scroll-mt-20">
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
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {courses.map((course, index) => {
            // href가 없는 카드(목적 개요 등)는 실제로 이동하지 않으므로, 링크 카드와
            // 같은 hover affordance(translate/shadow/arrow 강조)를 주지 않는다 —
            // 클릭 가능해 보이는데 아무 반응이 없는 혼동을 막기 위함.
            const baseClassName =
              "group flex h-full items-center justify-between gap-3 rounded-xl2 border border-ink/8 bg-white px-4 py-4 transition-all duration-200 sm:px-5";
            const linkClassName = `${baseClassName} hover:-translate-y-0.5 hover:border-ink/14 hover:shadow-card`;
            const cardContent = (
              <>
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${accentClass}`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate text-[14px] font-semibold text-ink sm:text-[15px]">
                    {course.title}
                  </span>
                </div>
                <ArrowRight
                  size={15}
                  className={`shrink-0 text-ink/20 transition-all duration-200 ${course.href ? "group-hover:translate-x-0.5 group-hover:text-ink/45" : ""}`}
                  aria-hidden
                />
              </>
            );
            return (
              <Reveal key={course.title} delay={Math.min(index * 60, 480)}>
                {course.href ? (
                  <Link href={course.href} className={linkClassName}>
                    {cardContent}
                  </Link>
                ) : (
                  <div className={baseClassName}>{cardContent}</div>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

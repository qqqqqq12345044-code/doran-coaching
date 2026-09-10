import Link from "next/link";
import { ArrowRight, MessagesSquare, Award, GraduationCap, LifeBuoy, type LucideIcon } from "lucide-react";
import Reveal from "@/components/Reveal";
import { getCourseCategoriesForLanguage, type CourseCategoryId } from "@/data/navigation/languageNavigation";
import type { LanguageSlug } from "@/data/languages";

interface CategoryOverviewGridProps {
  language: LanguageSlug;
  iconTintClass: string;
  accentTextClass: string;
}

const CATEGORY_ICONS: Record<CourseCategoryId, LucideIcon> = {
  conversation: MessagesSquare,
  certification: Award,
  school: GraduationCap,
  other: LifeBuoy,
};

// 회화/자격증/내신/기타 4개 카테고리를 "제목 + 자세히 보기 텍스트 링크"로만
// 두지 않고, 번호·아이콘·짧은 설명·대표 과정 미리보기·Arrow CTA를 한 덩어리로
// 묶은 compact card로 보여준다. 데이터는 새로 만들지 않고 Header Mega Menu와
// 동일한 data/navigation/languageNavigation.ts(COURSE_CATEGORIES, 실제 Power
// Curriculum 기반 items)를 그대로 재사용한다. 카드 CTA는 상세페이지로 이동한다.
export default function CategoryOverviewGrid({ language, iconTintClass, accentTextClass }: CategoryOverviewGridProps) {
  const categories = getCourseCategoriesForLanguage(language);

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((category, index) => {
        const Icon = CATEGORY_ICONS[category.id];
        const preview = [...new Set(category.items.map((item) => item.displayLabel))].slice(0, 3);

        return (
          <Reveal key={category.id} delay={index * 60}>
            <Link
              href={`/${language}/${category.sectionId}`}
              className="group flex h-full w-full min-w-0 flex-col rounded-xl2 border border-ink/8 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="flex items-center gap-2.5">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconTintClass}`}>
                  <Icon size={16} aria-hidden />
                </span>
                <span className="text-[11px] font-bold tracking-wide text-ink-faint">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mt-4 text-[17px] font-bold text-ink">{category.label}</h3>
              <p className="mt-2 text-pretty text-[13px] leading-relaxed text-ink-soft">{category.description}</p>

              {preview.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {preview.map((label) => (
                    <li
                      key={label}
                      className="rounded-full bg-surface-soft px-2.5 py-1 text-[11px] font-medium text-ink-soft"
                    >
                      {label}
                    </li>
                  ))}
                </ul>
              )}

              <span className={`mt-auto inline-flex items-center gap-1.5 pt-5 text-[14px] font-semibold ${accentTextClass}`}>
                자세히 보기
                <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
              </span>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { languages } from "@/data/languages";
import type { LanguageKeywordGroup } from "@/lib/seo/localHub";
import { LANGUAGE_ACCENT } from "./languageStyles";

interface LocalKeywordGroupsProps {
  groups: LanguageKeywordGroup[];
  buildHref: (keyword: string) => string;
}

// 읍/면/동 선택 이후 마지막 단계 — 언어별로 묶은 5개 keyword를 보여주고,
// 클릭하면 기존 97,905개 Local SEO URL 중 하나로 그대로 연결한다. 새 페이지를
// 만들지 않고 기존 리프 페이지(/local/[sido]/[sigungu]/[dong]/[keyword])만 가리킨다.
export default function LocalKeywordGroups({ groups, buildHref }: LocalKeywordGroupsProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-3">
      {groups.map((group) => {
        const language = languages.find((l) => l.slug === group.language);
        if (!language || group.keywords.length === 0) return null;
        const accent = LANGUAGE_ACCENT[group.language];

        return (
          <div key={group.language} className={`rounded-xl2 border bg-white p-6 ${accent.border}`}>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-[13px] font-semibold ${accent.tint}`}>
              {language.nameKo}
            </span>
            <ul className="mt-4 flex flex-col gap-0.5">
              {group.keywords.map((keyword) => (
                <li key={keyword}>
                  <Link
                    href={buildHref(keyword)}
                    className="group flex items-center justify-between gap-2 rounded-lg px-2 py-2.5 text-[14px] font-medium text-ink transition-colors hover:bg-surface-soft"
                  >
                    {keyword}
                    <ArrowRight
                      size={14}
                      className={`shrink-0 transition-transform duration-200 group-hover:translate-x-1 ${accent.text}`}
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

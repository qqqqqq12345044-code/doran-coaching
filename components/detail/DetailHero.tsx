import Image from "next/image";
import Breadcrumb from "./Breadcrumb";
import type { CurriculumLanguage } from "@/data/curriculum/powerCurriculum";

interface DetailHeroProps {
  eyebrow: string;
  h1: string;
  breadcrumbItems: { label: string; href?: string }[];
  language: CurriculumLanguage;
  imageSrc: string;
  imageAlt: string;
  chips: string[];
  accentTintClass: string;
}

// 사진 위 그라데이션만 언어별로 미세하게 다르게 해 같은 이미지를 4개
// 카테고리 페이지가 공유해도 완전히 동일해 보이지 않게 한다.
const OVERLAY_BY_LANGUAGE: Record<CurriculumLanguage, string> = {
  english: "from-white/10 to-english-dark/30",
  japanese: "from-white/10 to-japanese-dark/30",
  chinese: "from-white/10 to-chinese-dark/30",
};

// 세부 과정 페이지 전용 Compact Editorial Hero. HomeHero 같은 거대한 풀블리드
// 슬라이드가 아니라, Breadcrumb → eyebrow → H1 → chips를 왼쪽에 두고 오른쪽에
// 언어별 기존 Hero 이미지를 작게 배치하는 2-column 레이아웃이다. 새 이미지를
// 만들지 않고 /english,/japanese,/chinese 페이지와 동일한 이미지를 재사용한다.
export default function DetailHero({
  eyebrow,
  h1,
  breadcrumbItems,
  language,
  imageSrc,
  imageAlt,
  chips,
  accentTintClass,
}: DetailHeroProps) {
  return (
    <div className="border-b border-ink/8 bg-surface-soft">
      <div className="section-shell grid gap-8 py-8 sm:py-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-14 lg:py-14">
        <div>
          <Breadcrumb items={breadcrumbItems} />
          <p className="eyebrow mt-5">{eyebrow}</p>

          <h1 className="text-balance mt-2 text-[28px] font-extrabold leading-[1.25] tracking-tight text-ink sm:text-[36px] lg:text-[40px]">
            {h1}
          </h1>

          {chips.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className={`rounded-full px-3 py-1.5 text-[12.5px] font-semibold ${accentTintClass}`}
                >
                  {chip}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="relative h-[180px] w-full overflow-hidden rounded-xl2 sm:h-[220px] lg:h-[260px]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            sizes="(min-width: 1024px) 38vw, 100vw"
            className="object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${OVERLAY_BY_LANGUAGE[language]}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />
        </div>
      </div>
    </div>
  );
}

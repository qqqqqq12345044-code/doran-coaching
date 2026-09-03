import Image from "next/image";
import { Sparkles } from "lucide-react";

export type LanguageHeroAccent = "english" | "japanese" | "chinese";

interface LanguageHeroVisualProps {
  accent: LanguageHeroAccent;
  imageSrc: string;
  imageAlt: string;
  nativeWord: string;
  nativeWordFontClass: string;
  badgeLabel: string;
}

const ACCENT_STYLES: Record<LanguageHeroAccent, { gradientFrom: string; gradientTo: string }> = {
  // 사진 원색과 Navy UI가 겹쳐 무거워 보이지 않도록 옅은 warm-neutral → navy
  // 그라데이션만 사용한다(CurriculumVisualBanner와 동일한 완화 방향 유지).
  english: { gradientFrom: "from-white/20", gradientTo: "to-english-dark/20" },
  japanese: { gradientFrom: "from-white/15", gradientTo: "to-japanese-dark/20" },
  chinese: { gradientFrom: "from-white/15", gradientTo: "to-chinese-dark/20" },
};

// Editorial Hero Visual — 독립된 "사진 카드"가 아니라 Hero Section 텍스트
// 옆에 자연스럽게 이어지는 이미지 패널이다. shadow/플로팅 뱃지 카드 같은
// "카드처럼 보이게 하는 단서"는 제거하고, 좌우 모서리를 동일하게 둥글려
// (한쪽만 각지는 비대칭을 없애) 더 안정적이고 완성도 있는 프레임으로
// 정리했다. 세로로 넉넉한 높이를 유지해 텍스트 컬럼과 나란히 이어지는
// 하나의 Hero 구성처럼 보이게 한다.
export default function LanguageHeroVisual({
  accent,
  imageSrc,
  imageAlt,
  nativeWord,
  nativeWordFontClass,
  badgeLabel,
}: LanguageHeroVisualProps) {
  const styles = ACCENT_STYLES[accent];

  return (
    <div className="relative h-[260px] w-full overflow-hidden rounded-xl2 sm:h-[380px] lg:h-[520px]">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        sizes="(min-width: 1024px) 55vw, 100vw"
        className="object-cover"
      />
      <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradientFrom} ${styles.gradientTo}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/5 to-transparent" />

      <div className="relative flex h-full flex-col items-start justify-end p-6 sm:p-8">
        <span
          className={`${nativeWordFontClass} text-[44px] font-medium leading-none text-white sm:text-[56px]`}
          style={{ textShadow: "0 2px 16px rgba(0,0,0,0.35)" }}
        >
          {nativeWord}
        </span>
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
          <Sparkles size={14} aria-hidden />
          {badgeLabel}
        </div>
      </div>
    </div>
  );
}

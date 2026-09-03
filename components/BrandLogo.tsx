import Link from "next/link";
import { brand } from "@/data/brand";

// 도란 브랜드 심볼: "도란도란 이야기하다"에서 착안한, 서로 마주보고
// 이야기하는 두 마리 새를 극도로 단순한 기하학적 형태로 표현합니다.
// 원(몸통) + 원(머리) + 삼각형(부리) + 점(눈)만 사용해 24px 안팎의
// 작은 크기(Header, Favicon 등)에서도 두 마리가 뭉개지지 않고 구분됩니다.
//
// 색상은 새 팔레트를 만들지 않고 기존 DORAN 토큰 값을 그대로 사용합니다.
// 왼쪽 새 #1C1B2E → tailwind `ink` 토큰과 동일한 값(Deep Navy)
// 오른쪽 새 #E2604A → tailwind `japanese` 토큰과 동일한 값(Warm Coral)

interface BrandLogoProps {
  className?: string;
  /** 심볼만 노출하고 "도란" 텍스트는 생략합니다. (Favicon, 상담 버튼 등 향후 확장용) */
  symbolOnly?: boolean;
  /** 심볼 옆에 아주 작은 보조 영문명 "DORAN"을 함께 노출합니다. */
  showEnglish?: boolean;
  /** 어두운 배경 위에서 사용할 단색(화이트) 버전입니다. */
  light?: boolean;
}

export default function BrandLogo({
  className = "",
  symbolOnly = false,
  showEnglish = false,
  light = false,
}: BrandLogoProps) {
  return (
    <Link
      href="/"
      aria-label={`${brand.nameKo} ${brand.nameEn} 메인 페이지로 이동`}
      className={`group inline-flex items-center gap-2 ${className}`}
    >
      <BrandSymbol light={light} />
      {!symbolOnly && (
        <span className="flex items-baseline gap-1.5">
          <span
            className={`text-[23px] font-extrabold leading-none tracking-tight md:text-[25px] ${
              light ? "text-white" : "text-ink"
            }`}
          >
            {brand.nameKo}
          </span>
          {showEnglish && (
            <span
              className={`text-[10px] font-medium leading-none tracking-wide ${
                light ? "text-white/70" : "text-ink-faint"
              }`}
            >
              {brand.nameEn}
            </span>
          )}
        </span>
      )}
    </Link>
  );
}

export function BrandSymbol({ light = false }: { light?: boolean }) {
  const leftFill = light ? "#FFFFFF" : "#1C1B2E";
  const rightFill = light ? "#FFFFFF" : "#E2604A";
  const eyeFill = light ? "#1C1B2E" : "#FFFFFF";

  return (
    <svg
      viewBox="0 0 76 34"
      className="h-6 w-auto shrink-0 md:h-7"
      aria-hidden="true"
      focusable="false"
    >
      {/* 왼쪽 새 - 오른쪽(상대)을 바라봄 */}
      <g className="transition-transform duration-200 ease-out group-hover:translate-x-px">
        <ellipse cx="14" cy="21" rx="11" ry="9" fill={leftFill} />
        <circle cx="23" cy="13" r="7.5" fill={leftFill} />
        <polygon points="29.5,12.2 36,10.5 29.5,15.5" fill={leftFill} />
        <circle cx="25.2" cy="11" r="1.3" fill={eyeFill} />
      </g>

      {/* 오른쪽 새 - 왼쪽(상대)을 바라봄 (동일 형태를 좌우 반전) */}
      {/* 바깥 g: SVG 속성으로 좌우 반전(고정) / 안쪽 g: hover 시 CSS transform으로 미세 이동 */}
      <g transform="translate(76,0) scale(-1,1)">
        <g className="transition-transform duration-200 ease-out group-hover:translate-x-px">
          <ellipse cx="14" cy="21" rx="11" ry="9" fill={rightFill} />
          <circle cx="23" cy="13" r="7.5" fill={rightFill} />
          <polygon points="29.5,12.2 36,10.5 29.5,15.5" fill={rightFill} />
          <circle cx="25.2" cy="11" r="1.3" fill={eyeFill} />
        </g>
      </g>
    </svg>
  );
}

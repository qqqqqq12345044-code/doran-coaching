import { ImageResponse } from "next/og";

// iOS 홈 화면 아이콘("apple-touch-icon"). Next.js가 app/apple-icon.tsx를 자동
// 인식해 관련 <link>를 생성한다. iOS는 투명 배경을 검게 렌더링하므로 브랜드에
// 안전한 off-white(surface.soft) 배경 위에 심볼을 충분히 크게 배치해 두 마리
// 새가 작아져도 사라지지 않게 한다. 심볼 좌표는 BrandLogo.tsx와 동일하다.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const INK = "#1C1B2E";
const CORAL = "#E2604A";
const BG = "#F6F5FB";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: BG,
        }}
      >
        <svg width="128" height="57.3" viewBox="0 0 76 34">
          <g>
            <ellipse cx="14" cy="21" rx="11" ry="9" fill={INK} />
            <circle cx="23" cy="13" r="7.5" fill={INK} />
            <polygon points="29.5,12.2 36,10.5 29.5,15.5" fill={INK} />
            <circle cx="25.2" cy="11" r="1.3" fill="#FFFFFF" />
          </g>
          <g transform="translate(76,0) scale(-1,1)">
            <ellipse cx="14" cy="21" rx="11" ry="9" fill={CORAL} />
            <circle cx="23" cy="13" r="7.5" fill={CORAL} />
            <polygon points="29.5,12.2 36,10.5 29.5,15.5" fill={CORAL} />
            <circle cx="25.2" cy="11" r="1.3" fill="#FFFFFF" />
          </g>
        </svg>
      </div>
    ),
    size
  );
}

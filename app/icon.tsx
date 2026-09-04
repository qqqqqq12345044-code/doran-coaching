import { ImageResponse } from "next/og";

// 브라우저 탭 / 북마크 Favicon. Next.js App Router 파일 컨벤션(app/icon.tsx)으로
// <link rel="icon">를 자동 생성한다. components/BrandLogo.tsx의 BrandSymbol과
// 완전히 동일한 좌표(마주보는 두 마리 새)를 재사용해 새 심볼을 만들지 않는다.
// 텍스트("도란"/"DORAN")는 넣지 않고 심볼만 사용한다.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const INK = "#1C1B2E";
const CORAL = "#E2604A";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="30" height="13.4" viewBox="0 0 76 34">
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

import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

// 카카오톡 등 링크 공유 시 대표 이미지로 쓰이는 DORAN 전용 OG 썸네일.
// 파일 컨벤션(app/opengraph-image.tsx)을 사용해 모든 하위 라우트(홈/언어
// 페이지/매거진/후기/지역 SEO 등)가 별도 opengraph-image를 정의하지 않는 한
// 이 이미지를 공통으로 상속받는다. 페이지 내부 사진이 대표 이미지로 임의
// 선택되던 문제를 해결하기 위한 용도이므로 UI/Curriculum/Hero 사진과는
// 무관하다.
export const alt = "도란 DORAN — 배우는 외국어에서, 말하는 외국어로.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#1C1B2E";
const INK_SOFT = "#5B5A70";
const BRAND = "#332E73";
const BRAND_TINT = "#EDEBFB";
const CORAL = "#E2604A";
const CORAL_TINT = "#FCEBE7";
const CORAL_DARK = "#B84631";
const SURFACE_SOFT = "#F6F5FB";

export default async function OpengraphImage() {
  const fontDir = path.join(process.cwd(), "app", "og");
  const [regular, medium, bold] = await Promise.all([
    readFile(path.join(fontDir, "noto-sans-kr-400.woff")),
    readFile(path.join(fontDir, "noto-sans-kr-500.woff")),
    readFile(path.join(fontDir, "noto-sans-kr-700.woff")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          backgroundColor: SURFACE_SOFT,
          fontFamily: "Noto Sans KR",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -90,
            right: -90,
            width: 320,
            height: 320,
            borderRadius: 9999,
            background: BRAND_TINT,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -110,
            left: -110,
            width: 360,
            height: 360,
            borderRadius: 9999,
            background: CORAL_TINT,
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <svg width="98" height="44" viewBox="0 0 76 34">
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

          <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
            <span style={{ fontSize: 72, fontWeight: 700, color: INK }}>도란</span>
            <span style={{ fontSize: 28, fontWeight: 500, color: INK_SOFT, letterSpacing: 2 }}>DORAN</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 34 }}>
          <span style={{ fontSize: 44, fontWeight: 700, color: INK, lineHeight: 1.35 }}>배우는 외국어에서,</span>
          <span style={{ fontSize: 44, fontWeight: 700, color: INK, lineHeight: 1.35 }}>말하는 외국어로.</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 46 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "16px 30px",
              borderRadius: 9999,
              background: BRAND_TINT,
              color: BRAND,
              fontSize: 26,
              fontWeight: 500,
            }}
          >
            영어 · 일본어 · 중국어
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "16px 30px",
              borderRadius: 9999,
              background: CORAL_TINT,
              color: CORAL_DARK,
              fontSize: 26,
              fontWeight: 500,
            }}
          >
            1:1 화상 외국어 수업
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Noto Sans KR", data: regular, weight: 400, style: "normal" },
        { name: "Noto Sans KR", data: medium, weight: 500, style: "normal" },
        { name: "Noto Sans KR", data: bold, weight: 700, style: "normal" },
      ],
    }
  );
}

import Script from "next/script";

// GA4(Google 애널리틱스 4) 공통 태그. 사이트 전체 layout에서 1회만 렌더링한다.
// 측정 ID(예: "G-XXXXXXXXXX")는 코드에 두지 않고 NEXT_PUBLIC_GA_MEASUREMENT_ID 환경변수로만 넣는다.
// 값이 비어 있거나 "G-" 형식이 아니면 아무것도 렌더링하지 않는다 —
// 로컬/미설정 환경에서는 스크립트 로드도 수집도 없다. (NEXT_PUBLIC_* 값은 build 시점에 포함되므로
// 배포 환경에서 값을 바꾸면 다시 배포해야 반영된다.)
//
// page_view: 아래 gtag('config')가 최초 로드 시 1회 보낸다. App Router 클라이언트 이동은
// GA4 웹 스트림의 향상된 측정 "페이지 변경 기준 브라우저 기록 이벤트"(기본 켜짐)가 처리하므로
// 여기서 pathname마다 page_view를 따로 보내지 않는다(중복 집계 방지).
const rawMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";
const measurementId = /^G-[A-Z0-9]+$/.test(rawMeasurementId) ? rawMeasurementId : "";

export default function GoogleAnalytics() {
  if (!measurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${measurementId}');`}
      </Script>
    </>
  );
}

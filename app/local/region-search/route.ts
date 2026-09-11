import { NextResponse } from "next/server";
import { PUBLISHED_REGIONS_NATIONWIDE } from "@/data/seo/publishBatches";

// 지역 허브 검색창(components/local/LocalRegionSearch.tsx)이 쓰는 경량 검색
// 인덱스. 6,527개 공개 지역 전체를 클라이언트 JS 번들에 정적 import하면 홈/허브
// 페이지 초기 번들이 커지므로, 검색창을 실제로 사용할 때만(포커스 시) 별도
// 요청으로 지연 로드하게 만들었다. 응답은 [sido, sigungu, dong] 튜플 배열 —
// 객체 키를 반복하지 않아 6,527 x 3개 문자열만 남기고 payload를 최소화한다.
//
// "/local"이 이 아래에 있지만 Next.js는 실제 경로 세그먼트(region-search)를
// 동적 세그먼트([sido])보다 항상 먼저 매칭하므로 app/local/[sido]/page.tsx와
// 충돌하지 않는다.
//
// PUBLISHED_REGIONS_NATIONWIDE(data/seo/publishBatches.ts)는 fs.readFileSync로
// seo-regions.json을 읽어 build-time에 1회 계산되는 값이라 매 요청마다 다시
// 계산되지 않는다. force-static으로 이 응답 자체도 build-time에 한 번만 만들어
// CDN에 캐시되는 정적 자산으로 서빙한다.
export const dynamic = "force-static";

export async function GET() {
  const data = PUBLISHED_REGIONS_NATIONWIDE.map((region) => [region.sido, region.sigungu, region.dong]);

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}

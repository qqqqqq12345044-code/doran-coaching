import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // IndexNow key 파일(`/{key}.txt`) 제공용. 실제 key는 환경변수 INDEXNOW_KEY이며
  // app/indexnow-key/[key]/route.ts가 일치할 때만 응답한다. public/ 정적 파일
  // (구글/네이버 인증 html 등)은 rewrite보다 먼저 서빙되므로 영향이 없다.
  async rewrites() {
    return [{ source: "/:key([0-9a-fA-F-]{8,128}).txt", destination: "/indexnow-key/:key" }];
  },
};

export default nextConfig;

import { isValidIndexNowKey } from "@/lib/seo/indexnow";

// IndexNow key 파일 제공. 규격상 `https://도메인/{key}.txt`(루트)에 key 문자열만 담긴
// UTF-8 텍스트가 있어야 한다. key 값을 코드/저장소에 두지 않기 위해 환경변수
// INDEXNOW_KEY(Vercel Project Settings)를 읽고, next.config.ts의 rewrite가
// `/{key}.txt` -> `/indexnow-key/{key}`로 연결한다. 환경변수와 다른 key는 404.
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const expected = process.env.INDEXNOW_KEY;
  if (!isValidIndexNowKey(expected) || key !== expected) {
    return new Response("Not Found", { status: 404 });
  }
  return new Response(expected, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

// IndexNow(네이버 서치어드바이저 / Bing 등) 순수 헬퍼. 네트워크 호출은 하지 않는다 —
// scripts/indexnow.mts(dry-run 기본, --send에서만 요청)와 app/indexnow-key route가
// 같은 규칙을 공유한다. 규격: https://searchadvisor.naver.com/guide/indexnow-api-key
// (UTF-8, a-f A-F 0-9 -, 8~128자, 루트에 `{key}.txt`) / indexnow-request(POST, 최대 10,000 URL).

export const NAVER_INDEXNOW_ENDPOINT = "https://searchadvisor.naver.com/indexnow";
export const INDEXNOW_MAX_URLS_PER_POST = 10_000;

export function isValidIndexNowKey(key: string | undefined | null): key is string {
  return typeof key === "string" && /^[a-fA-F0-9-]{8,128}$/.test(key);
}

export function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

export interface IndexNowPayload {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}

export function buildIndexNowPayload(siteUrl: string, key: string, urlList: string[]): IndexNowPayload {
  const { host, origin } = new URL(siteUrl);
  const bad = urlList.filter((u) => new URL(u).host !== host);
  if (bad.length > 0) throw new Error(`host가 다른 URL ${bad.length}개 포함(예: ${bad[0]})`);
  if (urlList.length > INDEXNOW_MAX_URLS_PER_POST) throw new Error("POST 한 번에 10,000개를 넘을 수 없습니다");
  return { host, key, keyLocation: `${origin}/${key}.txt`, urlList };
}

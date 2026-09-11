"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { SHORT_SIDO_NAME } from "@/lib/seo/buildLocalPreview";

type RegionTuple = [sido: string, sigungu: string, dong: string];

// 6,527개 지역 검색 인덱스는 초기 페이지 JS 번들에 포함하지 않는다 — 검색창을
// 처음 사용하는 순간(포커스)에만 /local/region-search에서 지연 로드하고,
// 이후에는 이 모듈 스코프 캐시를 재사용해 다시 요청하지 않는다.
let cachedRegions: RegionTuple[] | null = null;
let inflightFetch: Promise<RegionTuple[]> | null = null;

function loadRegions(): Promise<RegionTuple[]> {
  if (cachedRegions) return Promise.resolve(cachedRegions);
  if (!inflightFetch) {
    inflightFetch = fetch("/local/region-search")
      .then((res) => res.json())
      .then((data: RegionTuple[]) => {
        cachedRegions = data;
        return data;
      });
  }
  return inflightFetch;
}

export default function LocalRegionSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [regions, setRegions] = useState<RegionTuple[] | null>(cachedRegions);
  const [loading, setLoading] = useState(false);
  const requestedRef = useRef(false);

  function ensureLoaded() {
    if (requestedRef.current) return;
    requestedRef.current = true;
    setLoading(true);
    loadRegions()
      .then(setRegions)
      .catch(() => {
        requestedRef.current = false;
      })
      .finally(() => setLoading(false));
  }

  const trimmed = query.trim();
  const results =
    trimmed.length > 0 && regions
      ? regions
          .filter(([sido, sigungu, dong]) => dong.includes(trimmed) || sigungu.includes(trimmed) || sido.includes(trimmed))
          .slice(0, 8)
      : [];

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-3 rounded-full border border-ink/12 bg-white px-5 py-3.5 shadow-soft">
        <Search size={18} className="shrink-0 text-ink-faint" aria-hidden />
        <input
          type="text"
          value={query}
          onFocus={ensureLoaded}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="동네를 검색해 보세요 (예: 역삼동)"
          className="w-full min-w-0 bg-transparent text-[15px] text-ink placeholder:text-ink-faint focus:outline-none"
          aria-label="지역 검색"
        />
      </div>

      {trimmed.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-80 overflow-y-auto rounded-xl2 border border-ink/10 bg-white p-2 shadow-card">
          {loading && <p className="px-3 py-3 text-[13px] text-ink-faint">검색 중...</p>}
          {!loading && results.length === 0 && (
            <p className="px-3 py-3 text-[13px] text-ink-faint">일치하는 지역이 없어요. 다른 동네 이름으로 검색해보세요.</p>
          )}
          {!loading &&
            results.map(([sido, sigungu, dong]) => (
              <button
                key={`${sido}-${sigungu}-${dong}`}
                type="button"
                onClick={() => router.push(`/local/${sido}/${sigungu}/${dong}`)}
                className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-surface-soft"
              >
                <span className="text-[14px] font-semibold text-ink">{dong}</span>
                <span className="shrink-0 text-[12px] text-ink-faint">
                  {SHORT_SIDO_NAME[sido] ?? sido} {sigungu}
                </span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

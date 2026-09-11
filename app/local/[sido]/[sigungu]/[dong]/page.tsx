import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbListSchema } from "@/lib/seo/schema";
import LocalKeywordGroups from "@/components/local/LocalKeywordGroups";
import { buildDisambiguatedRegionName } from "@/lib/seo/buildLocalPreview";
import {
  getAllSido,
  getSigunguList,
  getDongList,
  getCoreKeywordsByLanguage,
  isValidSido,
  isValidSigungu,
  isValidDong,
} from "@/lib/seo/localHub";

interface DongPageParams {
  sido: string;
  sigungu: string;
  dong: string;
}

// 전국 6,527개 읍/면/동 전부를 build-time에 미리 만들면 기존 리프 페이지가
// 피하려 한 것과 같은 비효율이 생긴다. 그래서 이 단계도 리프 페이지
// (app/local/.../[keyword]/page.tsx)와 동일한 전략을 쓴다 — build에는 대표
// 스모크 테스트 지역(공덕동)만 포함하고, 나머지는 dynamicParams=true로 첫
// 요청 시 on-demand 생성 후 캐시한다. 화이트리스트 밖 조합은 isValidDong()이
// 여전히 걸러 notFound() 처리한다.
export function generateStaticParams(): DongPageParams[] {
  const sido = "서울특별시";
  const sigungu = "마포구";
  const dong = "공덕동";
  if (!isValidDong(sido, sigungu, dong)) return [];
  return [{ sido, sigungu, dong }];
}

export const dynamicParams = true;
export const revalidate = 86400;

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

async function loadPageData(paramsPromise: Promise<DongPageParams>) {
  const raw = await paramsPromise;
  const sido = safeDecode(raw.sido);
  const sigungu = safeDecode(raw.sigungu);
  const dong = safeDecode(raw.dong);
  if (!isValidSido(sido) || !isValidSigungu(sido, sigungu) || !isValidDong(sido, sigungu, dong)) {
    notFound();
  }
  return { sido, sigungu, dong };
}

export async function generateMetadata({ params }: { params: Promise<DongPageParams> }): Promise<Metadata> {
  const { sido, sigungu, dong } = await loadPageData(params);
  const displayName = buildDisambiguatedRegionName(sido, sigungu, dong);
  return {
    title: `${displayName} 외국어 코칭 | 도란`,
    description: `${displayName}에서 영어·일본어·중국어 1:1 온라인 화상 코칭을 찾고 있다면, 원하는 언어와 목적을 선택해 바로 시작해보세요.`,
    alternates: { canonical: `/local/${sido}/${sigungu}/${dong}` },
  };
}

export default async function DongHubPage({ params }: { params: Promise<DongPageParams> }) {
  const { sido, sigungu, dong } = await loadPageData(params);
  const displayName = buildDisambiguatedRegionName(sido, sigungu, dong);
  const keywordGroups = getCoreKeywordsByLanguage();

  const breadcrumbItems = [
    { label: "홈", href: "/" },
    { label: "지역별", href: "/local" },
    { label: sido, href: `/local/${sido}` },
    { label: sigungu, href: `/local/${sido}/${sigungu}` },
    { label: dong },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbListSchema(breadcrumbItems)} />
      <Breadcrumb items={breadcrumbItems} />

      <section className="bg-surface py-14 md:py-16">
        <div className="section-shell">
          <div className="max-w-2xl">
            <p className="eyebrow">{sido} · {sigungu} · {dong}</p>
            <h1 className="text-balance mt-3 text-[26px] font-extrabold leading-tight text-ink md:text-[34px]">
              {displayName} 외국어 코칭, 언어와 목적을 선택하세요
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              {displayName}에서도 이동 없이 1:1 온라인 화상으로 시작할 수 있어요. 아래에서 배우고
              싶은 언어와 목적을 고르면 관련 코칭 페이지로 바로 연결됩니다.
            </p>
          </div>

          <div className="mt-10">
            <LocalKeywordGroups
              groups={keywordGroups}
              buildHref={(keyword) => `/local/${sido}/${sigungu}/${dong}/${keyword}`}
            />
          </div>
        </div>
      </section>

      <section className="bg-surface-soft py-12 text-center md:py-14">
        <div className="section-shell">
          <Link
            href={`/local/${sido}/${sigungu}`}
            className="text-[14px] font-semibold text-brand underline-offset-4 hover:underline"
          >
            {sigungu}의 다른 읍/면/동도 살펴보기
          </Link>
        </div>
      </section>
    </>
  );
}

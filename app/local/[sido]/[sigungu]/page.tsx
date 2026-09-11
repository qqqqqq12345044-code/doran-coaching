import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbListSchema } from "@/lib/seo/schema";
import LocalChipLinkGrid from "@/components/local/LocalChipLinkGrid";
import { languages } from "@/data/languages";
import { getAllSido, getSigunguList, getDongList, isValidSido, isValidSigungu } from "@/lib/seo/localHub";

interface SigunguPageParams {
  sido: string;
  sigungu: string;
}

// 전국 시/군/구 조합은 255개(6,527개 지역보다 훨씬 작다) — 전부 build-time에
// 미리 만들어도 비용이 작아 그대로 generateStaticParams에 전부 담는다.
export function generateStaticParams(): SigunguPageParams[] {
  return getAllSido().flatMap((sido) => getSigunguList(sido).map((sigungu) => ({ sido, sigungu })));
}

export const dynamicParams = true;
// 정적 데이터만 사용하는 결정적 콘텐츠라 시간 기반 재검증이 필요 없다.
// false = 영구 캐시, 다음 배포 시에만 갱신(2026-09 ISR Writes 초과 대응 —
// 상세 이유는 [keyword]/page.tsx 참고).
export const revalidate = false;

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

async function loadPageData(paramsPromise: Promise<SigunguPageParams>) {
  const raw = await paramsPromise;
  const sido = safeDecode(raw.sido);
  const sigungu = safeDecode(raw.sigungu);
  if (!isValidSido(sido) || !isValidSigungu(sido, sigungu)) notFound();
  return { sido, sigungu };
}

export async function generateMetadata({ params }: { params: Promise<SigunguPageParams> }): Promise<Metadata> {
  const { sido, sigungu } = await loadPageData(params);
  return {
    title: `${sigungu} 외국어 코칭 | 도란`,
    description: `${sigungu} 읍/면/동별로 영어·일본어·중국어 1:1 온라인 화상 코칭 페이지를 찾아보세요.`,
    alternates: { canonical: `/local/${sido}/${sigungu}` },
  };
}

export default async function SigunguHubPage({ params }: { params: Promise<SigunguPageParams> }) {
  const { sido, sigungu } = await loadPageData(params);
  const dongList = getDongList(sido, sigungu);

  const breadcrumbItems = [
    { label: "홈", href: "/" },
    { label: "지역별", href: "/local" },
    { label: sido, href: `/local/${sido}` },
    { label: sigungu },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbListSchema(breadcrumbItems)} />
      <Breadcrumb items={breadcrumbItems} />

      <section className="bg-surface py-14 md:py-16">
        <div className="section-shell">
          <div className="max-w-2xl">
            <p className="eyebrow">
              {sido} · {sigungu}
            </p>
            <h1 className="text-balance mt-3 break-keep text-[26px] font-extrabold leading-tight text-ink md:text-[34px]">
              {sigungu} <span className="whitespace-nowrap">읍/면/동별</span> 외국어 코칭
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              읍/면/동을 선택하면 영어·일본어·중국어 중 원하는 언어와 목적을 골라 코칭 페이지로
              바로 이동할 수 있어요.
            </p>
          </div>

          <div className="mt-10">
            <LocalChipLinkGrid
              items={dongList.map((dong) => ({
                label: dong,
                href: `/local/${sido}/${sigungu}/${dong}`,
              }))}
            />
          </div>
        </div>
      </section>

      <section className="bg-surface-soft py-12 text-center md:py-14">
        <div className="section-shell">
          <Link
            href={`/local/${sido}`}
            className="text-[14px] font-semibold text-brand underline-offset-4 hover:underline"
          >
            {sido}의 다른 시/군/구도 살펴보기
          </Link>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {languages.map((language) => (
              <Link key={language.slug} href={language.href} className="btn-secondary">
                {language.nameKo} 과정 보기
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

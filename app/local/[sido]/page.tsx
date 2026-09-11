import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbListSchema } from "@/lib/seo/schema";
import LocalRegionLinkList from "@/components/local/LocalRegionLinkList";
import { languages } from "@/data/languages";
import { getAllSido, getSigunguList, getDongCount, isValidSido } from "@/lib/seo/localHub";

interface SidoPageParams {
  sido: string;
}

// 시/도 15개(세종특별자치시는 sigungu가 없어 기존 Local SEO 화이트리스트에서도
// 이미 제외됨) 전부를 build-time에 미리 만든다 — 개수가 작아 build 비용이
// 거의 없다. dynamicParams=true는 유지하되(app/local/.../[keyword]/page.tsx와
// 동일한 안전장치), 실제 검증은 loadPageData의 isValidSido()가 담당한다.
export function generateStaticParams(): SidoPageParams[] {
  return getAllSido().map((sido) => ({ sido }));
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

async function loadPageData(paramsPromise: Promise<SidoPageParams>) {
  const raw = await paramsPromise;
  const sido = safeDecode(raw.sido);
  if (!isValidSido(sido)) notFound();
  return { sido };
}

export async function generateMetadata({ params }: { params: Promise<SidoPageParams> }): Promise<Metadata> {
  const { sido } = await loadPageData(params);
  return {
    title: `${sido} 외국어 코칭 | 도란`,
    description: `${sido} 시/군/구별로 영어·일본어·중국어 1:1 온라인 화상 코칭 페이지를 찾아보세요.`,
    alternates: { canonical: `/local/${sido}` },
  };
}

export default async function SidoHubPage({ params }: { params: Promise<SidoPageParams> }) {
  const { sido } = await loadPageData(params);
  const sigunguList = getSigunguList(sido);

  const breadcrumbItems = [
    { label: "홈", href: "/" },
    { label: "지역별", href: "/local" },
    { label: sido },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbListSchema(breadcrumbItems)} />
      <Breadcrumb items={breadcrumbItems} />

      <section className="bg-surface py-14 md:py-16">
        <div className="section-shell">
          <div className="max-w-2xl">
            <p className="eyebrow">{sido}</p>
            <h1 className="text-balance mt-3 break-keep text-[26px] font-extrabold leading-tight text-ink md:text-[34px]">
              {sido} <span className="whitespace-nowrap">시/군/구별</span> 외국어 코칭
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              시/군/구를 선택하면 읍/면/동까지 이어서 살펴볼 수 있어요. 이동 없이 1:1 온라인
              화상으로 진행되는 수업이라 {sido} 어디에서든 이용할 수 있습니다.
            </p>
          </div>

          <div className="mt-10">
            <LocalRegionLinkList
              items={sigunguList.map((sigungu) => ({
                label: sigungu,
                href: `/local/${sido}/${sigungu}`,
                sublabel: `읍/면/동 ${getDongCount(sido, sigungu)}곳`,
              }))}
            />
          </div>
        </div>
      </section>

      <section className="bg-surface-soft py-12 text-center md:py-14">
        <div className="section-shell">
          <p className="text-[14px] text-ink-soft">원하는 언어 전체 과정도 함께 살펴보세요.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
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

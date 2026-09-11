import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbListSchema } from "@/lib/seo/schema";
import LocalRegionSearch from "@/components/local/LocalRegionSearch";
import { languages } from "@/data/languages";
import { getSidoGroupedByRegion } from "@/lib/seo/localHub";

// 지역 허브 최상위 페이지. 기존 Local SEO 4-segment route
// (/local/[sido]/[sigungu]/[dong]/[keyword])와 세그먼트 깊이가 달라 그대로
// 공존한다(app/local/page.tsx는 0-depth, 기존 리프는 4-depth) — Next.js App
// Router는 같은 디렉토리 아래 정적 route(page.tsx)와 동적 세그먼트([sido])가
// 서로 다른 깊이에서 충돌 없이 공존하는 것을 표준으로 지원한다.
//
// 이 페이지는 동적 데이터를 요청 시점에 조회하지 않고(전부 build-time에 고정된
// PUBLISHED_REGIONS_NATIONWIDE 기반) 별도 설정 없이 정적으로 렌더링된다.

const SIDO_TOTAL_COUNT = getSidoGroupedByRegion().reduce((sum, group) => sum + group.sidoList.length, 0);

export const metadata: Metadata = {
  title: "전국 지역별 외국어 코칭 | 도란",
  description:
    "전국 시/도·시/군/구·읍/면/동에서 영어·일본어·중국어 1:1 온라인 화상 코칭을 찾아보세요. 지역과 목적을 선택하면 관련 코칭 페이지로 이어집니다.",
  alternates: { canonical: "/local" },
};

export default function LocalHubPage() {
  const breadcrumbItems = [
    { label: "홈", href: "/" },
    { label: "지역별" },
  ];
  const regionGroups = getSidoGroupedByRegion();

  return (
    <>
      <JsonLd data={buildBreadcrumbListSchema(breadcrumbItems)} />
      <Breadcrumb items={breadcrumbItems} />

      <section className="bg-surface px-6 pb-14 pt-14 md:pb-16 md:pt-20">
        <div className="section-shell">
          <div className="max-w-2xl">
            <p className="eyebrow">전국 지역별 코칭</p>
            <h1 className="text-balance mt-4 text-[30px] font-extrabold leading-tight text-ink md:text-[40px]">
              전국 어디서든, 내 지역에서 찾는
              <br />
              1:1 온라인 외국어 코칭
            </h1>
            <p className="mt-5 text-[16px] leading-relaxed text-ink-soft">
              영어·일본어·중국어를 시/도부터 읍/면/동까지 지역별로 살펴보세요. 화상 수업이라 이동은
              없지만, 내가 사는 동네를 기준으로 코칭 페이지를 바로 찾을 수 있어요.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {languages.map((language) => (
                <span
                  key={language.slug}
                  className="rounded-full border border-ink/10 bg-surface-soft px-4 py-1.5 text-[13px] font-medium text-ink-soft"
                >
                  {language.nameKo}
                </span>
              ))}
            </div>

            <div className="mt-8 max-w-xl">
              <LocalRegionSearch />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-soft px-6 py-14 md:py-16">
        <div className="section-shell">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">시/도 선택</p>
              <h2 className="mt-2 text-[22px] font-bold text-ink md:text-[26px]">
                권역별로 지역을 살펴보세요
              </h2>
            </div>
            <p className="hidden shrink-0 text-[13px] text-ink-faint sm:block">전국 {SIDO_TOTAL_COUNT}개 시/도</p>
          </div>

          <div className="mt-9 flex flex-col gap-9">
            {regionGroups.map((group) => (
              <div key={group.label}>
                <p className="text-[13px] font-semibold text-ink-faint">{group.label}</p>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {group.sidoList.map((sido) => (
                    <Link
                      key={sido}
                      href={`/local/${sido}`}
                      className="group flex items-center justify-between gap-2 rounded-xl2 border border-ink/10 bg-white px-4 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-card"
                    >
                      <span className="min-w-0 truncate text-[14px] font-semibold text-ink">{sido}</span>
                      <ArrowRight
                        size={15}
                        className="shrink-0 text-ink-faint transition-transform duration-200 group-hover:translate-x-1 group-hover:text-brand"
                        aria-hidden
                      />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface px-6 py-14 text-center md:py-16">
        <div className="section-shell">
          <p className="text-[15px] text-ink-soft">
            원하는 언어 전체 과정이 궁금하다면 언어별 페이지에서도 살펴볼 수 있어요.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
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

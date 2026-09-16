import Link from "next/link";
import { BrandSymbol } from "@/components/BrandLogo";

// App Router는 이 파일이 없으면 Next.js 기본 404 페이지(Header/Footer 없이 완전히
// 빈 페이지)를 대신 렌더링한다. 이 파일을 두면 루트 layout.tsx의 Header/Footer가
// 그대로 감싸므로, 잘못된 URL로 들어온 사용자도 홈/매거진/지역별 페이지로 바로
// 돌아갈 수 있다. 새 디자인 시스템을 만들지 않고 기존 유틸리티 클래스만 재사용한다.
export default function NotFound() {
  return (
    <section className="section-pad">
      <div className="section-shell max-w-lg text-center">
        <BrandSymbol className="mx-auto h-9 w-auto opacity-90 md:h-10" />
        <p className="eyebrow mt-6">404</p>
        <h1 className="text-balance mt-4 text-[28px] font-extrabold leading-tight text-ink md:text-[34px]">
          찾으시는 페이지가 없어요
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
          주소가 바뀌었거나 잘못 입력됐을 수 있어요. 아래에서 원하는 곳으로 이동해보세요.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="btn-primary">
            홈으로 가기
          </Link>
          <Link href="/magazine" className="btn-secondary">
            매거진 보기
          </Link>
          <Link href="/local" className="btn-secondary">
            지역별로 찾기
          </Link>
        </div>
      </div>
    </section>
  );
}

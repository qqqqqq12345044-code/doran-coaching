import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";

interface AnchorLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

// 같은 페이지 안의 "#id" 이동 전용 링크. Next.js <Link>는 hash-only 이동에서도
// history.pushState + 수동 scrollIntoView를 거치기 때문에 브라우저의 native
// anchor scroll이 스킵되어 html { scroll-behavior: smooth }가 적용되지 않는
// 경우가 있다. 순수 <a href="#id">는 브라우저가 직접 처리하는 native fragment
// navigation이라 CSS smooth scroll이 그대로 적용된다. "#"로 시작하지 않는 실제
// 경로(다른 페이지 이동)는 그대로 next/link로 위임한다.
export default function AnchorLink({ href, ...props }: AnchorLinkProps) {
  if (href.startsWith("#")) {
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    return <a href={href} {...props} />;
  }
  return <Link href={href} {...props} />;
}

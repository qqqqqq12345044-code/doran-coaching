import Link from "next/link";
import { brand } from "@/data/brand";
import BrandLogo from "@/components/BrandLogo";

const SERVICE_LINKS = [
  { label: "영어", href: "/english" },
  { label: "일본어", href: "/japanese" },
  { label: "중국어", href: "/chinese" },
];

const INFO_LINKS = [
  { label: "매거진", href: "/magazine" },
  { label: "수강후기", href: "/reviews" },
  { label: "상담 신청", href: "#consultation" },
];

export default function Footer() {
  return (
    <footer className="border-t border-ink/5 bg-surface-soft">
      <div className="section-shell grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
        <div>
          <BrandLogo showEnglish />
          <p className="mt-4 whitespace-pre-line text-[15px] font-semibold leading-relaxed text-ink">
            {brand.tagline.lines.join("\n")}
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
            {brand.footerServiceLine}
            <br />
            {brand.footerSubLine}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">과외 과목</p>
          <ul className="mt-4 space-y-3">
            {SERVICE_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-ink-soft transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink">서비스 안내</p>
          <ul className="mt-4 space-y-3">
            {INFO_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-ink-soft transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-ink/5">
        <div className="section-shell py-8 text-xs leading-relaxed text-ink-faint">
          <p>
            © {new Date().getFullYear()} {brand.nameEn}. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

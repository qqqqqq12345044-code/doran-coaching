import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_JP, Noto_Serif_SC } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingConsultationButton from "@/components/FloatingConsultationButton";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-pretendard",
  display: "swap",
});

const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-noto-serif-jp",
  display: "swap",
});

const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-noto-serif-sc",
  display: "swap",
});

const siteUrl = "https://dorancoaching.com";
const siteTitle = "도란 DORAN | 영어·일본어·중국어 1:1 외국어 과외";
const siteDescription =
  "영어, 일본어, 중국어를 각 분야 전문 코치와 1:1로 배우는 도란. 회화부터 내신, JLPT·HSK 시험 대비까지 목표에 맞춘 맞춤 커리큘럼을 제공합니다.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: "도란 DORAN",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} ${notoSerifJP.variable} ${notoSerifSC.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingConsultationButton />
      </body>
    </html>
  );
}
